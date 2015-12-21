var userResource = (api, expect, fixtures) => {
  describe('DMS API User Resource', () => {
    describe('CRUD operations', () => {
      var userId = {},
        userToken = '',
        superAdminToken = '';

      before((done) => {
        // Get Super Admin
        api
          .post('/DMS/api/auth/authenticate')
          .set('Accept', 'application/x-www-form-urlencoded')
          .set('Accept', 'application/json')
          .send(fixtures.super_user.login)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            superAdminToken = res.body.token;
            done();
          });
      });

      fixtures.users.forEach((user) => {
        for (var prop in user) {
          it('POST: should create a new user', (done) => {
            api
              .post('/DMS/api/users')
              .set('Accept', 'application/x-www-form-urlencoded')
              .send(user[prop])
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                if (err) return done(err);
                var errors = res.body.errors;
                var result = res.body.errors ?
                  errors : 'Params validation Passed!';
                console.log(result);
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
                expect(res.body.user._id).to.match(/^[0-9a-fA-F]{24}$/);
                userId = res.body.user._id;
                done();
              });
          });
        }
      });

      var msg = 'POST: should throw an error if the user to be created exists.';
      it(msg, (done) => {
        api
          .post('/DMS/api/users')
          .set('Accept', 'application/x-www-form-urlencoded')
          .send(fixtures.users[1].guest_user)
          .expect('Content-Type', /json/)
          .expect(400)
          .end((err, res) => {
            if (err) return done(err);
            var response = res.body;
            expect(response.success).not.to.be.ok();
            expect(response.message).to.be('User Already exists!');
            done();
          });
      });

      var msg2 = 'POST: should throw an error' +
        ' if role specified does not exist.';
      it(msg2, (done) => {
        fixtures.users[1].guest_user.role = 'storekeeper';
        api
          .post('/DMS/api/users')
          .set('Accept', 'application/x-www-form-urlencoded')
          .send(fixtures.users[1].guest_user)
          .expect('Content-Type', /json/)
          .expect(400)
          .end((err, res) => {
            if (err) return done(err);
            var response = res.body;
            expect(response.success).not.to.be.ok();
            expect(response.message).to.be('storekeeper role does not exist!');
            done();
          });
      });

      it('POST: should validate user details before creation.', (done) => {
        api
          .post('/DMS/api/users')
          .set('Accept', 'application/x-www-form-urlencoded')
          .send(fixtures.guest_user.invalid_user_data)
          .expect('Content-Type', /json/)
          .expect(400, done);
      });

      it('POST: should authenticate a user', (done) => {
        api
          .post('/DMS/api/auth/authenticate')
          .set('Accept', 'application/x-www-form-urlencoded')
          .send(fixtures.guest_user.login)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            var result = res.body.errors ?
              res.body.errors : 'Params validation Passed!';
            console.log(result);
            expect(res.body).to.have.property('success');
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('token');
            expect(res.body.success).to.be.ok();
            var msg = 'Authentication successful. Enjoy your token!';
            expect(res.body.message).to.be(msg);
            expect(res.body.token).to.be.ok();
            userToken = res.body.token;
            done();
          });
      });

      it('PUT: should validate userId before updating a user', (done) => {
        api
          .put('/DMS/api/users/' + userId.slice(-4))
          .set('x-access-token', userToken)
          .expect(400, done);
      });

      it('PUT: should validate user details before updating a user', (done) => {
        api
          .put('/DMS/api/users/' + userId)
          .set('Accept', 'application/x-www-form-urlencoded')
          .set('x-access-token', userToken)
          .send(fixtures.guest_user.invalid_user_data)
          .expect('Content-Type', /json/)
          .expect(400, done);
      });

      it('PUT: should update a specific user', (done) => {
        api
          .put('/DMS/api/users/' + userId)
          .set('Accept', 'application/x-www-form-urlencoded')
          .set('x-access-token', userToken)
          .send(fixtures.guest_user.update)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            var result = res.body.errors ?
              res.body.errors : 'Params validation Passed!';
            console.log(result);
            expect(res.body).to.be.an('object');
            expect(res.body).to.only.have.keys(['success', 'message']);
            expect(res.body.success).to.be.ok();
            expect(res.body.message).to.be('User successfully updated!');
            done();
          });
      });

      it('GET: should retrive a user with a specific ID', (done) => {
        api
          .get('/DMS/api/users/' + userId)
          .set('Accept', 'application/json')
          .set('x-access-token', userToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            var result = res.body.errors ?
              res.body.errors : 'Params validation Passed!';
            console.log(result);
            expect(res.body).to.only.have.keys(['success', 'user']);
            expect(res.body.success).to.be.ok();
            var keys = ['_id', 'username', 'email', 'role', 'name'];
            expect(res.body.user).to.only.have.keys(keys);
            done();
          });
      });

      var msg3 = 'GET: should return 404 if userId is invalid or not provided.';
      it(msg3, (done) => {
        api
          .get('/DMS/api/users/' + userId.slice(-4))
          .set('Accept', 'application/json')
          .set('x-access-token', userToken)
          .expect('Content-Type', /json/)
          .expect(400, done);
      });

      var msg4 = 'GET: authorized users should be able to retrieve all users';
      it(msg4, (done) => {
        api
          .get('/DMS/api/users/')
          .set('Accept', 'application/json')
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.success).to.be.ok();
            done();
          });
      });

      var msg5 = 'GET: should apply pagination to retrieved' +
        ' users with defualt limit of 20 per page.';
      it(msg5, (done) => {
        api
          .get('/DMS/api/users/')
          .set('Accept', 'application/json')
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            var response = res.body;
            if (err) return done(err);
            expect(response.success).to.be.ok();
            expect(response.users.total).to.be(3);
            expect(response.users.limit).to.be(20);
            expect(response.users.page).to.be(1);
            expect(response.users.pages).to.be(1);
            done();
          });
      });

      it('GET: should use pagination params if supplied', (done) => {
        api
          .get('/DMS/api/users/?limit=5&page=1')
          .set('Accept', 'application/json')
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            var response = res.body;
            if (err) return done(err);
            expect(response.success).to.be.ok();
            expect(response.users.total).to.be(3);
            expect(response.users.limit).to.be(5);
            expect(response.users.page).to.be(1);
            expect(response.users.pages).to.be(1);
            done();
          });
      });

      it('GET: should validate pagination params if supplied', (done) => {
        api
          .get('/DMS/api/users/?limit=String&page=string')
          .set('Accept', 'application/json')
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(400, done);
      });

      it('DELETE: should validate userId before deleting a user', (done) => {
        api
        // userId for a general or admin user. Deleted by a superadmin user.
          .delete('/DMS/api/users/' + userId.slice(-4))
          .set('Accept', 'application/json')
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(400, done);
      });

      /**
       * An existing user can only be deleted by a
       * superior/authorized user such as the superadmin or admin.
       * Instance : A general user can be deleted by an admin user.
       * 						An admin user can be deleted by a
       * 						superadmin user.
       * 						A superadmin can be deleted by noone.
       */
      var msg6 = 'DELETE: An existing user can be' +
        ' deleted by an authenticated and' +
        ' authorized(superadmin or admin) user.';
      it(msg6, (done) => {
        api
        // userId for a general or admin user. Deleted by a superadmin user.
          .delete('/DMS/api/users/' + userId)
          .set('Accept', 'application/json')
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            var result = res.body.errors ?
              res.body.errors : 'Params validation Passed!';
            console.log(result);
            expect(res.body).to.have.property('success');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.be('User deleted successfully!');
            expect(res.body.success).to.be.ok();
            done();
          });
      });
    });
  });
};
module.exports = userResource;
