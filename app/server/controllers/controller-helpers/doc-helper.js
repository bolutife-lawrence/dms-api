/**
 * Document controller helper functions
 *
 * These functions are being used by the Document controller.
 *
 * @param  {object} models [models to be used are being injected]
 * @param  {object} _h     [general helper functions]
 * @param  {function} co   [co generator lib sallows async mode simulation]
 * @param  {function} _    [lodash lib]
 */
var docHelper = (models, _h, co, _) => {

  /**
   *
   * Creates a new document.
   *
   * @param  {string}   title    [title of the document to be created]
   * @param  {string}   content  [content not greater than 2000 characters]
   * @param  {string || Array} roles [roles to be defined on the document]
   * @param  {Number}   userId [current authenticated user ID]
   * @param  {Function} cb       [callback function]
   *
   */
  var createDocument = (title, content, roles, userId, cb) => {

    var findDocMatch = '',
      saveDocument = {},
      _roles = [];

    co(function* () {
      try {
        if (typeof roles === 'string') {
          roles = roles.replace(/\s/g, '').split(',');
        }
        _roles = yield models.Role.find({
          title: {
            $in: roles
          }
        });
        if (_roles.length === 0) {
          return cb(_h.returnErrorMsg('Role(s) specified not found', 404));
        }
        findDocMatch = yield models.Document.findOne({
          $and: [{
            userId: userId
          }, {
            title: title
          }]
        });
        if (findDocMatch) {
          return cb(_h.returnErrorMsg('Document already exists', 409));
        }
        saveDocument = yield new models.Document({
          title: title,
          content: content,
          userId: userId,
          roles: _roles
        }).save();
        if (!saveDocument) {
          return cb(_h.returnErrorMsg('Document was not created', null));
        }
        cb(null, saveDocument);
      } catch (e) {
        cb(e);
      }
    });
  };

  /**
   * Retrive all documents from storage
   *
   * @param  {Number}   limit [This controls how many documents is returned
   *                          	in an instance]
   * @param  {Number}   page [page number where documents should be loaded into]
   * @param  {Function} cb   [callback function]
   *
   */
  var getDocuments = (limit, page, cb) => {
    var options = {
      sort: {
        createdAt: -1
      },
      lean: false,
      page: page,
      limit: limit,
      populate: [{
        path: 'roles',
        select: 'title'
      }, {
        path: 'userId',
        select: 'username'
      }]
    };
    models.Document.paginate({}, options, (err, docs) => {
      if (err) {
        return cb(_h.returnErrorMsg(err, null));
      }
      cb(null, docs);
    });
  };

  /**
   * Retrieves all documents created by a specific user
   *
   * @param  {Number}   userId [ID for a specific user]
   * @param  {Number}   page   [This controls how many documents is returned
                                 in an instance]
   * @param  {Number}   limit  [page number where docs should be loaded into]
   * @param  {Function} cb     [callback function]
   *
   */
  var getDocsByUser = (userId, page, limit, cb) => {
    var query = {
        userId: userId
      },
      options = {
        sort: {
          createdAt: -1
        },
        lean: false,
        page: page,
        limit: limit,
        populate: [{
          path: 'roles',
          select: 'title'
        }, {
          path: 'userId',
          select: 'username'
        }]
      };
    models.Document.paginate(query, options, (err, docs) => {
      if (err) {
        return cb(_h.returnErrorMsg(err, null));
      }
      cb(null, docs);
    });
  };

  /**
   * [description]
   * @param  {[type]}   roleId [description]
   * @param  {[type]}   page   [description]
   * @param  {[type]}   limit  [description]
   * @param  {Function} cb     [description]
   * @return {[type]}          [description]
   */
  var getDocsByRole = (roleId, userId, page, limit, cb) => {
    var query = {
        $and: [{
          roles: {
            $in: [roleId]
          }
        }, {
          userId: {
            $ne: userId
          }
        }]
      },
      options = {
        sort: {
          createdAt: -1
        },
        lean: false,
        page: page,
        limit: limit,
        populate: [{
          path: 'roles',
          select: 'title'
        }, {
          path: 'userId',
          select: 'name email'
        }]
      };
    models.Document.paginate(query, options, (err, docs) => {
      if (err) {
        return cb(_h.returnErrorMsg(err, null));
      }
      cb(null, docs);
    });
  };

  /**
   *
   * Retrive a specific document
   *
   * @param  {Number}   docId [ID for a specific document]
   * @param  {[object Object]} user [current authenticated user ID]
   * @param  {Function} cb    [callback function]
   *
   */
  var getDocument = (docId, user, cb) => {
    co(function* () {
      try {
        var query = {
          _id: docId
        };
        var doc = yield models.Document.findOne(query)
          .populate([{
            path: 'roles',
            select: 'title'
          }, {
            path: 'userId',
            select: 'name'
          }]);
        if (doc) {
          var roles = _.map(doc.roles, 'title'),
            userRole = user.role[0].title,
            checkRole = roles.indexOf(userRole) !== -1 ||
            userRole == 'admin' || userRole == 'superadmin' ||
            user._id === doc.userId[0]._id.toString();
          if (!checkRole) {
            var err = ['Access Denied! You cannot access this resource', 403];
            return cb(_h.returnErrorMsg(...err));
          }
          cb(null, doc);
        } else {
          cb(_h.returnErrorMsg('Document not found', 404));
        }
      } catch (e) {
        cb(e);
      }
    });
  };

  /**
   *
   * Edit a specific document
   *
   * @param  {Number}   docId      [ID for a specific document]
   * @param  {Number}   userId     [current authenticated user ID]
   * @param  {Object}   docDetails [Document details to be updated]
   * @param  {Function} cb         [callback function]
   *
   */
  var editDocument = (docId, userId, docDetails, cb) => {
    if (typeof docDetails.roles === 'string') {
      docDetails.roles = docDetails.roles.replace(/\s/g, '').split(',');
    }
    var query = {
        _id: docId
      },
      updatedDoc = {};
    co(function* () {
      try {
        var doc = yield models.Document.findOne(query);
        if (!doc) {
          return cb(_h.returnErrorMsg('Document not found', 404));
        }
        if (doc.userId[0].toString() !== userId) {
          var err = ['Access Denied! You cannot perform this operation', 403];
          return cb(_h.returnErrorMsg(...err));
        }
        var _roles = yield models.Role.find({
          title: {
            $in: docDetails.roles
          }
        });
        if (_roles.length === 0) {
          return cb(_h.returnErrorMsg('Role(s) specified not found.', 404));
        }
        var findDocMatch = yield models.Document.findOne({
          $and: [{
            $and: [{
              title: docDetails.title
            }, {
              _id: {
                $ne: docId
              }
            }]
          }, {
            userId: userId
          }]
        });
        if (findDocMatch) {
          return cb(_h.returnErrorMsg('Document exists already', 409));
        }
        docDetails.roles = _roles;
        docDetails.updatedAt = Date.now();
        updatedDoc = yield models.Document.findOneAndUpdate(query, docDetails);
        if (!updatedDoc) {
          return cb(_h.returnErrorMsg('Document could not be updated', null));
        }
        cb(null, updatedDoc);
      } catch (e) {
        cb(e);
      }
    });
  };

  /**
   *
   * Remove a specific document from storage
   *
   * @param  {Number}   docId  [ID for a specific document]
   * @param  {Nmmber}   userID [current authenticated user ID]
   * @param  {Function} cb     [callback function]
   *
   */
  var deleteDocument = (docId, userId, cb) => {
    co(function* () {
      try {
        var query = {
            _id: docId
          },
          doc = yield models.Document.findOne(query);
        if (!doc) {
          // Throw a 404 error if the document was not found.
          return cb(_h.returnErrorMsg('Document not found', 404));
        }

        if (doc.userId[0].toString() !== userId) {
          // Throw a 403 error if requesting user is not document owner.
          var err = ['Access Denied! You cannot perform this operation', 403];
          return cb(_h.returnErrorMsg(...err));
        }
        var deletedDoc = yield models.Document.findOneAndRemove(query);
        if (!deletedDoc) {
          return cb(_h.returnErrorMsg('Document could not be deleted', null));
        }
        cb();
      } catch (e) {
        cb(e);
      }
    });
  };

  // Reveal all declared functions
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

module.exports = docHelper;
