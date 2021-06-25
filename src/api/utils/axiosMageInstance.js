const axios = require('axios');
const { apiUrl } = require('../../config/config');
const authHeader = require('../helpers/authHeaders');

module.exports = axios.create({
  baseURL: apiUrl,
  // timeout: 20000000,
  ...authHeader,
});
