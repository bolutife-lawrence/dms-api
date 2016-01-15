var models = require('../../models'),
  _h = require('../../../helpers/helpers'),
  co = require('co'),
  lodash = require('lodash');

module.exports = {
    userHelper: require('./user-helper')(models, _h, co),
    docHelper: require('./doc-helper')(models, _h, co, lodash),
    roleHelper: require('./role-helper')(models, _h, co)
};
