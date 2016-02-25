var authController = (models, _validate, _h, jwt, co) => {
  var Authenticate = (req, res) => {
    _validate.validateAuthParams(req, function (err) {
      co(function* () {
        if (err) return res.status(400).json(err);
        // Authenticate a user
        // find the user
        var user = yield models.User.findOne({
          email: req.body.email
        }).populate({
          path: 'role',
          select: 'title'
        });

        if (!user) {
          res.status(404).json({
            success: false,
            message: 'Authentication failed. User not found.'
          });
        } else {
          if (user.google.id || user.facebook.id) {
            return res.status(401).json({
              success: false,
              message: 'Hello, Looks like you logged in using the social ' +
                'authentication. You cannot use the feature.'
            });
          }
          // check if password matches
          user.comparePassword(req.body.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              // if user is found and password is right
              // create a token
              var options = {
                expiresIn: '24h' // expires in 24 hours from creation.
              };

              jwt.sign(user,
                process.env.WEB_TOKEN_SECRET, options, (token) => {
                  // return the information including token as JSON
                  res.json({
                    success: true,
                    message: 'Authentication successful!',
                    user: user,
                    token: token
                  });
                });
            } else {
              res.status(401).json({
                success: false,
                message: 'Authentication failed. Wrong password.'
              });
            }
          });
        }
      });
    });
  };
  return Authenticate;
};

module.exports = authController;
