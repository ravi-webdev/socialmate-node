const algoliasearch = require('algoliasearch');

const client = algoliasearch(process.env.ALGOLIA_APP, process.env.ALGOLIA_KEY);

module.exports = client;
