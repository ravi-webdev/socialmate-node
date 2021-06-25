/* eslint-disable import/prefer-default-export */
const { rzpVerify } = require('./razorpay');
const { paypalVerify } = require('./paypal');
const { paytmVerify } = require('./paytm');
const { payuVerify } = require('./payu');

exports.verifyPayment = type => async (data = {}, orderTotal) => {
  switch (type) {
    case 'paypal': {
      const result = await paypalVerify(data.id, orderTotal);
      return result; // [true, `paypalId: ${data.id}`];
    }
    case 'razorpay':
      return rzpVerify(data, orderTotal);
    case 'paytm':
      return paytmVerify(data, orderTotal);
    case 'payu':
      return payuVerify(data, orderTotal);
    case 'cod':
      return [true, 'cod'];
    case 'free': {
      if (Number(orderTotal) === 0) {
        return [true, 'free'];
      }
      return [false];
    }
    default:
      return [false];
  }
};
