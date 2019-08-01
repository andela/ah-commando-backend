import passport from 'passport';
import facebook from 'passport-facebook';
import google from 'passport-google-oauth';
import customStrategy from 'passport-custom';
import dotenv from 'dotenv';

dotenv.config();

const strategy = (req, done) => {
  const { user } = req.query;
  const Theuser = JSON.parse(user);
  req.user = Theuser;
  done(null, Theuser);
};

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

passport.use(
  'google',
  process.env.NODE_ENV === 'production' ? new google.OAuth2Strategy(
    googleStrat,
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  ) : new customStrategy(
    (req, done) => strategy(req, done)
  )
);

passport.use(
  'facebook',
  process.env.NODE_ENV === 'production' ? new facebook.Strategy(
    facebookStrat,
    (accessToken, refreshToken, profile, done) => {
      const profilePix = profile.photos[0].value;
      profile.image = profilePix;
      done(null, profile);
    }
  ) : new customStrategy(
    (req, done) => strategy(req, done)
  )
);
