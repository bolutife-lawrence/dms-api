var express = require('express'),
    router = express.Router(),
    auth = require('../middlewares/auth'),
    controllers = require('../controllers');

router.all('/*', auth.isAuthenticated);

router.route('/')
  .post(controllers.DocController.createDocument)
  .get(controllers.DocController.getDocuments);

router.route('/:id')
  .get(controllers.DocController.getDocument)
  .put(controllers.DocController.editDocument)
  .delete(controllers.DocController.deleteDocument);

module.exports = router;
