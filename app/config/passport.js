var FacebookStrategy = require('passport-facebook').Strategy,
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  // load up the models
  models = require('../server/models'),
  // load the auth variables
  configAuth = require('./auth'),

  passportConfig = (passport) => {
    // used to serialize the user for the session
    passport.serializeUser((user, done) => {
      done(null, user.id);
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
              // if there is a user id already but no token
              //(user was linked at one point and then removed)
              if (!user.facebook.token) {
                user.facebook.token = token;
                user.name.last = profile._json.last_name;
                user.name.first = profile._json.first_name;
                user.email = profile._json.email;
                user.img_url = profile._json.picture.data.url;
                user.save((err) => {
                  if (err) {
                    return done(err);
                  }
                  return done(null, user);
                });
              }
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
              newUser.username = '';
              newUser.save((err) => {
                if (err) {
                  return done(err);
                }
                return done(null, newUser);
              });
            }
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
              return done(null, user);
            });
          } else {
            var newUser = new models.User();
            newUser.facebook.id = profile.id;
            newUser.facebook.token = token;
            newUser.name.last = profile._json.last_name;
            newUser.name.first = profile._json.first_name;
            newUser.email = profile._json.email;
            newUser.img_url = profile._json.picture.data.url;
            newUser.username = '';
            newUser.save((err) => {
              if (err) {
                return done(err);
              }
              return done(null, newUser);
            });
          }
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
          console.log(profile.id);
          models.User.findOne({
            'google.id': profile.id
          }, (err, user) => {
            if (err) {
              return done(err);
            }
            if (user) {
              // if there is a user id already but no token
              // (user was linked at one point and then removed)
              if (!user.google.token) {
                user.google.token = token;
                user.google.name = profile.displayName;
                // pull the first email
                user.google.email = (profile.emails[0].value || '');
                user.save((err) => {
                  if (err) {
                    return done(err);
                  }
                  return done(null, user);
                });
              }
              return done(null, user);
            } else {
              var newUser = new models.User(),
                fullname = profile._json.name.givenName.split(' ');
              newUser.google.id = profile.id;
              newUser.google.token = token;
              newUser.name.last = fullname[0];
              newUser.name.first = fullname[1];
              // pull the first email
              newUser.email = (profile._json.emails[0].value || '');
              newUser.img_url = profile._json.image.url;
              newUser.username = '';
              newUser.save((err) => {
                if (err) {
                  return done(err);
                }
                return done(null, newUser);
              });
            }
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
              return done(null, user);
            });
          } else {
            var newUser = new models.User(),
              _fullname = profile._json.name.givenName.split(' ');
            newUser.google.id = profile.id;
            newUser.google.token = token;
            newUser.name.last = _fullname[0];
            newUser.name.first = _fullname[1];
            // pull the first email
            newUser.email = (profile._json.emails[0].value || '');
            newUser.img_url = profile._json.image.url;
            newUser.username = '';
            newUser.save((err) => {
              if (err) {
                return done(err);
              }
              return done(null, newUser);
            });
          }
        }
      });
    }));
  };

module.exports = passportConfig;
