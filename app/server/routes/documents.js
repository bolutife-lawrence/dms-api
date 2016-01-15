/**
 *
 * Document routes.
 *
 * @param  {object Object} router [express router object]
 * @param  {object Object} controllers [controllers to me mouted on routes]
 *
 */
var docRoute = (router, controllers) => {

  router.route('/documents')
    .post(controllers.docController.createDocument)
    .get(controllers.docController.getDocuments);

  router.route('/documents/:id')
    .get(controllers.docController.getDocument)
    .put(controllers.docController.editDocument)
    .delete(controllers.docController.deleteDocument);

  router.route('/roles/:id/documents')
    .get(controllers.docController.getDocsByRole);

  router.route('/users/:id/documents')
    .get(controllers.docController.getDocsByUser);
};

module.exports = docRoute;
