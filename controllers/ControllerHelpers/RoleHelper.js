var RoleHelper = (models, _h, co) => {
  var createRole = (title, cb) => {
    co(function* () {
      try {
        var query = {
            'title': title
          },
          newRole = {},
          role = yield models.Role.findOne(query);
        if (role) return cb(`${title} role has already been created.`);
        newRole = new models.Role({
          'title': title
        });
        role = yield newRole.save();
        return role ? cb(null, role) : cb('New Role could not be created');
      } catch (e) {
        cb(e);
      }
    });
  };

  var getRole = (roleId, cb) => {
    co(function* () {
      try {
        var query = {
            '_id': roleId
          },
          role = yield models.Role.findOne(query);
        if (!role) return cb(`No role with ID ${roleId}`);
        return cb(null, role);
      } catch (e) {
        cb(e);
      }
    });
  };

  var getRoles = (limit, page, cb) => {
    try {
      var options = {
        sort: {
          createdAt: -1
        },
        lean: false,
        page: page,
        limit: limit,
      };
      models.Role.paginate({}, options, (err, roles) => {
        if (err) return cb(err);
        return roles.length !== 0 ?
          cb(null, roles) : cb('No role has been created yet.');
      });
    } catch (e) {
      cb(e);
    }
  };

  var updateRole = (roleId, role, cb) => {
    co(function* () {
      try {
        var query = {
            $and: [{
              'title': role.title
            }, {
              '_id': {
                $ne: roleId
              }
            }]
          },
          query2 = {
            '_id': roleId
          },
          _role = yield models.Role.findOne(query);
        if (_role)
          return cb(`Role ${_role.title} already exists.`);
        var updateRole = yield models.Role.findOneAndUpdate(query2, role);
        return updateRole ? cb() : cb('Role could not be updated!');
      } catch (e) {
        cb(e);
      }
    });
  };

  var deleteRole = (roleId, cb) => {
    co(function* () {
      try {
        var query = {
            '_id': roleId
          },
          deletedRole = yield models.Role.findOneAndRemove(query);
        return deletedRole ? cb() : cb('Role could not be deleted. Not found!');
      } catch (e) {
        cb(e);
      }
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

module.exports = RoleHelper;
