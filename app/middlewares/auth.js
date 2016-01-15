var jwt = require('jsonwebtoken');

var auth = (jwt) => {
  var isAuthenticated = (req, res, next) => {
    // check header or url parameters or post parameters for token
    var token = req.body.token ||
      req.query.token ||
      req.headers['x-access-token'];
    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.status(500).json({
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
      return res.status(401).json({
        success: false,
        message: 'No token provided.'
      });
    }
  };

  var isAdmin = (req, res, next) => {
    var userRole = req.user.role[0].title.toLowerCase();
    return userRole === 'admin' || userRole === 'superadmin' ? next() :
      res.status(403).json({
        success: false,
        message: 'Access Denied! You cannot perform this operation'
      }), false;
  };

  var isSuperAdmin = (req, res, next) => {
    var userRole = req.user.role[0].title.toLowerCase();
    return userRole === 'superadmin' ? next() : res.status(403).json({
      success: false,
      message: 'Access Denied! You cannot perform this operation'
    }), false;
  };

  var checkAccessRole = (req, res, next) => {
    var err = {
      success: false,
      message: 'Access Denied! You cannot perform this operation'
    };
    if (!('role' in req.body)) next();
    var role = req.body.role.toLowerCase();
    if (role === 'superadmin') {
      if ('auth_code' in req.body) {
        var auth_code = req.body.auth_code.toUpperCase();
        if (auth_code === process.env.AUTH_CODE) {
          next();
        } else {
          return res.status(403).json(err);
        }
      } else {
        return res.status(403).json(err);
      }
    } else if (role === 'admin') {
      isAuthenticated(req, res, () => {
        isSuperAdmin(req, res, () => {
          next();
        });
      });
    } else {
      next();
    }
  };

  return {
    isAuthenticated: isAuthenticated,
    isAdmin: isAdmin,
    isSuperAdmin: isSuperAdmin,
    checkAccessRole: checkAccessRole
  };
};

module.exports = auth(jwt);