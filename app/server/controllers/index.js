var models = require('../models'),
  _validate = require('../../helpers/express-validators'),
  _h = require('../../helpers/helpers'),
  jwt = require('jsonwebtoken'),
  co = require('co'),
  userHelper = require('./controller-helpers').userHelper,
  docHelper = require('./controller-helpers').docHelper,
  roleHelper = require('./controller-helpers').roleHelper;

module.exports = {
  authController: require('./auth-controller')(models, _validate, _h, jwt, co),
  userController: require('./user-controller')(_validate, _h, userHelper),
  docController: require('./document-controller')(_validate, _h, docHelper),
  roleController: require('./role-controller')(_validate, _h, roleHelper)
};
