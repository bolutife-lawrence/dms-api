var bcrypt = require('bcrypt');

var helpers = (bcrypt) => {
  var hash = (password) => {
      var rand = parseInt(Math.random() * 10),
        salt = bcrypt.genSaltSync(rand),
        hashedPass = bcrypt.hashSync(password, salt);
      return {
        salt: salt,
        hashedPass: hashedPass
      };
    },

    comparePassword = (password, hash) => {
      return bcrypt.compareSync(password, hash);
    },

    feedback = (err, objName, obj, message, res) => {
      if (err) {
        var error = {
          success: false,
          message: err.message
        };
        return res.status(err.status_code || 500).json(error);
      } else {
        var success = {
          success: true,
        };
        if (message) {
          success.message = message;
        }
        if (obj && objName) {
          success[objName] = obj;
        }
        res.status(200).json(success);
      }
    },

    returnErrorMsg = (message, status_code) => {
      var errObj = {
        message: message,
        status_code: status_code
      };
      return errObj;
    };

  return {
    hash: hash,
    comparePassword: comparePassword,
    feedback: feedback,
    returnErrorMsg: returnErrorMsg
  };
};

module.exports = helpers(bcrypt);
