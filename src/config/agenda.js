/* eslint-disable wrap-iife, func-names */
const Agenda = require('agenda');
const { mongo: { uri: mongoConnectionString }, agenda: { collection } } = require('./vars');
const axios = require('axios');

const agenda = new Agenda({ db: { address: mongoConnectionString, collection } });

// Or override the default collection name:
// const agenda = new Agenda({db: {address: mongoConnectionString, collection: 'jobCollectionName'}});
// or pass additional connection options:
// const agenda = new Agenda({db: {address: mongoConnectionString, collection: 'jobCollectionName', options: {ssl: true}}});
// or pass in an existing mongodb-native MongoClient instance
// const agenda = new Agenda({mongo: myMongoClient});

// agenda.define('refresh productList cache', async (job, done) => {
//   await axios.get(`${process.env.SELF}/v1/products/clearcache`);
//   done();
// });

// agenda.define('refresh contentful cache', async (job, done) => {
//   await axios.get(`${process.env.SELF}/v1/content/updateCache`);
//   done();
// });

// agenda.define('refresh algolia feed', async (job, done) => {
//   await axios.get(`${process.env.SELF}/v1/content/algoliaUpdate`);
//   done();
// });
// agenda.define('refresh paytm order', async (job, done) => {
//   await axios.get(`${process.env.SELF}/v1/carts/paytm/status`);
//   done();
// });
// agenda.define('refresh razorpay order', async (job, done) => {
//   await axios.get(`${process.env.SELF}/v1/carts/razorpay/status`);
//   done();
// });

// agenda.define('refresh payumoney order', async (job, done) => {
//   await axios.get(`${process.env.SELF}/v1/carts/payu/status`);
//   done();
// });

try {
  (async function () { // IIFE to give access to async/await
    await agenda.start();
    // await agenda.every('50 minutes', 'refresh productList cache');
    // await agenda.every('3 hours', 'refresh contentful cache');
    // await agenda.every('6 hours', 'refresh algolia feed');
    // await agenda.every('18 minutes', 'refresh paytm order');
    // await agenda.every('18 minutes', 'refresh razorpay order');
    // await agenda.every('18 minutes', 'refresh payumoney order');
  })();
} catch (e) {
  console.log(e);
}
