var models = require('../models'),
  _validate = require('../helpers/expressValidators'),
  _h = require('../helpers/helperFunctions'),
  RoleHelper = require('./ControllerHelpers').RoleHelper;

module.exports = (() => {
  var createRole = (req, res) => {
    _validate.validateRoleTitle(req, (err) => {
      if (err) return res.status(400).json(err);
      RoleHelper.createRole(req.body.title, (err, role) => {
        return _h.feedback(err, 'role', role, 'Role successfully created!', res);
      });
    });
  };

  var getRole = (req, res) => {
    _validate.validateId(req, (err) => {
      if (err) return res.status(400).json(err);
      RoleHelper.getRole(req.params.id, (err, role) => {
        return _h.feedback(err, 'role', role, null, res);
      });
    });
  };

  var getRoles = (req, res) => {
    _validate.validatePaginationParams(req, (err) => {
      if (err) return res.status(400).json(err);
      var args = [parseInt(req.query.limit) || 20, parseInt(req.query.page) || 1];
      RoleHelper.getRoles(...args, (err, roles) => {
        return _h.feedback(err, 'roles', roles, null, res);
      });
    });
  };

  var updateRole = (req, res) => {
    _validate.validateId(req, (err) => {
      if (err) return res.status(400).json(err);
      _validate.validateRoleTitle(req, (err) => {
        RoleHelper.updateRole(req.params.id, req.body.title, (err) => {
          return _h.feedback(err, null, null, 'Role successfully updated!', res);
        });
      });
    });
  };

  var deleteRole = (req, res) => {
    _validate.validateId(req, (err) => {
      if (err) return res.status(400).json(err);
      RoleHelper.deleteRole(req.params.id, (err) => {
        return _h.feedback(err, null, null, 'Role successfully deleted!', res);
      });
    });
  };

  return {
    createRole: createRole,
    getRole: getRole,
    getRoles: getRoles,
    updateRole: updateRole,
    deleteRole: deleteRole
  };
})();
