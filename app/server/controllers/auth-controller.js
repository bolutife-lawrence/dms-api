var authController = (models, _validate, _h, jwt, co) => {
  var Authenticate = (req, res) => {
    _validate.validateAuthParams(req, function (err) {
      co(function* () {
        if (err) return res.status(400).json(err);
        // Authenticate a user
        // find the user
        var user = yield models.User.findOne({
          $or: [{
            username: req.body.login
          }, {
            email: req.body.login
          }]
        }).populate('role');
        if (!user) {
          res.status(404).json({
            success: false,
            message: 'Authentication failed. User not found.'
          });
        } else if (user) {
          // check if password matches
          if (_h.comparePassword(req.body.password, user.hashedPass)) {
            // if user is found and password is right
            // create a token
            var options = {
              expiresIn: '24h' // expires in 24 hours from creation.
            };
            jwt.sign(user, process.env.WEB_TOKEN_SECRET, options, (token) => {
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
        }
      });
    });
  };
  return Authenticate;
};

module.exports = authController;
