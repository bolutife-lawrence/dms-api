var jwt = require('jsonwebtoken');

var auth = () => {
  var isAuthenticated = (req, res, next) => {
    // check header or url parameters or post parameters for token
    var token = req.body.token ||
      req.query.token ||
      req.headers['x-access-token'];
    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
        if (err) {
          return res.json({
            success: false,
            message: 'Failed to authenticate token.',
            error: err
          });
        } else {
          // if everything is good, save to request for use in other routes
          req.user = decoded;
          next();
        }
      });
    } else {
      // if there is no token
      // return an error
      return res.status(403).json({
        success: false,
        message: 'No token provided.'
      });
    }
  };

  var isAdmin = (req, res, next) => {
    var userRole = req.user.role[0].title.toLowerCase();
    return userRole === 'admin' || 'superadmin' ? next() :
      res.status(401).json({
        success: false,
        message: 'Restricted resource. Access Denied!'
      }), false;
  };

  var isSuperAdmin = (req, res, next) => {
    var userRole = req.user.role[0].title.toLowerCase();
    return userRole === 'superadmin' ? next() : res.status(401).json({
      success: false,
      message: 'Restricted resource. Access Denied!'
    }), false;
  };

  var checkRole = (req, res, next) => {
    if (!('role' in req.body)) next();
    var _role = req.body.role.toLowerCase();
    return _role === 'admin' || _role === 'superadmin' ?
      isAuthenticated(req, res, next) || isSuperAdmin(req, res, next) : next();
  };

  return {
    isAuthenticated: isAuthenticated,
    isAdmin: isAdmin,
    isSuperAdmin: isSuperAdmin,
    checkRole: checkRole
  };
};

module.exports = auth();
