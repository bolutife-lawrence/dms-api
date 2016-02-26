var api = (api, expect, fixtures, models) => {
  describe('DMS API', () => {
    before((done) => {
      // Seed database with test data(users, roles and documents).
      var currentRole = {},
        roles = fixtures.roles;
      roles.forEach((role, index) => {
        for (var prop in role) {
          if (role.hasOwnProperty(prop)) {
            currentRole = new models.Role(role[prop]);
            currentRole.save((err) => {
              if (err) {
                console.log(err);
              }
              if (index === roles.length - 1) {
                console.log('Roles seeded');
                done();
              }
            });
          }
        }
      });
    });

    it('should return a 200 status code.', (done) => {
      api
        .get('/api/v0.1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(err).to.be(null);
          expect(res.body).to.only.have.keys(['message', 'version']);
          expect(res.body.message).to.be('Welcome to the DMS API');
          done();
        });
    });
  });
};

module.exports = api;
