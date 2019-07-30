import passport from 'passport';
import facebook from 'passport-facebook';
import google from 'passport-google-oauth';
import dotenv from 'dotenv';

dotenv.config();

const {
  GOOGLE_CLIENT: googleClient,
  GOOGLE_SECRET: googleSecret,
  GOOGLE_CALLBACK_URL: googleCallbackUrl,
  FACEBOOK_CLIENT: facebookClient,
  FACEBOOK_SECRET: facebookSecret,
  FACEBOOK_CALLBACK_URL: fbcallbackUrl
} = process.env;

const googleStrat = {
  clientID: googleClient,
  clientSecret: googleSecret,
  callbackURL: googleCallbackUrl,
  profileFields: ['id', 'displayName', 'email']
};

const facebookStrat = {
  clientID: facebookClient,
  clientSecret: facebookSecret,
  callbackURL: fbcallbackUrl,
  profileFields: ['id', 'displayName', 'email', 'photos']
};

passport.use(new google.OAuth2Strategy(
  googleStrat,
  (accessToken, refreshToken, profile, done) => done(null, profile)
));

passport.use(new facebook.Strategy(
  facebookStrat,
  (accessToken, refreshToken, profile, done) => done(null, profile)
));
