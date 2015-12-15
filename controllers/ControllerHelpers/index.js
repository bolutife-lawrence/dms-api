var models = require('../../models'),
  _h = require('../../helpers/helperFunctions'),
  co = require('co');

module.exports = {
    UserHelper: require('./UserHelper')(models, _h, co),
    DocumentHelper: require('./DocumentHelper')(models, _h, co),
    RoleHelper: require('./RoleHelper')(models, _h, co)
};
