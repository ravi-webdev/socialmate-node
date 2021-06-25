/* eslint-disable camelcase */
const axios = require('axios');

exports.facebook = async (access_token) => {
  const fields = 'id, name, email, picture';
  const url = 'https://graph.facebook.com/me';
  const params = { access_token, fields };
  const response = await axios.get(url, { params });
  const {
    id, name, email, picture,
  } = response.data;
  const firstName = name.split(' ')[0];
  const lastName = name.split(' ').slice(1).join(' ');
  return {
    service: 'facebook',
    picture: picture.data.url,
    id,
    firstName,
    lastName,
    email,
  };
};

exports.google = async (access_token) => {
  const url = 'https://www.googleapis.com/oauth2/v3/userinfo';
  const params = { access_token };
  const response = await axios.get(url, { params });
  const {
    sub, name, email, picture,
  } = response.data;
  const firstName = name.split(' ')[0];
  const lastName = name.split(' ').slice(1).join(' ');
  return {
    service: 'google',
    picture,
    id: sub,
    firstName,
    lastName,
    email,
  };
};
