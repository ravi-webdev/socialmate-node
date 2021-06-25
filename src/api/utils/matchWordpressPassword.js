const { PasswordHash } = require('node-phpass');


const len = 8;
const portable = true;
// major PHP version, 5 or 7, as it is a port of PHPass PHP class we rely
// on php version on gensalt_private() method, it is an optional constructor
// argument which defaults to 7
const phpversion = 7;
const hasher = new PasswordHash(len, portable, phpversion);
// const storedhashAmit = '$P$BSZnCkZIFUMnK8ZE0do.7eHyD8Yhyk.';
// const password = 'amit@123';

function MatchWPPassword(password, storedHash) {
  return hasher.CheckPassword(password, storedHash);
}

module.exports = MatchWPPassword;
