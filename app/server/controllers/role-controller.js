var roleController = (_validate, _h, roleHelper) => {
  var createRole = (req, res) => {
    _validate.validateRoleTitle(req, (err) => {
      if (err) return res.status(400).json(err);
      roleHelper.createRole(req.body.title, (err, role) => {
        var args = [err, 'role', role, 'Role successfully created!', res];
        return _h.feedback(...args);
      });
    });
  };

  var getRole = (req, res) => {
    _validate.validateId(req, (err) => {
      if (err) return res.status(400).json(err);
      roleHelper.getRole(req.params.id, (err, role) => {
        return _h.feedback(err, 'role', role, null, res);
      });
    });
  };

  var getRoles = (req, res) => {
    _validate.validatePaginationParams(req, (err) => {
      if (err) return res.status(400).json(err);
      var args = [
        parseInt(req.query.limit) || 20,
        parseInt(req.query.page) || 1
      ];
      roleHelper.getRoles(...args, (err, roles) => {
        return _h.feedback(err, 'roles', roles, null, res);
      });
    });
  };

  var updateRole = (req, res) => {
    _validate.validateId(req, (err) => {
      if (err) return res.status(400).json(err);
      _validate.validateRoleTitle(req, (err) => {
        if (err) return res.status(400).json(err);
        roleHelper.updateRole(req.params.id, req.body.title, (err) => {
          var args = [err, null, null, 'Role successfully updated!', res];
          return _h.feedback(...args);
        });
      });
    });
  };

  var deleteRole = (req, res) => {
    _validate.validateId(req, (err) => {
      if (err) return res.status(400).json(err);
      roleHelper.deleteRole(req.params.id, (err) => {
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
};

module.exports = roleController;
