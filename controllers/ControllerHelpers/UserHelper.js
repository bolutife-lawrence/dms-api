var UserHelper = (models, _h, co) => {
  return (() => {
    var createUser = (username, lastname, firstname, role, email, password, cb) => {
      var hashSalt = {};
      hashSalt = _h.hash(password);
      co(function* () {
        _role = yield models.Role.findOne({
          'title': role
        });
        if (!_role) return cb(`${role} role does not exist!`);
        var user = yield models.User.findOne({
          $or: [{
            'username': username
          }, {
            'email': email
          }]
        });
        if (user) return cb('User Already exists!');
        var newUser = new models.User({
          username: username,
          name: {
            first: firstname,
            last: lastname
          },
          email: email,
          hashedPass: hashSalt.hashedPass,
          saltPass: hashSalt.salt,
          role: _role
        });
        var savedUser = yield newUser.save();
        delete savedUser.hashedPass;
        delete savedUser.saltPass;
        return savedUser ? cb(null, savedUser) : cb('An error occured while creating the user');
      });
    };

    var getUsers = (limit, page, cb) => {
      var options = {
        select: 'username email name role',
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
      models.User.paginate({}, options, (err, result) => {
        if (err) return cb(err);
        return result.length !== 0 ? cb(null, result) : cb('No user has been created yet.');
      });
    };

    var getUser = (userId, cb) => {
      co(function* () {
        var query = {
          _id: userId
        };
        var user = yield models.User.findOne(query)
          .select('name username email role')
          .populate({
            path: 'role',
            select: 'title'
          });
        return user ? cb(null, user) : cb(`No user with the id : ${userId}`);
      });
    };

    var updateUser = (userId, userDetails, cb) => {
      co(function* () {
        try {
          var query = {
              _id: userId
            },
            fullname = {
              first: userDetails.firstname,
              last: userDetails.lastname
            },
            role = yield models.Role.findOne({
              'title': userDetails.role
            }),
            user = yield models.User.findOne({
              $and: [{
                $or: [{
                  'username': userDetails.username
                }, {
                  'email': userDetails.email
                }]
              }, {
                _id: {
                  $ne: userId
                }
              }]
            });
          if (!role) return cb(`Role ${userDetails.role} does not exist`);
          if (user) return cb(`username or email already taken`);
          var hash = _h.hash(userDetails.password);
          userDetails.name = fullname;
          userDetails.hashedPass = hash.hashedPass;
          userDetails.saltPass = hash.salt;
          userDetails.role = role;
          delete userDetails.password;
          delete userDetails.lastname;
          delete userDetails.firstname;
          var updatedUser = yield models.User.findOneAndUpdate(query, userDetails);
          return !updatedUser ? cb('User does not exist!') : cb();
        } catch (e) {
          cb(e);
        }
      });
    };

    var deleteUser = (userId, cb) => {
      co(function* () {
        var query = {
            _id: userId
          },
          deletedUser = yield models.User.findOneAndRemove(query);
        return !deletedUser ? cb(`No user with id ${userId}`) : cb();
      });
    };

    var getDocsByUser = (userId, page, limit, cb) => {
      co(function* () {
        var query = {
          _id: userId
        };
        var user = yield models.User.findOne(query);
        if (!user) cb(`No user with id ${userId}`);
        var options = {
            sort: {
              createdAt: -1
            },
            lean: false,
            page: page,
            limit: limit,
            populate: [{
              path: 'roles',
              select: 'title'
            }, {
              path: 'userId',
              select: 'username'
            }]
          },
          query2 = {
            userId: userId
          };
        models.Document.paginate(query2, options, function (err, result) {
          if (err) return cb(err);
          return result.length !== 0 ? cb(null, result) : cb('No user has been created yet.');
        });
      });
    };

    return {
      createUser: createUser,
      getUsers: getUsers,
      getUser: getUser,
      updateUser: updateUser,
      deleteUser: deleteUser,
      getDocsByUser: getDocsByUser
    };
  })();
};

module.exports = UserHelper;
