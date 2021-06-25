const JwtStrategy = require('passport-jwt').Strategy;
const BearerStrategy = require('passport-http-bearer');
const { ExtractJwt } = require('passport-jwt');
const { jwtSecret } = require('./vars');
const authProviders = require('../api/services/authProviders');
const User = require('../api/models/user.model');
const GoogleTokenStrategy = require('passport-google-id-token');

const jwtOptions = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
};
const CLIENT_ID = process.env.GCLIENT_ID;

const jwt = async (payload, done) => {
  try {
    const user = await User.findById(payload.sub);
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

const oAuth = service => async (token, done) => {
  try {
    const userData = await authProviders[service](token);
    const user = await User.oAuthLogin(userData);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

exports.jwt = new JwtStrategy(jwtOptions, jwt);
exports.facebook = new BearerStrategy(oAuth('facebook'));
exports.google = new BearerStrategy(oAuth('google'));
exports.idtoken = new GoogleTokenStrategy({
  clientID: CLIENT_ID,
}, async (parsedToken, userId, done) => {
  const {
    given_name, family_name, sub, email,
  } = parsedToken.payload;
  // const err = {
  //   status: httpStatus.UNAUTHORIZED,
  //   isPublic: true,
  // };
  // if (new Date(exp) < new Date()) {
  //   console.log(new Date(exp), new Date());
  //   return done(new APIError(err));
  // }
  const user = await User.oAuthLogin({
    firstName: given_name,
    lastName: family_name,
    sub,
    email,
    service: 'google',
  }); return done(null, user);
});
