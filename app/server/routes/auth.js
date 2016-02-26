var authRoute = (router, controllers) => {

  router.route('/auth/authenticate')
    .post(controllers.authController);
};

module.exports = authRoute;
