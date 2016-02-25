var userController = (_validate, _h, userHelper, jwt) => {
  var createUser = (req, res) => {
    _validate.validateUserDetails(req, (err) => {
      if (err) return res.status(400).json(err);
      var args = [
        req.body.username,
        req.body.lastname,
        req.body.firstname,
        req.body.role,
        req.body.email,
        req.body.password
      ];
      userHelper.createUser(...args, (err, user) => {
        var token = null;
        if (!err) {
          var options = {
            expiresIn: '24h' // expires in 24 hours from creation.
          };
          token = jwt.sign(user, process.env.WEB_TOKEN_SECRET, options);
        }
        var args = [err, 'user', user,
          'User successfully created!', res, token
        ];
        return _h.feedback(...args);
      });
    });
  };

  var getUsers = (req, res) => {
    _validate.validatePaginationParams(req, (err) => {
      if (err) return res.status(400).json(err);
      var args = [
        parseInt(req.query.limit) || 20,
        parseInt(req.query.page) || 1
      ];
      userHelper.getUsers(...args, (err, users) => {
        return _h.feedback(err, 'users', users, null, res);
      });
    });
  };

  var getUsersByRole = (req, res) => {
    var args = [
      req.user._id,
      req.query.roles,
      parseInt(req.query.limit) || 20,
      parseInt(req.query.page) || 1
    ];
    userHelper.getUsersByRole(...args, (err, users) => {
      return _h.feedback(err, 'users', users, null, res);
    });
  };

  var getUser = (req, res) => {
    _validate.validateId(req, (err) => {
      if (err) return res.status(400).json(err);
      userHelper.getUser(req.params.id, (err, user) => {
        return _h.feedback(err, 'user', user, null, res);
      });
    });
  };

  var updateUser = (req, res) => {
    _validate.validateId(req, (err) => {
      if (err) return res.status(400).json(err);
      _validate.validateUserDetails(req, (err) => {
        if (err) return res.status(400).json(err);
        userHelper.updateUser(req.params.id, req.body, (err, user) => {
          var token = null;
          if (!err) {
            var options = {
              expiresIn: '24h' // expires in 24 hours from creation.
            };
            token = jwt.sign(user, process.env.WEB_TOKEN_SECRET, options);
          }
          var args = [
            err, 'user', user, 'User successfully updated!', res, token
          ];
          return _h.feedback(...args);
        });
      });
    });
  };

  var deleteUser = (req, res) => {
    _validate.validateId(req, (err) => {
      if (err) return res.status(400).json(err);
      userHelper.deleteUser(req.params.id, (err) => {
        return _h.feedback(err, null, null, 'User deleted successfully!', res);
      });
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

module.exports = userController;
