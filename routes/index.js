(function () {
  "use strict";
})();

var express = require('express'),
  router = express.Router();

// Authentication Route
router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/documents', require('./documents'));
router.use('/roles', require('./roles'));

router.get('/', function (req, res) {
  res.status(200).json({
    message: 'Welcome to the DMS API'
  });
});

module.exports = router;
