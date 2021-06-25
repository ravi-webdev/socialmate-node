const { apiUrl } = require('../../config/config');
const axios = require('./axiosMageInstance');

exports.applyMageAddressesToUser = async (user) => {
  const objectToAssign = {};
  if (user.mageId) {
    try {
      const addressResponse = await axios.get(`${apiUrl}/Addressapi/customerid/${user.mageId}`);
      addressResponse.data = addressResponse.data.map(i => ({ ...i, street: i.street.split('\n') }));
      objectToAssign.addresses = addressResponse.data;
    } catch (e) {
      console.log(e);
    }
  }
  return Object.assign(user, objectToAssign);
};

