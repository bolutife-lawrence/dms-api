/**
 * Helper function for the Role controller.
 *
 * @param  {object} models [models to be used are being injected]
 * @param  {object} _h     [general helper functions]
 * @param  {function} co   [co generator lib sallows async mode simulation]
 *
 */
var roleHelper = (models, _h, co) => {

  /**
   * [description]
   * @param  {[type]}   title [description]
   * @param  {Function} cb    [description]
   * @return {[type]}         [description]
   */
  var createRole = (title, cb) => {
    co(function* () {
      try {
        var query = {
            title: title
          },
          newRole = {},
          savedRole = '',
          role = yield models.Role.findOne(query);
        if (role) {
          var err = [`${title} role has already been created.`, 409];
          return cb(_h.returnErrorMsg(...err));
        }
        newRole = new models.Role({
          title: title
        });
        savedRole = yield newRole.save();
        if (!savedRole) {
          return cb(_h.returnErrorMsg('Role was not created', null));
        }
        cb(null, savedRole);
      } catch (e) {
        cb(e);
      }
    });
  };

  /**
   * [description]
   * @param  {[type]}   roleId [description]
   * @param  {Function} cb     [description]
   * @return {[type]}          [description]
   */
  var getRole = (roleId, cb) => {
    co(function* () {
      try {
        var query = {
            _id: roleId
          },
          role = yield models.Role.findOne(query);
        if (!role) {
          return cb(_h.returnErrorMsg('Role not found', 404));
        }
        cb(null, role);
      } catch (e) {
        cb(e);
      }
    });
  };

  /**
   *
   *  Retrives all roles from storage.
   *
   * @param  {[type]}   limit [description]
   * @param  {[type]}   page  [description]
   * @param  {Function} cb    [description]
   *
   */
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
        if (err) {
          return cb(_h.returnErrorMsg(err, null));
        }
        cb(null, roles);
      });
    } catch (e) {
      cb(e);
    }
  };

  /**
   * [description]
   * @param  {[type]}   roleId [description]
   * @param  {[type]}   role   [description]
   * @param  {Function} cb     [description]
   * @return {[type]}          [description]
   */
  var updateRole = (roleId, role, cb) => {
    co(function* () {
      try {
        var query = {
            $and: [{
              title: role
            }, {
              _id: {
                $ne: roleId
              }
            }]
          },
          query2 = {
            _id: roleId
          },
          _role = yield models.Role.findOne(query);
        if (_role) {
          return cb(_h.returnErrorMsg('Role title exists already', 409));
        }
        var updatedRole = yield models.Role.findOneAndUpdate(query2, role);
        if (!updatedRole) {
          cb(_h.returnErrorMsg('Role was not updated', null));
        }
        cb(null, updatedRole);
      } catch (e) {
        cb(e);
      }
    });
  };

  /**
   * [description]
   * @param  {[type]}   roleId [description]
   * @param  {Function} cb     [description]
   * @return {[type]}          [description]
   */
  var deleteRole = (roleId, cb) => {
    co(function* () {
      try {
        var query = {
            _id: roleId
          },
          doc = yield models.Role.findOne(query),
          deletedRole = '';
        if (!doc) {
          return cb(_h.returnErrorMsg('Role not found', 404));
        }
        deletedRole = yield models.Role.remove(query);
        if (!deletedRole) {
          return cb(_h.returnErrorMsg('Document was not deleted', null));
        }
        cb();
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

module.exports = roleHelper;
