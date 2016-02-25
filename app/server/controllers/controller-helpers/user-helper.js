/**
 * User controller helper functions
 *
 * These functions are being used by the user controller.
 * @param  {object} models [models to be used are being injected]
 * @param  {object} _h     [general helper functions]
 * @param  {function} co     [co generator lib sallows async mode simulation]
 *
 */
var userHelper = (models, _h, co) => {

  /**
   * createUser helper function is used by the create user controller. This
   * handles all logic for creating a new user.
   *
   * @param  {string}   username  [username chosen by a new user]
   * @param  {string}   lastname  [lastname chosen by a new user]
   * @param  {string}   firstname [firstname chosen by a new user]
   * @param  {string}   role      [role to be assigned to a user on creation]
   * @param  {string}   email     [email chosen by a new user]
   * @param  {string}   password  [password chosen by a new user]
   * @param  {Function} cb        [callback function]
   *
   */
  var
    createUser = (username, lastname, firstname, role, email, password, cb) => {
      var _role = [];
      co(function* () {
        try {
          if (role) {
            _role = yield models.Role.findOne({
              title: role
            });
            if (!_role) {
              return cb(_h.returnErrorMsg('Role specified not found', 404));
            }
          }
          var user = yield models.User.findOne({
            email: email
          });
          if (user) {
            return cb(_h.returnErrorMsg('User exists already', 409));
          }
          var newUser = new models.User({
            name: {
              first: firstname,
              last: lastname
            },
            email: email,
            password: password,
            role: _role
          });
          var savedUser = yield newUser.save();
          if (!savedUser) {
            return cb('User was not created', null);
          }
          cb(null, savedUser);
        } catch (e) {
          cb(e, null);
        }
      });
    };

  /**
   * Gets all users in storage
   *
   * @param  {Number}   limit [This controls how many users is returned
   *                          	in an instance]
   * @param  {Number}   page  [page number where users should be loaded into]
   * @param  {Function} cb    [callback function]
   *
   */
  var getUsers = (limit, page, cb) => {
    var options = {
      select: 'email name role img_url',
      sort: {
        createdAt: -1
      },
      lean: false,
      page: page,
      limit: limit,
      populate: {
        path: 'role',
        select: 'title'
      }
    };
    models.User.paginate({}, options, (err, users) => {
      if (err) {
        return cb(_h.returnErrorMsg(err, null));
      }
      cb(null, users);
    });
  };

  /**
   * Retrives a specific user with registered credentials
   *
   * @param  {Object}   user [current user]
   * @param  {Function} cb     [callback function]
   *
   */
  var getUsersByRole = (userId, roles, limit, page, cb) => {
    var options = {
        select: 'email name role img_url',
        sort: {
          createdAt: -1
        },
        lean: false,
        page: page,
        limit: limit,
        populate: {
          path: 'role',
          select: 'title'
        }
      },
      query = {
        $and: [{
          role: {
            $in: roles.split(',')
          }
        }, {
          _id: {
            $ne: userId
          }
        }]
      };
    models.User.paginate(query, options, (err, users) => {
      if (err) {
        return cb(_h.returnErrorMsg(err, null));
      }
      cb(null, users);
    });
  };

  /**
   * Retrives a specific user with registered credentials
   *
   * @param  {Number}   userId [ID for a specific user]
   * @param  {Function} cb     [callback function]
   *
   */
  var getUser = (userId, cb) => {
    co(function* () {
      try {
        var query = {
          _id: userId
        };
        var user = yield models.User.findOne(query)
          .select('name email role img_url img_public_id google facebook')
          .populate({
            path: 'role',
            select: 'title'
          });
        if (user) {
          cb(null, user);
        } else {
          cb(_h.returnErrorMsg('User not found', 404));
        }
      } catch (e) {
        cb(e, null);
      }
    });
  };

  /**
   * Update a specific user in storage
   *
   * @param  {Number}   userId      [ID for a specific user]
   * @param  {Object}   userDetails [user credentials ro be updated]
   * @param  {Function} cb          [callback function]
   *
   */
  var updateUser = (userId, userDetails, cb) => {
    co(function* () {
      try {
        var query = {
            _id: userId
          },
          updatedUser = '',
          fullname = {
            first: userDetails.firstname,
            last: userDetails.lastname
          },
          role = yield models.Role.findOne({
            title: userDetails.role
          }),
          user = yield models.User.findOne({
            $and: [{
              email: userDetails.email
            }, {
              _id: {
                $ne: userId
              }
            }]
          });
        if (!role) {
          return cb(_h.returnErrorMsg('Specified role not found', 404));
        }
        if (user) {
          var err = [
            'User exists already! choose a different email',
            409
          ];
          return cb(_h.returnErrorMsg(...err));
        }
        userDetails.name = fullname;
        userDetails.role = role;
        delete userDetails.lastname;
        delete userDetails.firstname;
        updatedUser = yield models.User.findOneAndUpdate(query, userDetails);
        if (!updatedUser) {
          return cb(_h.returnErrorMsg('User was not updated', null));
        }
        var _user = yield models.User.findOne({
          _id: updatedUser._id
        })
        .select('name email role img_url img_public_id google facebook')
        .populate({
          path: 'role',
          select: 'title'
        });
        cb(null, _user);
      } catch (e) {
        cb(e);
      }
    });
  };

  /**
   * Removes a specific user from resource
   *
   * @param  {Number}   userId [ID for a specific user]
   * @param  {Function} cb     [callback function]
   *
   */
  var deleteUser = (userId, cb) => {
    co(function* () {
      try {
        var query = {
            _id: userId
          },
          deletedUser = yield models.User.findOneAndRemove(query);
        if (!deletedUser) {
          return cb(_h.returnErrorMsg('User was not deleted', null));
        }
        cb();
      } catch (e) {
        cb(e);
      }
    });
  };

  return {
    createUser: createUser,
    getUsers: getUsers,
    getUsersByRole: getUsersByRole,
    getUser: getUser,
    updateUser: updateUser,
    deleteUser: deleteUser
  };
};

module.exports = userHelper;
