const cache = require('express-redis-cache')({
  prefix: 'magepwa',
  auth_pass: process.env.REDIS_KEY,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

cache.on('error', (error) => {
  console.error('cacheError', error);
});


module.exports = cache;
