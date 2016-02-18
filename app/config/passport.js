var FacebookStrategy = require('passport-facebook').Strategy,
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  jwt = require('jsonwebtoken'),
  // load up the models
  models = require('../server/models'),
  // load the auth variables
  configAuth = require('./auth'),

  signUser = (user) => {
    var options = {
        expiresIn: '24h' // expires in 24 hours from creation.
      },
      token = jwt.sign(user, process.env.WEB_TOKEN_SECRET, options);
    var modifiedUser = Object.assign({}, user);
    modifiedUser._doc.token = token;
    return modifiedUser._doc;
  },

  passportConfig = (passport) => {
    // used to serialize the user for the session
    passport.serializeUser((user, done) => {
      done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser((id, done) => {
      models.User.findById(id, (err, user) => {
        done(err, user);
      });
    });

    passport.use(new FacebookStrategy({
      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL,
      profileFields: ['id', 'name', 'picture.type(large)', 'email'],
      // allows us to pass in the req from our route
      // (lets us check if a user is logged in or not)
      passReqToCallback: true
    }, (req, token, refreshToken, profile, done) => {
      // asynchronous
      process.nextTick(() => {
        // check if the user is already logged in
        if (!req.user) {
          models.User.findOne({
              'facebook.id': profile.id
            }, (err, user) => {
              if (err) {
                return done(err);
              }
              if (user) {
                user = signUser(user);
                return done(null, user); // user found, return that user
              } else {
                // if there is no user, create them
                var newUser = new models.User();
                newUser.facebook.id = profile.id;
                newUser.facebook.token = token;
                newUser.name.last = profile._json.last_name;
                newUser.name.first = profile._json.first_name;
                newUser.email = profile._json.email;
                newUser.img_url = profile._json.picture.data.url;
                newUser.save((err) => {
                  if (err) {
                    return done(err);
                  }
                  newUser = signUser(newUser);
                  return done(null, newUser);
                });
              }
            })
            .populate({
              path: 'role',
              select: 'title'
            });
        } else {
          // user already exists and is logged in, we have to link accounts
          var user = req.user; // pull the user out of the session
          if (user.email === profile._json.email) {
            user.facebook.id = profile.id;
            user.facebook.token = token;
            user.name.last = profile._json.last_name;
            user.name.first = profile._json.first_name;
            user.img_url = profile._json.picture.data.url;
            user.save((err) => {
              if (err) {
                return done(err);
              }
            });
          }
          models.User.findOne({
              'facebook.id': profile.id
            }, (err, user) => {
              if (err) return done(err);
              user = signUser(user);
              return done(null, user);
            })
            .populate({
              path: 'role',
              select: 'title'
            });
        }
      });
    }));

    passport.use(new GoogleStrategy({
      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: configAuth.googleAuth.callbackURL,
      // allows us to pass in the req from our route
      // (lets us check if a user is logged in or not)
      passReqToCallback: true
    }, (req, token, refreshToken, profile, done) => {
      // asynchronous
      process.nextTick(() => {
        // check if the user is already logged in
        if (!req.user) {
          models.User.findOne({
              'google.id': profile.id
            }, (err, user) => {
              if (err) {
                return done(err);
              }
              if (user) {
                user = signUser(user);
                return done(null, user);
              } else {
                var newUser = new models.User(),
                  fullname = profile._json.name.givenName.split(' ');
                newUser.google.id = profile.id;
                newUser.google.token = token;
                newUser.name.last = fullname[0];
                newUser.name.first = fullname[1];
                // pull the first email
                newUser.email = profile._json.emails[0].value;
                newUser.img_url = profile._json.image.url;
                newUser.save((err) => {
                  if (err) {
                    return done(err);
                  }
                  newUser = signUser(newUser);
                  return done(null, newUser);
                });
              }
            })
            .populate({
              path: 'role',
              select: 'title'
            });
        } else {
          // user already exists and is logged in, we have to link accounts
          var user = req.user, // pull the user out of the session
            fullname = profile._json.name.givenName.split(' ');
          if (user.email === profile._json.emails[0].value) {
            user.google.id = profile.id;
            user.google.token = token;
            user.name.last = fullname[0];
            user.name.first = fullname[1];
            user.img_url = profile._json.image.url;
            user.save((err) => {
              if (err) {
                return done(err);
              }
            });
          }
          models.User.findOne({
              'google.id': profile.id
            }, (err, user) => {
              if (err) return done(err);
              user = signUser(user);
              return done(null, user);
            })
            .populate({
              path: 'role',
              select: 'title'
            });
        }
      });
    }));
  };

module.exports = passportConfig;
