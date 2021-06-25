/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
const checksum = require('./checksum');
const config = require('./config');
const Paytm = require('paytmchecksum');
const axios = require('../../utils/axiosMageInstance');

const paytmHost = (process.env.NODE_ENV !== 'production' ? 'https://securegw-stage.paytm.in' : 'https://securegw.paytm.in');
const paytmKey = (process.env.NODE_ENV !== 'production' ? config.PaytmConfig.testKey : config.PaytmConfig.liveKey);
const mid = (process.env.NODE_ENV !== 'production' ? config.PaytmConfig.testMid : config.PaytmConfig.liveMid);
const industryTypeId = (process.env.NODE_ENV !== 'production' ? config.PaytmConfig.testIndustryTypeId : config.PaytmConfig.liveIndustryTypeId);
const website = (process.env.NODE_ENV !== 'production' ? config.PaytmConfig.testWebsite : config.PaytmConfig.liveWebsite);

exports.createPaytmOrderEntity = async (orderParams) => {
  if (!orderParams.grand_total || !orderParams.billing_address.email || !orderParams.billing_address.telephone) {
    return ('Payment failed');
  }
  const params = {};
  params.MID = mid;
  params.WEBSITE = website;
  params.CHANNEL_ID = 'WEB';
  params.INDUSTRY_TYPE_ID = industryTypeId;
  params.ORDER_ID = orderParams.increment_id.toString();
  params.CUST_ID = orderParams.customer_id.toString();
  params.TXN_AMOUNT = orderParams.grand_total.toString();
  params.CALLBACK_URL = `${process.env.SELF}/v1/paytm/callback`;
  params.EMAIL = orderParams.billing_address.email;
  params.MOBILE_NO = orderParams.billing_address.telephone.toString();

  return params;
};

exports.initiatePaytmTransaction = async (paytmParams, order) => {
  const paytmParamsPromise = {
    body: {
      requestType: 'Payment',
      mid: paytmParams.MID,
      orderId: order.increment_id,
      websiteName: paytmParams.WEBSITE,
      callbackUrl: paytmParams.CALLBACK_URL,
      txnAmount: {
        value: paytmParams.TXN_AMOUNT,
        currency: 'INR',
      },
      userInfo: {
        custId: order.customer_id,
      },
    },
  };

  const paytmChecksum = await Paytm.generateSignature(JSON.stringify(paytmParamsPromise.body), paytmKey);

  const response = await axios.post(`${paytmHost}/theia/api/v1/initiateTransaction?mid=${paytmParams.MID}&orderId=${order.increment_id}`, {

    body: {
      requestType: 'Payment',
      mid: paytmParams.MID,
      orderId: order.increment_id,
      websiteName: paytmParams.WEBSITE,
      callbackUrl: paytmParams.CALLBACK_URL,
      txnAmount: {
        value: paytmParams.TXN_AMOUNT,
        currency: 'INR',
      },
      userInfo: {
        custId: order.customer_id,
      },
    },
    head: {
      signature: paytmChecksum,
    },

  });
  console.log(response);
  return response.data;
};

exports.paytmVerify = async (data, orderTotal) => {
  const paytmParams = {};
  let paytmChecksum = '';

  for (const key in data) {
    if (key === 'CHECKSUMHASH') {
      paytmChecksum = data[key];
    } else {
      paytmParams[key] = data[key];
    }
  }

  const isValidChecksum = checksum.verifychecksum(paytmParams, paytmKey, paytmChecksum);

  if (isValidChecksum) {
    const paytmChecksumGenerate = {
      body: {
        mid: data.MID,
        orderId: data.ORDERID,
      },
    };

    const repaytmChecksum = await Paytm.generateSignature(JSON.stringify(paytmChecksumGenerate.body), paytmKey);
    console.log(`${paytmHost}/v3/order/status`);
    console.log(repaytmChecksum);
    console.log(paytmChecksumGenerate);
    const response = await axios.post(`${paytmHost}/v3/order/status`, {
      ...paytmChecksumGenerate,
      head:
        {
          signature: repaytmChecksum,
        },
    });

    const responsebody = response.data.body;
    if ((responsebody.resultInfo.resultStatus === 'TXN_SUCCESS')) {
      console.dir(response.data.body);
      return [true, `orderEntity:${responsebody.txnId},paymentEntity:${responsebody.bankTxnId}`];
    }

    return [false, 'No Comments'];
  }

  return [false, 'No Comments'];
};
