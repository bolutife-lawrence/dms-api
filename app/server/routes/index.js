var express = require('express'),
  router = express.Router(),
  controllers = require('../controllers'),
  scanRoutes = require('../../middlewares/route-scanner'),
  authRoute = require('./auth'),
  userRoutes = require('./users'),
  docRoutes = require('./documents'),
  roleRoutes = require('./roles');

// Middleware - Scan all requests to the router.
router.use(scanRoutes);

// Authentication Route
authRoute(router, controllers);
// User Routes
userRoutes(router, controllers);
// Document Routes
docRoutes(router, controllers);
// Role Routes
roleRoutes(router, controllers);

router.get('/', function (req, res) {
  res.status(200).json({
    message: 'Welcome to the DMS API',
    version: '0.1'
  });
});

module.exports = router;
