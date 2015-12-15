var express = require('express'),
    router = express.Router(),
    controllers = require('../controllers');

router.route('/authenticate').post(controllers.AuthController.Authenticate);

module.exports = router;
