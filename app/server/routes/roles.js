var roleRoute = (router, controllers) => {
  router.route('/roles')
    .get(controllers.roleController.getRoles)
    .post(controllers.roleController.createRole);

  router.route('/roles/:id')
    .delete(controllers.roleController.deleteRole)
    .put(controllers.roleController.updateRole)
    .get(controllers.roleController.getRole);
};

module.exports = roleRoute;
