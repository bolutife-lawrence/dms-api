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
  };

  var validateAuthParams = (req, cb) => {
    // validate request body fields.
    req.checkBody('login', 'username or email is required to gain access')
      .notEmpty();
    req.checkBody('password', 'password field cannot be empty.').notEmpty();
    return feedback(req, cb);
  };

  function validateUserDetails(req, cb) {
    // validate request body fields.
    req.checkBody('username', 'username is required')
      .len(4, 20).withMessage('username should be between 6 to 30 characters')
      .notEmpty();
    req.checkBody('lastname', 'lastname is required')
      .isAlpha().withMessage('lastname can only contain alphabets')
      .len(1, 50).withMessage('lastname should be between 6 to 50 characters')
      .notEmpty();
    req.checkBody('firstname', 'firstname is required')
      .isAlpha().withMessage('firstname can only contain alphabets')
      .len(1, 50).withMessage('firstname should be between 6 to 50 characters')
      .notEmpty();
    req.checkBody('email', 'Invalid Email. Please provide a valid email')
      .notEmpty().withMessage('email is required')
      .isEmail();
    req.checkBody('password', 'password is required')
      .len(6, 20).withMessage('password should be between 6 to 20 characters')
      .notEmpty();
    req.checkBody('role', 'role is required')
      .len(3, 20).withMessage('role should be between 6 to 50 characters')
      .notEmpty();
    return feedback(req, cb);
  }

  function validatePaginationParams(req, cb) {
    if (req.query.hasOwnProperty('page'))
      req.checkQuery('page', 'Page number must be an interger').isInt();
    if (req.query.hasOwnProperty('limit'))
      req.checkQuery('limit', 'limit must be an interger').isInt();
    return feedback(req, cb);
  }

  function validateId(req, cb) {
    req.checkParams('id', 'userId is required to fetch a user')
      .len(24).withMessage('Invalid Id')
      .notEmpty();
    return feedback(req, cb);
  }

  function validateDocDetails(req, cb) {
    req.checkBody('title', 'Document title is required')
      .len(3, 50)
      .withMessage('Document title can only be between 3 to 50 characters.')
      .notEmpty();
    req.checkBody('content', 'Document content is required')
      .len(0, 2000)
      .withMessage('Document content can only contain 1000 characters.')
      .notEmpty();
    req.checkBody('roles', 'Atleast a role must be specified.')
      .notEmpty();
    return feedback(req, cb);
  }

  var validateRoleTitle = (req, cb) => {
    req.checkBody('title', 'Role title is required to create new role.')
      .len(2, 50).withMessage('Role title can only be between 3 to 50 characters.')
      .notEmpty();
    return feedback(req, cb);
  };

  return {
    validateAuthParams: validateAuthParams,
    validateUserDetails: validateUserDetails,
    validatePaginationParams: validatePaginationParams,
    validateId: validateId,
    validateDocDetails: validateDocDetails,
    validateRoleTitle: validateRoleTitle
  };
})();
