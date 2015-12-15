var models = require('../models'),
  _validate = require('../helpers/expressValidators'),
  _h = require('../helpers/helperFunctions'),
  DocumentHelper = require('./ControllerHelpers').DocumentHelper;

/**
 * [description]
 * @param  {[type]} ( [description]
 * @return {[type]}   [description]
 */
module.exports = (() => {
  var createDocument =  (req, res) => {
    _validate.validateDocDetails(req, (err) => {
      if (err) return res.status(400).json(err);
      var args = [req.body.docName, req.body.title, req.body.content, req.body.roles, req.body.username];
      DocumentHelper.createDocument(...args, (err) => {
        return _h.feedback(err, null, null,'Document created sucessfully', res);
      });
    });
  };

  var getDocuments =  (req, res) => {
    _validate.validatePaginationParams(req, (err) => {
      if (err) return res.status(400).json(err);
      var args = [parseInt(req.query.limit) || 20, parseInt(req.query.page) || 1];
      DocumentHelper.getDocuments(...args, (err, docs) => {
        return _h.feedback(err, 'docs', docs, null, res);
      });
    });
  };

  var getDocument = (req, res) => {
    _validate.validateId(req, (err) => {
      if (err) return res.status(400).json(err);
      DocumentHelper.getDocument(req.params.id, (err, doc) => {
        return _h.feedback(err, 'doc', doc, null, res);
      });
    });
  };

  var editDocument = (req, res) => {
    _validate.validateId(req, (err) => {
      if (err) return res.status(400).json(err);
      _validate.validateDocDetails(req, (err) => {
        if (err) return res.status(400).json(err);
        DocumentHelper.editDocument(req.params.id, req.body, (err) => {
          return _h.feedback(err, null, null, 'Document updated successfully!', res);
        });
      });
    });
  };

  var deleteDocument = (req, res) => {
    _validate.validateId(req, (err) => {
      if (err) return res.status(400).json(err);
      DocumentHelper.deleteDocument(req.params.id, req.body.username, (err) => {
        return _h.feedback(err, null, null, 'Document deleted successfully!', res);
      });
    });
  };

  return {
    createDocument: createDocument,
    getDocuments: getDocuments,
    getDocument: getDocument,
    editDocument: editDocument,
    deleteDocument: deleteDocument
  };
})();
