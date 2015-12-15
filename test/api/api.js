var api = (api, expect, fixtures, models, helpers) => {
  describe('DMS API', () => {

    before((done) => {
      // Seed database with test data(users, roles and documents).
      var currentRole = {},
        roles = fixtures.roles,
        args = [];

      try {
        roles.forEach((role, index) => {
          for (var prop in role) {
            currentRole = new models.Role(role[prop]);
            currentRole.save().then((role) => {
              if (roles.length - 1 === index) {
                console.log('Roles Seeded!');
                args = [
                  fixtures.super_user.create.username,
                  fixtures.super_user.create.lastname,
                  fixtures.super_user.create.firstname,
                  fixtures.super_user.create.role,
                  fixtures.super_user.create.email,
                  fixtures.super_user.create.password
                ];
                helpers.createUser(...args, (err, user) => {
                  if (err) done(err);
                  console.log('Super user seeded');
                  done();
                });
              }
            });
          }
        });
      } catch (e) {
        console.log(e);
      }
    });

    it('should return a 200 status code.', (done) => {
      api
        .get('/DMS/api')
        .expect(200, done);
    });

    it('should respond with a JSON object with the right content.', (done) => {
      api
        .get('/DMS/api')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be('Welcome to the DMS API');
          done();
        });
    });
  });
};

module.exports = api;
