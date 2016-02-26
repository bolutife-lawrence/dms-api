var passportRoutes = (router, passport) => {

  // route for facebook authentication and login
  router.route('/auth/facebook')
    .get(passport.authenticate('facebook', {
      scope: 'email'
    }));

  // route for google authentication and login
  router.route('/auth/google')
    .get(passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/userinfo.profile',
        'email'
      ]
    }));

  // the callback after google has authenticated the user
  router.route('/auth/google/callback')
    .get(passport.authenticate('google', {
      failureRedirect: process.env.FAILURE_REDIRECT_URL
    }), (req, res) => {
      res.redirect(process.env.SUCCESS_REDIRECT_URL +
        '/' + req.user._id + '/?token=' + req.user.token);
    });

  // handle the callback after facebook has authenticated the user
  router.route('/auth/facebook/callback')
    .get(passport.authenticate('facebook', {
      failureRedirect: process.env.FAILURE_REDIRECT_URL
    }), (req, res) => {
      res.redirect(process.env.SUCCESS_REDIRECT_URL +
        '/' + req.user._id + '/?token=' + req.user.token);
    });
};

module.exports = passportRoutes;
