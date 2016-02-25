var roleResource = (api, expect, fixtures, invalidId) => {
  describe('DMS API Role Resource', () => {
    describe('CRUD Operations', () => {
      var superAdminToken = '',
        moderatorToken = '',
        roleId = '';

      before((done) => {
        api
          .post('/api/v0.1/auth/authenticate')
          .set('Accept', 'application/json')
          .send(fixtures.super_user.login)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            superAdminToken = res.body.token;
            api
              .post('/api/v0.1/auth/authenticate')
              .set('Accept', 'application/json')
              .send(fixtures.moderator_login)
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                moderatorToken = res.body.token;
                done();
              });
          });
      });

      it('should create a new role', (done) => {
        api
          .post('/api/v0.1/roles')
          .set('Accept', 'application/x-www-form-urlencoded')
          .set('x-access-token', superAdminToken)
          .send(fixtures.role.create)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).to.be.ok();
            expect(res.body.message).to.be('Role successfully created!');
            roleId = res.body.role._id;
            done();
          });
      });

      it('should throw an error if roles exists', (done) => {
        api
          .post('/api/v0.1/roles')
          .set('Accept', 'application/x-www-form-urlencoded')
          .set('x-access-token', superAdminToken)
          .send(fixtures.role.create)
          .expect('Content-Type', /json/)
          .expect(409)
          .end((err, res) => {
            var role = fixtures.role.create.title;
            var message = `${role} role has already been created.`;
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be(message);
            done();
          });
      });

      it('PUT: should restrict access to superadmin', (done) => {
        api
          .post('/api/v0.1/roles/')
          .set('Accept', 'application/x-www-form-urlencoded')
          .set('x-access-token', moderatorToken)
          .send(fixtures.role.create)
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

      it('should update specified role', (done) => {
        api
          .put('/api/v0.1/roles/' + roleId)
          .set('Accept', 'application/x-www-form-urlencoded')
          .set('x-access-token', superAdminToken)
          .send(fixtures.role.update)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).to.be.ok();
            expect(res.body.message).to.be('Role successfully updated!');
            done();
          });
      });

      it('PUT: should throw an error if role exists', (done) => {
        fixtures.role.update.title = 'moderator';
        api
          .put('/api/v0.1/roles/' + roleId)
          .set('Accept', 'application/x-www-form-urlencoded')
          .set('x-access-token', superAdminToken)
          .send(fixtures.role.update)
          .expect('Content-Type', /json/)
          .expect(409)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be('Role title exists already');
            done();
          });
      });

      it('PUT: should restrict access to superadmin', (done) => {
        api
          .put('/api/v0.1/roles/' + roleId)
          .set('Accept', 'application/x-www-form-urlencoded')
          .set('x-access-token', moderatorToken)
          .send(fixtures.role.update)
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

      it('should retrieve specified role', (done) => {
        api
          .get('/api/v0.1/roles/' + roleId)
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).to.be.ok();
            done();
          });
      });

      it('should throw a 404 error if role is not found', (done) => {
        api
          .get('/api/v0.1/roles/' + invalidId)
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(404)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be('Role not found');
            done();
          });
      });

      it('should should validate roleId', (done) => {
        api
          .get('/api/v0.1/roles/' + roleId.slice(20))
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(400)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be('Params Validation Failed!');
            api
              .put('/api/v0.1/roles/' + roleId.slice(18))
              .set('x-access-token', superAdminToken)
              .expect('Content-Type', /json/)
              .expect(400)
              .end((err, res) => {
                expect(err).to.be(null);
                expect(res.body.success).not.to.be.ok();
                expect(res.body.message).to.be('Params Validation Failed!');
                api
                  .delete('/api/v0.1/roles/' + roleId.slice(10))
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
          });
      });

      it('should delete specified role', (done) => {
        api
          .delete('/api/v0.1/roles/' + roleId)
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).to.be.ok();
            expect(res.body.message).to.be('Role successfully deleted!');
            done();
          });
      });

      it('should restrict access to superadmin', (done) => {
        api
          .delete('/api/v0.1/roles/' + roleId)
          .set('x-access-token', moderatorToken)
          .expect('Content-Type', /json/)
          .expect(403)
          .end((err, res) => {
            expect(err).to.be(null);
            var message = 'Access Denied! You cannot perform this operation';
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be(message);
            done();
          });
      });

      it('DELETE: should throw a 404 error if role is not found', (done) => {
        api
          .delete('/api/v0.1/roles/' + invalidId)
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(404)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).not.to.be.ok();
            expect(res.body.message).to.be('Role not found');
            done();
          });
      });

      it('should retrieve all roles from storage', (done) => {
        api
          .get('/api/v0.1/roles/')
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.success).to.be.ok();
            done();
          });
      });

      it('should apply pagination to retrieved roles', (done) => {
        api
          .get('/api/v0.1/roles/')
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.body.roles.docs).to.be.an('array');
            expect(res.body.roles.total).to.be(7);
            expect(res.body.roles.limit).to.be(20);
            expect(res.body.roles.page).to.be(1);
            expect(res.body.roles.pages).to.be(1);
            done();
          });
      });
    });
  });
};
module.exports = roleResource;
