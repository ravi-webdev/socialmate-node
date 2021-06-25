const mysql = require('mysql');
// local mysql db connection
// const dbConn = mysql.createConnection({
const dbConn = {
  host: 'localhost',
  user: 'ravi',
  password: 'ravi@1234',
  database: 'socialmate',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
// });
// dbConn.connect((err) => {
//   if (err) throw err;
//   console.log('Database Connected!');
// });
module.exports = dbConn;
