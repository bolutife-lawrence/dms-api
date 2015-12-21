var roleResource = (api, expect, fixtures) => {
  describe('DMS API Role Resource', () => {
    describe('CRUD Operations', () => {
      var superAdminToken = '',
        roleId = '',
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
            done();
          });
      });

      fixtures.addRoles.forEach((role) => {
        for (var prop in role) {
          it('should create a new role', (done) => {
            api
              .post('/DMS/api/roles')
              .set('Accept', 'application/x-www-form-urlencoded')
              .set('x-access-token', superAdminToken)
              .send(role[prop])
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                if (err) done(err);
                var response = res.body,
                  keys1 = ['_id', 'title', '__v', 'createdAt', 'updatedAt'],
                  keys2 = ['success', 'role', 'message'];
                expect(response.success).to.be.ok();
                expect(response).to.only.have.keys(keys2);
                expect(response.role).to.only.have.keys(keys1);
                expect(response.message).to.be('Role successfully created!');
                roleId = response.role._id;
                done();
              });
          });

          it('should update specified role', (done) => {
            api
              .put('/DMS/api/roles/' + roleId)
              .set('Accept', 'application/x-www-form-urlencoded')
              .set('x-access-token', superAdminToken)
              .send(fixtures.updateRoles[i++][prop])
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                if (err) done(err);
                var response = res.body;
                expect(response.success).to.be.ok();
                expect(response.message).to.be('Role successfully updated!');
                done();
              });
          });

          it('should retrieve specified role', (done) => {
            api
              .get('/DMS/api/roles/' + roleId)
              .set('x-access-token', superAdminToken)
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                if (err) done(err);
                var response = res.body,
                  keys = ['_id', '__v', 'title', 'createdAt', 'updatedAt'];
                expect(response.role).to.only.have.keys(keys);
                done();
              });
          });

          it('should delete specified role', (done) => {
            api
              .delete('/DMS/api/roles/' + roleId)
              .set('x-access-token', superAdminToken)
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                if (err) done(err);
                var response = res.body;
                expect(response.success).to.be.ok();
                expect(response.message).to.be('Role successfully deleted!');
                done();
              });
          });
        }
      });

      it('should retrieve all roles from storage', (done) => {
        api
          .get('/DMS/api/roles/')
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) done(err);
            var response = res.body,
              keys = ['success', 'roles'];
            expect(response.success).to.be.ok();
            expect(response).to.only.have.keys(keys);
            done();
          });
      });

      it('should apply pagination to retrieved roles', (done) => {
        api
          .get('/DMS/api/roles/')
          .set('x-access-token', superAdminToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) done(err);
            var response = res.body,
              keys = ['docs', 'total', 'limit', 'page', 'pages'];
            expect(response.roles).to.only.have.keys(keys);
            expect(response.roles.docs).to.be.an('array');
            expect(response.roles.total).to.be(4);
            expect(response.roles.limit).to.be(20);
            expect(response.roles.page).to.be(1);
            expect(response.roles.pages).to.be(1);
            done();
          });
      });
    });
  });
};

module.exports = roleResource;
