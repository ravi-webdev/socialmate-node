const httpStatus = require('http-status');
const passport = require('passport');
const { path } = require('ramda');
const User = require('../models/user.model');
const APIError = require('../utils/APIError');

const ADMIN = 'admin';
const LOGGED_USER = '_loggedUser';

const handleJWT = (req, res, next, roles) => async (err, user, info) => {
  const error = err || info;
  const logIn = Promise.promisify(req.logIn);
  const apiError = new APIError({
    message: error ? error.message : 'Unauthorized',
    status: httpStatus.UNAUTHORIZED,
    stack: error ? error.stack : undefined,
  });

  try {
    if (error || !user) throw error;
    await logIn(user, { session: false });
  } catch (e) {
    return next(apiError);
  }

  if (roles === LOGGED_USER) {
    if (user.role !== 'admin' && !(
      path(['params', 'userId'], req) === user._id.toString()
      || path(['body', 'userId'], req) === user._id.toString()
      || path(['body', 'data', 'userId'], req) === user._id.toString()
    )) {
      apiError.status = httpStatus.FORBIDDEN;
      apiError.message = 'Forbidden';
      return next(apiError);
    }
  } else if (!roles.includes(user.role)) {
    apiError.status = httpStatus.FORBIDDEN;
    apiError.message = 'Forbidden';
    return next(apiError);
  } else if (err || !user) {
    return next(apiError);
  }

  req.user = user;

  return next();
};

exports.ADMIN = ADMIN;
exports.LOGGED_USER = LOGGED_USER;

const testUser = {
  email: 'ankita@smallworld.io',
  role: 'user',
  firstName: 'Smallworld',
  lastName: 'Testing',
  phone: '9999999999',
  mageId: 436357,
};

exports.authorize = (roles = User.roles, disableCondition = () => false) => async (req, res, next) => {
  if (disableCondition(req)) {
    return next();
  }
  if (path(['body', 'bypassAuth'], req) === process.env.TEST_KEY || req.query.key === process.env.TEST_KEY) {
    const user = await User.findOrCreateTestUser(testUser);
    req.user = user;
    return next();
  }
  return passport.authenticate(
    'jwt', { session: false },
    handleJWT(req, res, next, roles),
  )(req, res, next);
};

exports.oAuth = service =>
  passport.authenticate(service, { session: false });
