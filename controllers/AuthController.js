var models = require('../models'),
  _validate = require('../helpers/expressValidators'),
  _h = require('../helpers/helperFunctions'),
  jwt = require('jsonwebtoken'),
  secretKey = require('../config/secret'),
  co = require('co');

module.exports = (() => {
  var Authenticate = (req, res) => {
    _validate.validateAuthParams(req, function (err) {
      co(function* () {
        if (err) return res.status(400).json(err);
        // Authenticate a user
        // find the user
        var user = yield models.User.findOne({
          username: req.body.username
        }).populate('role');
        if (!user) {
          res.status(400).json({
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
            var token = jwt.sign(user, secretKey.key, options, (token) => {
              // return the information including token as JSON
              res.json({
                success: true,
                message: 'Authentication successful. Enjoy your token!',
                token: token
              });
            });
          } else {
            res.status(400).json({
              success: false,
              message: 'Authentication failed. Wrong password.'
            });
          }
        }
      });
    });
  };

  return {
    Authenticate: Authenticate
  };

})();
