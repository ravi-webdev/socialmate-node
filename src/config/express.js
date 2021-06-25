const express = require('express');
const Sentry = require('@sentry/node');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
// const passport = require('passport');
const routes = require('../api/routes/v1');
// const loadTestingRoutes = require('../api/routes/testing');
const { logs } = require('./vars');
// const strategies = require('./passport');

// const APIError = require('../api/utils/APIError');
const error = require('../api/middlewares/error');

Sentry.init({ dsn: 'https://0c8b0dcef4c64f6cbfc96ee8b7ba6653@sentry.io/1309608' });

require('./agenda');
/**
* Express instance
* @public
*/
const app = express();
app.use(Sentry.Handlers.requestHandler());
// request logging. dev: console | production: file
app.use(morgan(logs));

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// enable authentication
// app.use(passport.initialize());
// passport.use('jwt', strategies.jwt);
// passport.use('facebook', strategies.facebook);
// passport.use('google', strategies.google);
// passport.use('google-id-token', strategies.idtoken);

app.get(`/${process.env.LOADER_HASH}`, (req, res) => res.send(`${process.env.LOADER_HASH}`));

// mount api v1 routes
app.use('/v1', routes);
// app.use('/test', loadTestingRoutes);

app.use(Sentry.Handlers.errorHandler());

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

const db = require('./sequelize');

db.sequelize.sync();

module.exports = app;
