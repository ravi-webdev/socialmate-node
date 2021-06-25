const axios = require('axios');
const qs = require('qs');
const { path } = require('ramda');
const cache = require('../../config/redis-cache');

// const options = {
//   method: 'post',
//   headers: {
//     'content-type': 'application/x-www-form-urlencoded',
//     'Access-Control-Allow-Credentials': true
//   },
//   data: qs.stringify(data),
//   auth: auth,
//   url,
// };

const baseUrl = process.env.NODE_ENV === 'development' ? 'https://api.sandbox.paypal.com/v1' : 'https://api.paypal.com/v1';

async function generatePaypalToken() {
  try {
    const tokenData = await axios.post(`${baseUrl}/oauth2/token`, qs.stringify({
      grant_type: 'client_credentials',
    }), {
      headers: {
        // Accept: 'application/json',
        'Accept-Language': 'en_US',
        // Authorization: `Basic ${process.env.PAYPAL_AUTH}`,
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: process.env.PAYPAL_CLIENT,
        password: process.env.PAYPAL_SECRET,
      },
    });
    const datum = await new Promise((resolve, reject) => {
      cache.add(
        'paypalToken',
        tokenData.data.access_token,
        { expire: tokenData.data.expires_in - 120 },
        (err, added) => {
          if (err) {
            reject(err);
          } else if (added) {
            console.log(added, tokenData.data.access_token);
            resolve(tokenData.data.access_token);
          }
        },
      );
    });
    return datum;
  } catch (e) {
    console.dir(e);
    return null;
  }
}

exports.paypalVerify = async function Verify(id, orderTotal) {
  const accessToken = await new Promise((resolve, reject) => {
    cache.get('paypalToken', async (err, data) => {
      let token = false;
      if (!data.length) {
        token = await generatePaypalToken();
      } else {
        token = data[0].body;
      }
      if (!token) {
        reject(new Error('Can not get paypal token'));
      }
      resolve(token);
    });
  });
  try {
    const orderData = await axios.get(`${baseUrl}/checkout/orders/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (Math.trunc(Number(path(['data', 'purchase_units', 0, 'amount', 'total'], orderData))) === Math.trunc(Number(orderTotal))) {
      return [true, `paypalId: ${id}`];
    }
  } catch (e) {
    return [false];
  }
  return [false];
};
