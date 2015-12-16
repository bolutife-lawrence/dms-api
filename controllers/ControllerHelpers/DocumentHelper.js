var DocHelper = (models, _h, co) => {
  var createDocument = (title, content, roles, username, cb) => {
    co(function* () {
      roles = roles.split(',');
      var user = yield models.User.findOne({
        'username': username
      });
      var _roles = yield models.Role.find({
        title: {
          $in: roles
        }
      });
      if (!user) return cb(`${username} is not a user!`);
      if (_roles.length === 0)
        return cb('Role(s) specified could not be found.');
      var findDocMatch = yield models.Document.find({
        'userId': user._id,
        'title': title
      });
      if (findDocMatch.length !== 0)
        return cb(`Document \'${title}\' already created by ${username}`);
      var newDoc = new models.Document({
        title: title,
        content: content,
        userId: user,
        roles: _roles
      });
      var savedDocument = yield newDoc.save();
      return savedDocument ?
        cb() : cb(`Document could not be created`);
    });
  };

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
      if (err) return cb(err);
      return docs.length !== 0 ?
        cb(null, docs) : cb('No document has been created yet.');
    });
  };

  var getDocument = (docId, cb) => {
    co(function* () {
      var query = {
        _id: docId
      };
      var doc = yield models.Document.findOne(query)
        .populate([{
          path: 'roles',
          select: 'title'
        }, {
          path: 'userId',
          select: 'username'
        }]);
      return doc ? cb(null, doc) : cb(`No doc with the id : ${docId}`);
    });
  };

  var editDocument = (docId, docDetails, cb) => {
    co(function* () {
      var _roles = yield models.Role.find({
          title: {
            $in: docDetails.roles.split(',')
          }
        }),
        user = yield models.User.findOne({
          'username': docDetails.username
        });
      if (_roles.length === 0)
        return cb('Role(s) specified could not be found.');
      if (!user) return cb(`Invalid username: ${docDetails.username}`);
      docDetails.roles = _roles;
      docDetails.docType = _h.getDocType(docDetails.docName);
      var query = {
        $and: [{
          '_id': docId
        }, {
          'userId': user._id
        }]
      };
      delete docDetails.username;
      var updatedDoc =
        yield models.Document.findOneAndUpdate(query, docDetails);
      return !updatedDoc ?
        cb('Permission denied. Document or Document owner was not found!') :
        cb();
    });
  };

  var deleteDocument = (docId, username, cb) => {
    co(function* () {
      try {
        var user = yield models.User.findOne({
          'username': username
        });
        if (!user) return cb(`${username} not found!`);
        var query = {
          $and: [{
            '_id': docId
          }, {
            'userId': user._id
          }]
        };
        console.log(query);
        var deletedDoc = yield models.Document.findOneAndRemove(query);
        return !deletedDoc ? cb('Access Denied! Document not found!') : cb();
      } catch (e) {
        cb(e);
      }
    });
  };

  return {
    createDocument: createDocument,
    getDocuments: getDocuments,
    getDocument: getDocument,
    editDocument: editDocument,
    deleteDocument: deleteDocument
  };
};

module.exports = DocHelper;
