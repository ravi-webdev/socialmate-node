const FormData = require('form-data');
const fetch = require('node-fetch');
const axios = require('./axiosMageInstance');
const APIError = require('../utils/APIError');

exports.generateOTP = async (number) => {
  console.log(number);
  const url = `https://2factor.in/API/V1/${process.env.SMS_KEY}/SMS/+91${number}/AUTOGEN`;
  const sessionData = (await axios.get(url)).data;
  console.log(sessionData);
  if (sessionData.Status === 'Error') {
    throw new APIError({ message: sessionData.Details, status: 500 });
  }
  return { sessionId: sessionData.Details };
};

exports.verifyOTP = async ({ sessionId, otp }) => {
  const url = `https://2factor.in/API/V1/${process.env.SMS_KEY}/SMS/VERIFY/${sessionId}/${otp}`;
  const { data } = await axios.get(url);
  if (data.Status === 'Error') {
    throw new APIError({ message: data.Details, status: 401 });
  }
  return true;
};

exports.sendMessageOnPhone = async (data, couponCode) => {

  console.log(data);

  const bodyFormData = new FormData();

  bodyFormData.append('From', 'CUREVE');
  bodyFormData.append('To', (data.To || data[0].Phone));
  bodyFormData.append('TemplateName', 'Coupon10Percent');
  bodyFormData.append('VAR1', (data.VAR1 || data[0].Name));
  bodyFormData.append('VAR2', couponCode);

  const options = {
    headers: { 'Content-Type': 'multipart/form-data' },
  };

  const requestURL = `https://2factor.in/API/V1/${process.env.SMS_KEY}/ADDON_SERVICES/SEND/TSMS`;
  console.log(requestURL);
  const sessionData = (await fetch(requestURL, {
    method: 'post',
    body: bodyFormData,
    config: options,
  }).then((response) => {
    return response.json();
  }));

  if (sessionData.Status === 'Error') {
    throw new APIError({ message: sessionData.Details, status: 500 });
  }
  return { sessionId: sessionData.Details };
};
