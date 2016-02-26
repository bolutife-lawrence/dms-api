var imgUploadRoutes = (router, controllers, upload) => {
  router.route('/image/upload')
    .post(upload.single('avatar'), controllers.uploadController.userImgUpload);

  router.route('/images/:id')
    .delete(controllers.uploadController.delete,
      controllers.uploadController.deleteImage);
};

module.exports = imgUploadRoutes;
