const crypto = require('crypto');

/**
 * Verify PayU Hash
 * @param {Object} data - Data required to generate hash
 * @param {string} data.txnid - Order Id
 * @param {string} data.paymentId - Bolt Payment Id
 * @param {string} data.amount - Order total
 * @param {string} data.productinfo - Concatenated Order Item Ids & qtys like 321|1,322|4
 * @param {string} data.productinfo - User first name
 * @param {string} data.email - User email
 * @param {string} data.udf5 - User defined field 5 can be used to force payment method
 * @param {string} data.status - Status returned by Bolt
 * @param {string} data.resphash - Response hash returned by Bolt
 */
exports.payuVerify = async (data = {}) => {
  const {
    mihpayid: paymentId,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf5 = 'BOLT_KIT_NODE_JS',
    // mihpayid,
    status,
    hash,
  } = data;
  const keyString = `${process.env.PAYU_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||${udf5}|||||`;
  const keyArray = keyString.split('|');
  const reverseKeyArray = keyArray.reverse();
  const reverseKeyString = `${process.env.PAYU_SALT}|${status}|${reverseKeyArray.join('|')}`;
  const cryp = crypto.createHash('sha512');
  cryp.update(reverseKeyString);
  const calchash = cryp.digest('hex');
  if (calchash === hash) {
    return [true, `payuId: ${paymentId}`];
  }
  return [false];
};

/**
 * Generate PayU Hash.
 * @param {Object} data - Data required to generate hash
 * @param {string} data.firstName - User first name
 * @param {string} data.orderId - Order Id
 * @param {string} data.amount - Order total
 * @param {string} data.productInfo - Concatenated Order Item Ids & qtys like 321|1,322|4
 * @param {string} data.email - User email
 */

function getPayuHash(data) {
  const cryp = crypto.createHash('sha512');
  const text = `${process.env.PAYU_KEY}|${data.orderId}|${parseFloat(data.amount).toFixed(2)}|${data.productInfo}|${data.firstName}|${data.email}|||||BOLT_KIT_NODE_JS||||||${process.env.PAYU_SALT}`;
  cryp.update(text);
  return cryp.digest('hex');
}

exports.getBoltParams = (order) => {
  const { firstname } = order.billing_address;
  const key = process.env.PAYU_KEY;
  const txnid = String(order.entity_id);
  const amount = parseFloat(order.grand_total).toFixed(2);
  const { email } = order.billing_address;
  const phone = order.billing_address.telephone;
  const productinfo = order.items.reduce((acc, currentItem) => `${acc.length ? `${acc},` : ''}${currentItem.sku}${currentItem.qty_ordered}`, '');
  const surl = 'https://curevedapwa.evolvable.ai/response.html';
  const furl = 'https://curevedapwa.evolvable.ai/response.html';
  const hash = getPayuHash({
    firstName: firstname,
    orderId: txnid,
    amount,
    productInfo: productinfo,
    email,
  });
  return {
    firstname,
    key,
    txnid,
    amount,
    email,
    phone,
    productinfo,
    surl,
    furl,
    hash,
    udf5: 'BOLT_KIT_NODE_JS',
  };
};

exports.getPayuHash = getPayuHash;
