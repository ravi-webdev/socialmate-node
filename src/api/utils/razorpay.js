const ax = require('axios');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { path } = require('ramda');

const instance = new Razorpay({
  key_id: process.env.RZP_KEY,
  key_secret: process.env.RZP_SECRET,
});

/*
  req: {
    amount: 50000,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11",//
    payment_capture: '0'
  }

  res: {
    "id": "order_4xbQrmEoA5WJ0G",
    "entity": "order",
    "amount": 50000,
    "currency": "INR",
    "receipt": "order_rcptid_11",
    "status": "created",
    "attempts": 0,
    "created_at": 1455696638,
    "notes": {}
  }
 */

exports.createOrderEntity = async (options) => {
  const data = await instance.orders.create(options);
  return data;
};


exports.rzpVerify = async (data, orderTotal) => {
  const url = `https://${process.env.RZP_KEY}:${process.env.RZP_SECRET}@api.razorpay.com/v1/payments/${data.razorpay_payment_id}`;
  const key = process.env.RZP_SECRET;
  const message = `${data.razorpay_order_id}|${data.razorpay_payment_id}`;
  const hash = crypto.createHmac('sha256', key).update(message).digest('hex');
  if (hash === data.razorpay_signature) {
    if (Math.trunc(Number(path(['data', 'amount'], await ax.get(url)))) === Math.trunc(orderTotal * 100)) {
      return [true, `orderEntity:${data.razorpay_order_id},paymentEntity:${data.razorpay_payment_id}`];
    }
  }
  return [false];
};


exports.rzpCapture = async ({ id, amount }) => {
  const url = `https://${process.env.RZP_KEY}:${process.env.RZP_SECRET}@api.razorpay.com/v1/payments/${id}/capture`;
  const response = await ax.post(url, {
    amount,
  });
  return response;
};

exports.rzpRefund = async ({ id, amount }) => {
  const url = `https://${process.env.RZP_KEY}:${process.env.RZP_SECRET}@api.razorpay.com/v1/payments/${id}/refund`;
  const response = await ax.post(url, {
    amount,
  });
  return response;
};
