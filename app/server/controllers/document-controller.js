/**
 * [description]
 * @param  {[type]} _validate [description]
 * @param  {[type]} _h        [description]
 * @param  {[type]} docHelper [description]
 * @return {[type]}           [description]
 */
var docController = (_validate, _h, docHelper) => {
  var createDocument = (req, res) => {
    _validate.validateDocDetails(req, (err) => {
      if (err) return res.status(400).json(err);
      var args = [
        req.body.title,
        req.body.content,
        req.body.roles,
        req.user._id
      ];
      docHelper.createDocument(...args, (err, doc) => {
        var args = [err, 'doc', doc, 'Document created successfully', res];
        return _h.feedback(...args);
      });
    });
  },

  getDocuments = (req, res) => {
    _validate.validatePaginationParams(req, (err) => {
      if (err) return res.status(400).json(err);
      var args = [
        parseInt(req.query.limit) || 20,
        parseInt(req.query.page) || 1
      ];
      docHelper.getDocuments(...args, (err, docs) => {
        return _h.feedback(err, 'docs', docs, null, res);
      });
    });
  },

  getDocsByUser = (req, res) => {
    _validate.validateId(req, function (err) {
      if (err) return res.status(400).json(err);
      _validate.validatePaginationParams(req, (err) => {
        if (err) return res.status(400).json(err);
        var args = [
          req.params.id, parseInt(req.query.page) || 1,
          parseInt(req.query.limit) || 20
        ];
        docHelper.getDocsByUser(...args, function (err, docs) {
          return _h.feedback(err, 'docs', docs, null, res);
        });
      });
    });
  },

  getDocsByRole = (req, res) => {
    _validate.validateId(req, function (err) {
      if (err) return res.status(400).json(err);
      _validate.validatePaginationParams(req, (err) => {
        if (err) return res.status(400).json(err);
        console.log(req.user);
        var args = [
          req.params.id, req.user._id, parseInt(req.query.page) || 1,
          parseInt(req.query.limit) || 20
        ];
        docHelper.getDocsByRole(...args, function (err, docs) {
          return _h.feedback(err, 'docs', docs, null, res);
        });
      });
    });
  },

  getDocument = (req, res) => {
    _validate.validateId(req, (err) => {
      if (err) return res.status(400).json(err);
      docHelper.getDocument(req.params.id, req.user, (err, doc) => {
        return _h.feedback(err, 'doc', doc, null, res);
      });
    });
  },

  editDocument = (req, res) => {
    _validate.validateId(req, (err) => {
      if (err) return res.status(400).json(err);
      _validate.validateDocDetails(req, (err) => {
        if (err) return res.status(400).json(err);
        docHelper.editDocument(req.params.id, req.user._id, req.body, (err) => {
          var args = [err, null, null, 'Document updated successfully!', res];
          return _h.feedback(...args);
        });
      });
    });
  },

  deleteDocument = (req, res) => {
    _validate.validateId(req, (err) => {
      if (err) return res.status(400).json(err);
      docHelper.deleteDocument(req.params.id, req.user._id, (err) => {
        var args = [err, null, null, 'Document deleted successfully!', res];
        return _h.feedback(...args);
      });
    });
  };

  return {
    createDocument: createDocument,
    getDocuments: getDocuments,
    getDocsByUser: getDocsByUser,
    getDocsByRole: getDocsByRole,
    getDocument: getDocument,
    editDocument: editDocument,
    deleteDocument: deleteDocument
  };
};

module.exports = docController;
