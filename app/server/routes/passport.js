var passportRoutes = (router, passport, jwt) => {

  // route for facebook authentication and login
  router.route('/auth/facebook')
    .get(passport.authenticate('facebook', {
      scope: 'email'
    }));

  // route for google authentication and login
  router.route('/auth/google')
    .get(passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/plus.login'
      ]
    }));

  // the callback after google has authenticated the user
  router.route('/auth/google/callback')
    .get(passport.authenticate('google', {
      successRedirect: '/api/v0.1/auth/success',
      failureRedirect: '/api/v0.1/auth/fail'
    }));

  // handle the callback after facebook has authenticated the user
  router.route('/auth/facebook/callback')
    .get(passport.authenticate('facebook', {
      successRedirect: '/api/v0.1/auth/success',
      failureRedirect: '/api/v0.1/auth/fail'
    }));

  router.route('/auth/success')
    .get((req, res) => {
      var options = {
        expiresIn: '24h' // expires in 24 hours from creation.
      };
      jwt.sign(req.user, process.env.WEB_TOKEN_SECRET, options, (token) => {
        res.status(200).json({
          success: true,
          message: 'Authentication successful!',
          user: req.user,
          token: token
        });
      });
    });

  router.route('/auth/fail')
    .get((req, res) => {
      res.status(401).json({
        success: false,
        message: 'Authentication unsuccessful!',
      });
    });
};

module.exports = passportRoutes;
