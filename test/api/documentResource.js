var documentResource = (api, expect, fixtures, jwt) => {
  describe('DMS API Document Resource', () => {
    describe('CRUD operations', () => {
      var superAdminToken = '',
        userID = '',
        docID = '',
        i = 0;
      before((done) => {
        // Get Super Admin
        api
          .post('/DMS/api/auth/authenticate')
          .set('Accept', 'application/json')
          .send(fixtures.super_user.login)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            superAdminToken = res.body.token;
            var key = process.env.SECRET_KEY;
            jwt.verify(superAdminToken, key, function (err, user) {
              if (err) done(err);
              userID = user._id;
              done();
            });
          });

      });

      fixtures.documents.forEach((doc) => {
        for (var prop in doc) {
          it('should create a new document', (done) => {
            api
              .post('/DMS/api/documents')
              .set('x-access-token', superAdminToken)
              .set('Accept', 'application/x-www-form-urlencoded')
              .send(doc[prop])
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                if (err) done(err);
                docID = res.body.doc._id;
                done();
              });
          });

          it('should create a new document', (done) => {
            api
              .post('/DMS/api/documents')
              .set('x-access-token', superAdminToken)
              .set('Accept', 'application/x-www-form-urlencoded')
              .send(doc[prop])
              .expect('Content-Type', /json/)
              .expect(400, done);
          });

          it('should update a specific document', (done) => {
            api
              .put('/DMS/api/documents/' + docID)
              .set('x-access-token', superAdminToken)
              .set('Accept', 'application/x-www-form-urlencoded')
              .send(fixtures.docsUpdate[i++][prop])
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                if (err) done(err);
                var response = res.body;
                expect(response.success).to.be.ok();
                done();
              });
          });

          it('should throw an error for duplicate fields', (done) => {
            i--;
            api
              .put('/DMS/api/documents/' + docID)
              .set('x-access-token', superAdminToken)
              .set('Accept', 'application/x-www-form-urlencoded')
              .send(fixtures.docsUpdate[i++][prop])
              .expect('Content-Type', /json/)
              .expect(400)
              .end((err, res) => {
                if (err) done(err);
                var response = res.body;
                expect(response.success).not.to.be.ok();
                done();
              });

          });

          it('should not create document if user not authenticated', (done) => {
            api
              .post('/DMS/api/documents')
              .set('Accept', 'application/x-www-form-urlencoded')
              .send(doc[prop])
              .expect('Content-Type', /json/)
              .expect(403, done);
          });

          it('should throw an error user is not found.', (done) => {
            doc[prop].username = 'no_user';
            api
              .post('/DMS/api/documents')
              .set('Accept', 'application/x-www-form-urlencoded')
              .set('x-access-token', superAdminToken)
              .send(doc[prop])
              .expect('Content-Type', /json/)
              .expect(400, done);
          });

          it('should throw an error if roles specified not found', (done) => {
            doc[prop].username = 'Lawrenzo';
            doc[prop].roles = 'role1,role2,role3';
            api
              .post('/DMS/api/documents')
              .set('Accept', 'application/x-www-form-urlencoded')
              .set('x-access-token', superAdminToken)
              .send(doc[prop])
              .expect('Content-Type', /json/)
              .expect(400, done);
          });

          it('should validate document details before persisting', (done) => {
            doc[prop].title = '';
            doc[prop].content = '';
            api
              .post('/DMS/api/documents')
              .set('x-access-token', superAdminToken)
              .set('Accept', 'application/x-www-form-urlencoded')
              .send(doc[prop])
              .expect('Content-Type', /json/)
              .expect(400, done);
          });

          it('should validate docID for doc-specific opeartions', (done) => {
            api
              .get('/DMS/api/documents/' + docID.slice(3))
              .set('x-access-token', superAdminToken)
              .expect('Content-Type', /json/)
              .expect(400)
              .end((err) => {
                if (err) done(err);
                api
                  .put('/DMS/api/documents/' + docID.slice(2))
                  .set('x-access-token', superAdminToken)
                  .expect('Content-Type', /json/)
                  .expect(400)
                  .end((err) => {
                    if (err) done(err);
                    api
                      .delete('/DMS/api/documents/' + docID.slice(1))
                      .set('x-access-token', superAdminToken)
                      .expect('Content-Type', /json/)
                      .expect(400, done);
                  });
              });
          });

          it('should retrive a specific document', (done) => {
            api
              .get('/DMS/api/documents/' + docID)
              .set('x-access-token', superAdminToken)
              .expect('Content-Type', /json/)
              .expect(200, done);
          });
        }
      });

      it('should retrive all documents in storage', (done) => {
        api
          .get('/DMS/api/documents')
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            var response = res.body;
            if (err) done(err);
            expect(response).to.be.an('object');
            expect(response).to.only.have.keys(['success', 'docs']);
            expect(response.success).to.be.ok();
            expect(response.docs).to.be.an('object');
            expect(response.docs.docs.length).to.be(3);
            done();
          });
      });

      it('should reterive all documents creates by a user', (done) => {
        api
          .get('/DMS/api/users/' + userID + '/documents')
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) done(err);
            var response = res.body;
            expect(response.success).to.be.ok();
            done();
          });
      });

      var msg = 'should apply pagination to reterived' +
        'documents created by a user';
      it(msg, (done) => {
        api
          .get('/DMS/api/users/' + userID + '/documents')
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) done(err);
            var response = res.body;
            expect(response.success).to.be.ok();
            var keys = ['docs', 'total', 'pages', 'page', 'limit'];
            expect(response.docs).to.only.have.keys(keys);
            expect(response.docs.total).to.be(3);
            expect(response.docs.limit).to.be(20);
            expect(response.docs.pages).to.be(1);
            expect(response.docs.page).to.be(1);
            done();
          });
      });

      var msg2 = 'GET: should apply pagination to retrieved' +
        ' documents with defualt limit of 20 per page.';
      it(msg2, (done) => {
        api
          .get('/DMS/api/documents')
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            var response = res.body;
            if (err) done(err);
            var keys = ['docs', 'total', 'pages', 'page', 'limit'];
            expect(response.docs).to.only.have.keys(keys);
            expect(response.docs.total).to.be(3);
            expect(response.docs.limit).to.be(20);
            expect(response.docs.pages).to.be(1);
            expect(response.docs.page).to.be(1);
            done();
          });
      });

      it('should use pagination params if supplied', (done) => {
        api
          .get('/DMS/api/documents/?limit=2&page=1')
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            var response = res.body;
            if (err) done(err);
            var keys = ['docs', 'total', 'pages', 'page', 'limit'];
            expect(response.docs).to.only.have.keys(keys);
            expect(response.docs.total).to.be(3);
            expect(response.docs.limit).to.be(2);
            expect(response.docs.pages).to.be(2);
            expect(response.docs.page).to.be(1);
            done();
          });
      });

      it('should throw an error if pagination params is invalid', (done) => {
        api
          .get('/DMS/api/documents/?limit=fjbfjhf&page=mmdjdj')
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(400)
          .end((err, res) => {
            var response = res.body;
            if (err) done(err);
            expect(response.success).not.to.be.ok();
            expect(response.message).to.be('Params Validation Failed!');
            done();
          });
      });

      it('should remove specified document from storage', (done) => {
        delete fixtures.documents[2].doc3.title;
        delete fixtures.documents[2].doc3.content;
        delete fixtures.documents[2].doc3.roles;
        api
          .delete('/DMS/api/documents/' + docID)
          .set('x-access-token', superAdminToken)
          .set('Accept', 'application/x-www-form-urlencoded')
          .send(fixtures.documents[2].doc3)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            var response = res.body;
            expect(response.success).to.be.ok();
            done();
          });
      });
    });
  });
};

module.exports = documentResource;
