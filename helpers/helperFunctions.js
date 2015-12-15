var bcrypt = require('bcrypt'),
  ext = require('./ext');

var helpers = {
  hash: (password) => {
    var rand = parseInt(Math.random() * 10),
      salt = bcrypt.genSaltSync(rand),
      hashedPass = bcrypt.hashSync(password, salt);
    return {
      salt: salt,
      hashedPass: hashedPass
    };
  },

  comparePassword: (password, hash) => {
    return bcrypt.compareSync(password, hash);
  },

  getDocType: (docName) => {
    var extn = ext.getExt(docName);
    return ext.getContentType(extn);
  },

  feedback: (err, objName, obj, message, res) => {
    if (err) {
      var error = {
        success: false,
        message: err
      };
      return res.status(400).json(error);
    } else {
      var success = {
        success: true,
      };
      if (message) success.message = message;
      if (obj && objName) success[objName] = obj;
      res.status(200).json(success);
    }
  }
};

module.exports = helpers;
