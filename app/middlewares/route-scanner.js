var auth = require('./auth');

/**
 * [description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
var scanRoutes = (req, res, next) => {
  // Remove trailing forward slash if available in routes
  if (req.url.substr(-1) === '/' && req.url.length > 1) {
    req.url = req.url.slice(0, -1);
  }

  var err = {
    success: false,
    message: 'Access Denied! You cannot perform this operation',
  };

  // Protect all confidential routes - Authentication  and Authorization.
  // This accertains that a user is authenticated to access certain routes.
  // And also accertains that a user has certain permissions to access
  // confidential resources.

  switch (true) {
  case req.url === '/users':
    switch (req.method) {
    case 'POST':
      auth.checkAccessRole(req, res, () => {
        next();
      });
      break;

    case 'GET':
      auth.isAuthenticated(req, res, () => {
        auth.isAdmin(req, res, () => {
          next();
        });
      });
      break;

    default:
      next();
    }
    break;

  case /^\/users\/[a-z0-9]{24}$/i.test(req.url):
    auth.isAuthenticated(req, res, () => {
      switch (req.method) {
      case 'GET':
        auth.isAdmin(req, res, () => {
          next();
        });
        break;

      case 'DELETE':
        auth.isSuperAdmin(req, res, () => {
          // A superadmin user can delete any user
          next();
        });
        break;

      case 'PUT':
        if (req.url.indexOf(req.user._id) === -1) {
          return res.status(403).json(err);
        }
        next();
        break;

      default:
        next();
      }
    });
    break;

  case /\/users\/[a-z0-9]{24}\/documents/i.test(req.url):
    auth.isAuthenticated(req, res, () => {
      if (req.method === 'GET') {
        if (req.url.indexOf(req.user._id) === -1) {
          return res.status(403).json(err);
        }
        next();
      }
    });
    break;

  case req.url === '/image/upload':
    auth.isAuthenticated(req, res, () => {
      next();
    });
    break;

  case /^\/images\/[a-z0-9]{20}$/i.test(req.url):
    auth.isAuthenticated(req, res, () => {
      next();
    });
    break;

  case '/documents' === req.url:
    auth.isAuthenticated(req, res, () => {
      switch (req.method) {
      case 'GET':
        auth.isAdmin(req, res, () => {
          next();
        });
        break;

      default:
        next();
      }
    });
    break;

  case /^\/documents\/[a-z0-9]{24}$/i.test(req.url):
    auth.isAuthenticated(req, res, () => {
      next();
    });
    break;

  case '/roles' === req.url:
    auth.isAuthenticated(req, res, () => {
      switch (req.method) {
      case 'POST':
        auth.isSuperAdmin(req, res, () => {
          next();
        });
        break;

      case 'GET':
        auth.isAdmin(req, res, () => {
          next();
        });
        break;

      default:
        next();
      }
    });
    break;

  case /\/roles\/[a-z0-9]{24}$/i.test(req.url):
    auth.isAuthenticated(req, res, () => {
      switch (req.method) {
      case 'GET':
        auth.isAdmin(req, res, () => {
          next();
        });
        break;

      case 'DELETE':
      case 'PUT':
      case 'PATCH':
        auth.isSuperAdmin(req, res, () => {
          next();
        });
        break;

      default:
        next();
      }
    });
    break;

  case /^\/roles\/[a-z0-9]{24}\/documents$/i.test(req.url):
    auth.isAuthenticated(req, res, () => {
      if (req.method === 'GET') {
        if (req.url.indexOf(req.user.role[0]._id) === -1) {
          return res.status(403).json(err);
        }
      }
      next();
    });
    break;

  default:
    next();

  }
};

module.exports = scanRoutes;
