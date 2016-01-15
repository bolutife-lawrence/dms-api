var userResource = (api, expect, fixtures) => {
  describe('DMS API User Resource', () => {
    describe('CRUD operations', () => {
      var userId = '',
        userToken = '',
        superAdminToken = '';

      before((done) => {
        api
          .post('/api/v0.1/auth/authenticate')
          .set('Accept', 'application/x-www-form-urlencoded')
          .send(fixtures.super_user.login)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be(null);
            superAdminToken = res.body.token;
            fixtures.users.forEach((user, index) => {
              for (var prop in user) {
                if (user.hasOwnProperty(prop)) {
                  api
                    .post('/api/v0.1/users')
                    .set('Accept', 'application/x-www-form-urlencoded')
                    .send(user[prop])
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err) => {
                      expect(err).to.be(null);
                      if (index === fixtures.users.length - 1) {
                        done();
                      }
                    });
                }
              }
            });
          });
      });

      it('POST: should create a new user', (done) => {
        api
          .post('/api/v0.1/users')
          .set('Accept', 'application/x-www-form-urlencoded')
          .send(fixtures.gen_user.create)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body).to.be.an('object');
            expect(res.body.user).to.be.an('object');
            var keys = ['success', 'message', 'user'];
            expect(res.body).to.only.have.keys(keys);
            expect(res.body.user).to.only.have.keys([
              '__v', '_id', 'username', 'name', 'email',
              'role', 'hashedPass', 'saltPass', 'createdAt', 'updatedAt'
            ]);
            expect(res.body.user.name).to.only.have.keys(['first', 'last']);
            expect(res.body.success).to.be.ok();
            expect(res.body.message).to.be('User successfully created!');
            expect(res.body.user._id).to.be.ok();
            expect(res.body.user._id).to.match(/^[0-9a-f]{24}$/i);
            userId = res.body.user._id;
            api
              .post('/api/v0.1/auth/authenticate')
              .set('Accept', 'application/x-www-form-urlencoded')
              .send(fixtures.gen_user.login)
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                expect(err).to.be(null);
                userToken = res.body.token;
                done();
              });
          });
      });

      var msg = 'A superadmin user can only be created if an Authorization' +
        'code is provided';
      it(msg, (done) => {
        fixtures.super_user.create2.auth_code = process.env.AUTH_CODE;
        api
          .post('/api/v0.1/users')
          .set('Accept', 'application/x-www-form-urlencoded')
          .send(fixtures.super_user.create2)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body).to.be.an('object');
            expect(res.body.user).to.be.an('object');
            var keys = ['success', 'message', 'user'];
            expect(res.body).to.only.have.keys(keys);
            expect(res.body.user).to.only.have.keys([
              '__v', '_id', 'username', 'name', 'email',
              'role', 'hashedPass', 'saltPass', 'createdAt', 'updatedAt'
            ]);
            expect(res.body.user.name).to.only.have.keys(['first', 'last']);
            expect(res.body.success).to.be.ok();
            expect(res.body.message).to.be('User successfully created!');
            expect(res.body.user._id).to.be.ok();
            expect(res.body.user._id).to.match(/^[0-9a-f]{24}$/i);
            done();
          });
      });

      it('An admin can only be created a superadmin', (done) => {
        api
          .post('/api/v0.1/users')
          .set('Accept', 'application/x-www-form-urlencoded')
          .set('x-access-token', superAdminToken)
          .send(fixtures.admin_user)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body).to.be.an('object');
            expect(res.body.user).to.be.an('object');
            var keys = ['success', 'message', 'user'];
            expect(res.body).to.only.have.keys(keys);
            expect(res.body.user).to.only.have.keys([
              '__v', '_id', 'username', 'name', 'email',
              'role', 'hashedPass', 'saltPass', 'createdAt', 'updatedAt'
            ]);
            expect(res.body.user.name).to.only.have.keys(['first', 'last']);
            expect(res.body.success).to.be.ok();
            expect(res.body.message).to.be('User successfully created!');
            expect(res.body.user._id).to.be.ok();
            expect(res.body.user._id).to.match(/^[0-9a-f]{24}$/i);
            done();
          });
      });

      var msg2 = 'should throw an error if an unauthorized' +
        ' user tries to create an admin user';
      it(msg2, (done) => {
        delete fixtures.super_user.create2.auth_code;
        api
          .post('/api/v0.1/users')
          .set('Accept', 'application/x-www-form-urlencoded')
          .set('x-access-token', userToken)
          .send(fixtures.super_user.create2)
          .expect('Content-Type', /json/)
          .expect(403)
          .end((err, res) => {
            var msg = 'Access Denied! You cannot perform this operation';
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be(msg);
            done();
          });
      });

      var msg3 = 'POST: should throw an error if the user to be created exists';
      it(msg3, (done) => {
        api
          .post('/api/v0.1/users')
          .set('Accept', 'application/x-www-form-urlencoded')
          .send(fixtures.gen_user.create)
          .expect('Content-Type', /json/)
          .expect(409)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be('User exists already');
            done();
          });
      });

      var msg4 = 'POST: should throw an error' +
        ' if role specified does not exist.';
      it(msg4, (done) => {
        fixtures.gen_user.create.role = 'storekeeper';
        api
          .post('/api/v0.1/users')
          .set('Accept', 'application/x-www-form-urlencoded')
          .send(fixtures.gen_user.create)
          .expect('Content-Type', /json/)
          .expect(404)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be('Role specified not found');
            done();
          });
      });

      it('POST: should validate user details before creation.', (done) => {
        api
          .post('/api/v0.1/users')
          .set('Accept', 'application/x-www-form-urlencoded')
          .send(fixtures.gen_user.invalid_user_data)
          .expect('Content-Type', /json/)
          .expect(400)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be('Params Validation Failed!');
            done();
          });
      });

      it('PUT: should validate user details before updating a user', (done) => {
        api
          .put('/api/v0.1/users/' + userId)
          .set('Accept', 'application/x-www-form-urlencoded')
          .set('x-access-token', userToken)
          .send(fixtures.gen_user.invalid_user_data)
          .expect('Content-Type', /json/)
          .expect(400)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be('Params Validation Failed!');
            done();
          });
      });

      it('PUT: should update a specific user', (done) => {
        api
          .put('/api/v0.1/users/' + userId)
          .set('Accept', 'application/x-www-form-urlencoded')
          .set('x-access-token', userToken)
          .send(fixtures.gen_user.update)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body).to.be.an('object');
            expect(res.body).to.only.have.keys(['success', 'message']);
            expect(res.body.success).to.be.ok();
            expect(res.body.message).to.be('User successfully updated!');
            done();
          });
      });

      it('PUT: should restrict a user from updating another user', (done) => {
        api
          .put('/api/v0.1/users/' + userId)
          .set('Accept', 'application/x-www-form-urlencoded')
          .set('x-access-token', superAdminToken)
          .send(fixtures.gen_user.update)
          .expect('Content-Type', /json/)
          .expect(403)
          .end((err, res) => {
            var message = 'Access Denied! You cannot perform this operation';
            expect(err).to.be(null);
            expect(res.body).to.be.an('object');
            expect(res.body).to.only.have.keys(['success', 'message']);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be(message);
            done();
          });
      });

      it('PUT: should throw an error if user exists', (done) => {
        api
          .put('/api/v0.1/users/' + userId)
          .set('Accept', 'application/x-www-form-urlencoded')
          .set('x-access-token', userToken)
          .send(fixtures.users[0].guest_user)
          .expect('Content-Type', /json/)
          .expect(409)
          .end((err, res) => {
            var msg = 'User exists already! choose a different' +
              ' email/username';
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be(msg);
            done();
          });
      });

      it('PUT: should throw an error if role specified not found', (done) => {
        fixtures.gen_user.update.role = 'driver';
        api
          .put('/api/v0.1/users/' + userId)
          .set('Accept', 'application/x-www-form-urlencoded')
          .set('x-access-token', userToken)
          .send(fixtures.gen_user.update)
          .expect('Content-Type', /json/)
          .expect(404)
          .end((err, res) => {
            var msg = 'Specified role not found';
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be(msg);
            done();
          });
      });

      it('GET: should retrive a user with a specific ID', (done) => {
        api
          .get('/api/v0.1/users/' + userId)
          .set('Accept', 'application/x-www-form-urlencoded')
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body).to.only.have.keys(['success', 'user']);
            expect(res.body.success).to.be.ok();
            var keys = ['_id', 'username', 'email', 'role', 'name'];
            expect(res.body.user).to.only.have.keys(keys);
            done();
          });
      });

      it('PUT: should validate userId before updating a user', (done) => {
        api
          .put('/api/v0.1/users/' + userId.slice(-4))
          .set('Accept', 'application/x-www-form-urlencoded')
          .set('x-access-token', userToken)
          .expect(400)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be('Params Validation Failed!');
            done();
          });
      });

      var msg5 = 'GET: authorized users should be able to retrieve all users';
      it(msg5, (done) => {
        api
          .get('/api/v0.1/users/')
          .set('Accept', 'application/json')
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).to.be.ok();
            done();
          });
      });

      var msg6 = 'GET: should apply pagination to retrieved' +
        ' users with defualt limit of 20 per page.';
      it(msg6, (done) => {
        api
          .get('/api/v0.1/users/')
          .set('Accept', 'application/json')
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            var response = res.body;
            expect(err).to.be(null);
            expect(response.success).to.be.ok();
            expect(response.users.total).to.be(7);
            expect(response.users.limit).to.be(20);
            expect(response.users.page).to.be(1);
            expect(response.users.pages).to.be(1);
            done();
          });
      });

      it('GET: should use pagination params if supplied', (done) => {
        api
          .get('/api/v0.1/users/?limit=5&page=1')
          .set('Accept', 'application/json')
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            var response = res.body;
            expect(err).to.be(null);
            expect(response.success).to.be.ok();
            expect(response.users.total).to.be(7);
            expect(response.users.limit).to.be(5);
            expect(response.users.page).to.be(1);
            expect(response.users.pages).to.be(2);
            done();
          });
      });

      it('GET: should validate pagination params if supplied', (done) => {
        api
          .get('/api/v0.1/users/?limit=String&page=string')
          .set('Accept', 'application/json')
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(400)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be('Params Validation Failed!');
            done();
          });
      });

      it('DELETE: should validate userId before deleting a user', (done) => {
        api
          .delete('/api/v0.1/users/' + userId.slice(-4))
          .set('Accept', 'application/json')
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(400)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be('Params Validation Failed!');
            done();
          });
      });

      var msg7 = 'DELETE: An existing user can be' +
        ' deleted by a superuser.';
      it(msg7, (done) => {
        api
          .delete('/api/v0.1/users/' + userId)
          .set('Accept', 'application/json')
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body).to.have.property('success');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.be('User deleted successfully!');
            expect(res.body.success).to.be.ok();
            done();
          });
      });

      it('GET: should return a 404 error if user is not found', (done) => {
        api
          .get('/api/v0.1/users/' + userId)
          .set('Accept', 'application/x-www-form-urlencoded')
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(404)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be('User not found');
            done();
          });
      });
    });
  });
};

module.exports = userResource;
