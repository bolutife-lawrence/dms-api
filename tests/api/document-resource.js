var documentResource = (api, expect, fixtures, jwt, _async, invalidId) => {
  describe('DMS API Document Resource', () => {
    describe('CRUD operations', () => {
      var _users = {},
        docID = '',
        pokerUserToken = '',
        pokerUserRoleId = '',
        logins = [
          fixtures.moderator_login,
          fixtures.guest_user_login,
          fixtures.admin_user_login
        ],
        docs = [
          fixtures.doc1,
          fixtures.doc2,
          fixtures.doc3
        ];

      before((done) => {
        _async.each(logins, (login, cb) => {
          api
            .post('/api/v0.1/auth/authenticate')
            .set('Accept', 'application/x-www-form-urlencoded')
            .send(login)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              expect(err).to.be(null);
              jwt.verify(res.body.token,
                process.env.WEB_TOKEN_SECRET, (err, user) => {
                  expect(err).to.be(null);
                  _users[user._doc.role[0].title] = {
                    id: user._doc._id,
                    token: res.body.token
                  };
                  api
                    .post('/api/v0.1/documents')
                    .set('Accept', 'application/x-www-form-urlencoded')
                    .set('x-access-token', res.body.token)
                    .send(docs[logins.indexOf(login)])
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err) => {
                      expect(err).to.be(null);
                      cb();
                    });
                });
            });
        }, (err) => {
          expect(err).to.be(null);
          done();
        });
      });

      it('POST: should create a new document', (done) => {
        api
          .post('/api/v0.1/documents')
          .set('x-access-token', _users.moderator.token)
          .set('Accept', 'application/x-www-form-urlencoded')
          .send(fixtures._document.create)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).to.be.ok();
            expect(res.body.message).to.be('Document created successfully');
            docID = res.body.doc._id;
            done();
          });
      });

      it('POST: should throw an error if document exists', (done) => {
        api
          .post('/api/v0.1/documents')
          .set('x-access-token', _users.moderator.token)
          .set('Accept', 'application/x-www-form-urlencoded')
          .send(fixtures._document.create)
          .expect('Content-Type', /json/)
          .expect(409)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be('Document already exists');
            done();
          });
      });

      it('PUT: should update a specific document', (done) => {
        api
          .put('/api/v0.1/documents/' + docID)
          .set('x-access-token', _users.moderator.token)
          .set('Accept', 'application/x-www-form-urlencoded')
          .send(fixtures._document.update)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).to.be.ok();
            expect(res.body.message).to.be('Document updated successfully!');
            done();
          });
      });

      it('PUT: should throw an error if document exists', (done) => {
        fixtures._document.update.title = 'Test Doc 1';
        api
          .put('/api/v0.1/documents/' + docID)
          .set('x-access-token', _users.moderator.token)
          .set('Accept', 'application/x-www-form-urlencoded')
          .send(fixtures._document.update)
          .expect('Content-Type', /json/)
          .expect(409)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be('Document exists already');
            done();
          });
      });

      it('PUT: should throw a 404 error if document is not found', (done) => {
        api
          .put('/api/v0.1/documents/' + invalidId)
          .set('x-access-token', _users.moderator.token)
          .set('Accept', 'application/x-www-form-urlencoded')
          .send(fixtures._document.update)
          .expect('Content-Type', /json/)
          .expect(404)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be('Document not found');
            done();
          });
      });

      it('PUT: should restrict access to document owner', (done) => {
        api
          .put('/api/v0.1/documents/' + docID)
          .set('x-access-token', _users.guest.token)
          .set('Accept', 'application/x-www-form-urlencoded')
          .send(fixtures._document.update)
          .expect('Content-Type', /json/)
          .expect(403)
          .end((err, res) => {
            var message = 'Access Denied! You cannot perform this operation';
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be(message);
            done();
          });
      });

      it('PUT: should throw a 404 error role(s) is not found', (done) => {
        fixtures._document.update.roles = ['hounder', 'clerk'];
        api
          .put('/api/v0.1/documents/' + docID)
          .set('x-access-token', _users.moderator.token)
          .set('Accept', 'application/x-www-form-urlencoded')
          .send(fixtures._document.update)
          .expect('Content-Type', /json/)
          .expect(404)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be('Role(s) specified not found.');
            done();
          });
      });

      it('should retrive a specific document', (done) => {
        api
          .get('/api/v0.1/documents/' + docID)
          .set('x-access-token', _users.moderator.token)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).to.be.ok();
            done();
          });
      });

      it('should restrict access to users with featured role', (done) => {
        api
          .get('/api/v0.1/documents/' + docID)
          .set('x-access-token', _users.guest.token)
          .expect('Content-Type', /json/)
          .expect(403)
          .end((err, res) => {
            expect(err).to.be(null);
            var message = 'Access Denied! You cannot access this resource';
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be(message);
            done();
          });
      });

      it('should grant access to an admin or superadmin', (done) => {
        api
          .get('/api/v0.1/documents/' + docID)
          .set('x-access-token', _users.admin.token)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).to.be.ok();
            done();
          });
      });

      it('should return 404 error if document is not found', (done) => {
        api
          .get('/api/v0.1/documents/' + invalidId)
          .set('x-access-token', _users.admin.token)
          .expect('Content-Type', /json/)
          .expect(404)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be('Document not found');
            done();
          });
      });

      it('should not create document if user not authenticated', (done) => {
        api
          .post('/api/v0.1/documents')
          .set('Accept', 'application/x-www-form-urlencoded')
          .send({})
          .expect('Content-Type', /json/)
          .expect(401)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            done();
          });
      });

      it('should throw an error if roles specified not found', (done) => {
        fixtures._document.create.roles = ['role1', 'role2', 'role3'];
        api
          .post('/api/v0.1/documents')
          .set('Accept', 'application/x-www-form-urlencoded')
          .set('x-access-token', _users.moderator.token)
          .send(fixtures._document.create)
          .expect('Content-Type', /json/)
          .expect(404)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be('Role(s) specified not found');
            done();
          });
      });

      it('should validate document details before persisting', (done) => {
        fixtures._document.create.title = '';
        fixtures._document.create.content = '';
        fixtures._document.create.roles = '';
        api
          .post('/api/v0.1/documents')
          .set('x-access-token', _users.moderator.token)
          .set('Accept', 'application/x-www-form-urlencoded')
          .send(fixtures._document.create)
          .expect('Content-Type', /json/)
          .expect(400)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be('Params Validation Failed!');
            done();
          });
      });

      it('should validate docID for doc-specific opeartions', (done) => {
        api
          .get('/api/v0.1/documents/' + docID.slice(3))
          .set('x-access-token', _users.moderator.token)
          .expect('Content-Type', /json/)
          .expect(400)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be('Params Validation Failed!');
            api
              .put('/api/v0.1/documents/' + docID.slice(2))
              .set('x-access-token', _users.moderator.token)
              .expect('Content-Type', /json/)
              .expect(400)
              .end((err, res) => {
                expect(err).to.be(null);
                expect(res.body.success).not.to.be.ok();
                expect(res.body.message).to.be('Params Validation Failed!');
                api
                  .delete('/api/v0.1/documents/' + docID.slice(1))
                  .set('x-access-token', _users.moderator.token)
                  .expect('Content-Type', /json/)
                  .expect(400)
                  .end((err, res) => {
                    expect(err).to.be(null);
                    expect(res.body.success).not.to.be.ok();
                    expect(res.body.message).to.be('Params Validation Failed!');
                    done();
                  });
              });
          });
      });

      it('should retrive all documents in storage', (done) => {
        api
          .get('/api/v0.1/documents')
          .set('x-access-token', _users.admin.token)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).to.be.ok();
            expect(res.body.docs).to.be.an('object');
            expect(res.body.docs.total).to.be(4);
            done();
          });
      });

      it('should reterive all documents created by a user', (done) => {
        api
          .get('/api/v0.1/users/' + _users.moderator.id + '/documents')
          .set('x-access-token', _users.moderator.token)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).to.be.ok();
            done();
          });
      });

      var msg = 'should apply pagination to reterived' +
        'documents created by a user';
      it(msg, (done) => {
        api
          .get('/api/v0.1/users/' + _users.moderator.id + '/documents')
          .set('x-access-token', _users.moderator.token)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).to.be.ok();
            expect(res.body.docs.total).to.be(2);
            expect(res.body.docs.limit).to.be(20);
            expect(res.body.docs.pages).to.be(1);
            expect(res.body.docs.page).to.be(1);
            done();
          });
      });

      var msg2 = 'GET: should apply pagination to retrieved' +
        ' documents with defualt limit of 20 per page.';
      it(msg2, (done) => {
        api
          .get('/api/v0.1/documents')
          .set('x-access-token', _users.admin.token)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.docs.total).to.be(4);
            expect(res.body.docs.limit).to.be(20);
            expect(res.body.docs.pages).to.be(1);
            expect(res.body.docs.page).to.be(1);
            done();
          });
      });

      it('should use pagination params if supplied', (done) => {
        api
          .get('/api/v0.1/documents/?limit=2&page=1')
          .set('x-access-token', _users.admin.token)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.docs.total).to.be(4);
            expect(res.body.docs.limit).to.be(2);
            expect(res.body.docs.pages).to.be(2);
            expect(res.body.docs.page).to.be(1);
            done();
          });
      });

      it('should throw an error if pagination params is invalid', (done) => {
        api
          .get('/api/v0.1/documents/?limit=fjbfjhf&page=mmdjdj')
          .set('x-access-token', _users.admin.token)
          .expect('Content-Type', /json/)
          .expect(400)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be('Params Validation Failed!');
            done();
          });
      });

      it('GET: should retrieve all documents with a featured role', (done) => {
        api
          .post('/api/v0.1/auth/authenticate')
          .set('Accept', 'application/x-www-form-urlencoded')
          .send(fixtures.poker_user_login)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be(null);
            pokerUserToken = res.body.token;
            jwt.verify(pokerUserToken,
              process.env.WEB_TOKEN_SECRET, (err, user) => {
                expect(err).to.be(null);
                pokerUserRoleId = user._doc.role[0]._id;
                api
                  .get('/api/v0.1/roles/' + pokerUserRoleId + '/documents')
                  .set('x-access-token', pokerUserToken)
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end((err, res) => {
                    expect(err).to.be(null);
                    expect(res.body.success).to.be.ok();
                    expect(res.body.docs.total).to.be(2);
                    expect(res.body.docs.limit).to.be(20);
                    expect(res.body.docs.pages).to.be(1);
                    expect(res.body.docs.page).to.be(1);
                    done();
                  });
              });
          });
      });

      it('should restrict access to user with matching role', (done) => {
        api
          .get('/api/v0.1/roles/' + pokerUserRoleId + '/documents')
          .set('x-access-token', _users.moderator.token)
          .expect('Content-Type', /json/)
          .expect(403)
          .end((err, res) => {
            var message = 'Access Denied! You cannot perform this operation';
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be(message);
            done();
          });
      });

      it('should restrict access to documents\' owner', (done) => {
        api
          .get('/api/v0.1/users/' + _users.moderator.id + '/documents')
          .set('x-access-token', pokerUserToken)
          .expect('Content-Type', /json/)
          .expect(403)
          .end((err, res) => {
            var message = 'Access Denied! You cannot perform this operation';
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be(message);
            done();
          });
      });

      it('DELETE: should restrict access to document owner', (done) => {
        api
          .delete('/api/v0.1/documents/' + docID)
          .set('x-access-token', _users.guest.token)
          .expect('Content-Type', /json/)
          .expect(403)
          .end((err, res) => {
            var message = 'Access Denied! You cannot perform this operation';
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be(message);
            done();
          });
      });

      it('DELETE: should throw a 404error if document is not found', (done) => {
        api
          .delete('/api/v0.1/documents/' + invalidId)
          .set('x-access-token', _users.moderator.token)
          .expect('Content-Type', /json/)
          .expect(404)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be('Document not found');
            done();
          });
      });

      it('DELETE: should remove specified document from storage', (done) => {
        api
          .delete('/api/v0.1/documents/' + docID)
          .set('x-access-token', _users.moderator.token)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).to.be.ok();
            expect(res.body.message).to.be('Document deleted successfully!');
            done();
          });
      });
    });
  });
};

module.exports = documentResource;
