var express = require('express'),
  router = express.Router(),
  auth = require('../middlewares/auth'),
  controllers = require('../controllers');

router.all('*', auth.isAuthenticated);
router.route('/').get(controllers.RoleController.getRoles);

// Protect all confidential routes - Authentication  and Authorization.
// This accertains that a user is authenticated to access certain routes.
// And also accertains that a user has certain permissions access
// confidential routes.
router.all('*', auth.isSuperAdmin);
router.route('/').post(controllers.RoleController.createRole);
router.route('/:id')
  .delete(controllers.RoleController.deleteRole)
  .put(controllers.RoleController.updateRole)
  .get(controllers.RoleController.getRole);

module.exports = router;
