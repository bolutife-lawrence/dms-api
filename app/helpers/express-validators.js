module.exports = (() => {
  var feedback = (req, cb) => {
      var errors = req.validationErrors();
      if (errors) { // Display errors to user
        var error = {
          success: false,
          message: 'Params Validation Failed!',
          errors: errors
        };
        cb(error);
      } else cb();
    },

    validateAuthParams = (req, cb) => {
      // validate request body fields.
      req.checkBody('email', 'email is required to gain access')
        .isEmail()
        .notEmpty();
      req.checkBody('password', 'password field cannot be empty.').notEmpty();
      return feedback(req, cb);
    },

    validateUserDetails = (req, cb) => {
      // validate request body fields.
      if (req.body.username || req.body.lastname ||
        req.body.firstname || req.body.role) {
        req.checkBody('lastname')
          .isAlpha()
          .withMessage('lastname can only contain alphabets')
          .len(1, 50)
          .withMessage('lastname should be between 6 to 50 characters');
        req.checkBody('firstname')
          .isAlpha()
          .withMessage('firstname can only contain alphabets')
          .len(1, 50)
          .withMessage('firstname should be between 6 to 50 characters');
        req.checkBody('role')
          .len(1, 30)
          .withMessage('role should be between 1 to 30 characters');
      }

      req.checkBody('email', 'Invalid Email. Please provide a valid email')
        .notEmpty().withMessage('email is required')
        .isEmail();
      return feedback(req, cb);
    },

    validatePaginationParams = (req, cb) => {
      if (req.query.hasOwnProperty('page'))
        req.checkQuery('page', 'Page number must be an interger').isInt();
      if (req.query.hasOwnProperty('limit'))
        req.checkQuery('limit', 'limit must be an interger').isInt();
      return feedback(req, cb);
    },

    validateId = (req, cb) => {
      req.checkParams('id', 'userId is required to fetch a user')
        .len(24, 24).withMessage('Invalid Id')
        .notEmpty();
      return feedback(req, cb);
    },

    validatePubId = (req, cb) => {
      req.checkParams('id', 'Image public id is required')
        .len(20, 20).withMessage('Invalid Id')
        .notEmpty();
      return feedback(req, cb);
    },

    validateDocDetails = (req, cb) => {
      req.checkBody('title', 'Document title is required')
        .len(1, 50)
        .withMessage('Document title can only be between 3 to 50 characters.')
        .notEmpty();
      req.checkBody('content', 'Document content is required')
        .len(1, 2000)
        .withMessage('Document content can only contain 1000 characters.')
        .notEmpty();
      req.checkBody('roles', 'Atleast a role must be specified.')
        .notEmpty();
      return feedback(req, cb);
    },

    validateRoleTitle = (req, cb) => {
      req.checkBody('title', 'Role title is required to create new role.')
        .len(2, 50)
        .withMessage('Role title can only be between 3 to 50 characters.')
        .notEmpty();
      return feedback(req, cb);
    };

  return {
    validateAuthParams: validateAuthParams,
    validateUserDetails: validateUserDetails,
    validatePaginationParams: validatePaginationParams,
    validateId: validateId,
    validatePubId: validatePubId,
    validateDocDetails: validateDocDetails,
    validateRoleTitle: validateRoleTitle
  };
})();
