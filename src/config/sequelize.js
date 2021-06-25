/* eslint-disable import/no-unresolved */
const dbConn = require('./db.config.js');

const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbConn.database, dbConn.user, dbConn.password, {
  host: dbConn.host,
  dialect: dbConn.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConn.pool.max,
    min: dbConn.pool.min,
    acquire: dbConn.pool.acquire,
    idle: dbConn.pool.idle,
  },
});

const db = {};
db.sequelize = sequelize;

db.categories = require('../api/models/categories.model.js')(sequelize, Sequelize);
db.tutorial = require('../api/models/tutorial.model.js')(sequelize, Sequelize);

module.exports = db;
