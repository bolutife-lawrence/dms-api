var userRoute = (router, controllers) => {
  router.route('/users')
    .post(controllers.userController.createUser)
    .get(controllers.userController.getUsers);

  router.route('/users/:id')
    .delete(controllers.userController.deleteUser)
    .put(controllers.userController.updateUser)
    .get(controllers.userController.getUser);
    
};

module.exports = userRoute;
