var helpers = () => {

    var feedback = (err, objName, obj, message, res, token) => {
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
        if (token) {
          success.token = token;
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
    feedback: feedback,
    returnErrorMsg: returnErrorMsg
  };
};

module.exports = helpers();
