var userController = (_validate, _h, userHelper) => {
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
        var args = [err, 'user', user, 'User successfully created!', res];
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
        userHelper.updateUser(req.params.id, req.body, (err) => {
          var args = [err, null, null, 'User successfully updated!', res];
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
    getUser: getUser,
    updateUser: updateUser,
    deleteUser: deleteUser
  };
};

module.exports = userController;
