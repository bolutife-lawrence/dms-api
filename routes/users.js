var express = require('express'),
  router = express.Router(),
  auth = require('../middlewares/auth'),
  controllers = require('../controllers');

// Route to create a new user. This also checks if a user has the right privileges to
// create an admin or superadmin user.
router.route('/').post(auth.checkRole, controllers.UserController.createUser);

// Protect all confidential routes - Authentication.
// This accertains that a user is authenticated to access certain routes.
router.all('*', auth.isAuthenticated);
router.route('/:id')
  .put(controllers.UserController.updateUser)
  .get(controllers.UserController.getUser);
router.route('/:id/documents').get(controllers.UserController.getDocsByUser);

// This accertains that a user has certain rights to access confidential resources.
router.all('/*', auth.isAdmin);
router.route('/').get(controllers.UserController.getUsers);
router.route('/:id')
  .delete(controllers.UserController.deleteUser);

module.exports = router;
