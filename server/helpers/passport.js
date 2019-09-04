import passport from 'passport';
import facebook from 'passport-facebook';
import googleStrategy from 'passport-google-oauth2';
import customStrategy from 'passport-custom';
import dotenv from 'dotenv';

dotenv.config();

const strategy = (req, done) => {
  const { user } = req.query;
  const Theuser = JSON.parse(user);
  req.user = Theuser;
  done(null, user);
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
  passReqToCallback: true,
  proxy: true
};

const facebookStrat = {
  clientID: facebookClient,
  clientSecret: facebookSecret,
  callbackURL: fbcallbackUrl,
  profileFields: ['id', 'displayName', 'email', 'photos']
};

passport.use(
  'google',
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production' ? new googleStrategy.Strategy(
    googleStrat,
    (request, accessToken, refreshToken, profile, done) => {
      const profilePix = profile.photos[0].value;
      profile.image = profilePix;
      done(null, profile);
    }
  ) : new customStrategy(
    (req, done) => strategy(req, done)
  ),
  { failureRedirect: '/login' }
);

passport.use(
  'facebook',
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production' ? new facebook.Strategy(
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
