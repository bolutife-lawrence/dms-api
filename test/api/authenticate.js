var authenticate = (api, expect, fixtures) => {
  // Validate that an already existing user is authenticated and given a token
  // when the right credentials are supplied.
  describe('Authenticate', () => {
    console.log(fixtures.super_user.login);
    it('An existing user should be able to login with the right credentials and get a token in return.', (done) => {
      api
        .post('/DMS/api/auth/authenticate')
        .set('Accept', 'application/x-www-form-urlencoded')
        .send(fixtures.super_user.login)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          console.log(res.body.errors ? res.body.errors : 'Params validation Passed!');
          expect(res.body).to.be.an('object');
          expect(res.body).to.only.have.keys(['success', 'message', 'token']);
          expect(res.body.success).to.be.ok();
          expect(res.body.message).to.be('Authentication successful. Enjoy your token!');
          expect(res.body.token).to.be.ok();
          done();
        });
    });

    it('Should reject unregistered users : If username does not match existing user.', (done) => {
      api
        .post('/DMS/api/auth/authenticate')
        .set('Accept', 'application/x-www-form-urlencoded')
        .send(fixtures.super_user.invalidlogin)
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it("Should reject unregistered users : If password does not match existing users's password.", (done) => {
      api
        .post('/DMS/api/auth/authenticate')
        .set('Accept', 'application/x-www-form-urlencoded')
        .send(fixtures.super_user.invalidlogin2)
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it('Should validate that username and password is provided before processing.', (done) => {
      api
        .post('/DMS/api/auth/authenticate')
        .set('Accept', 'application/x-www-form-urlencoded')
        .send(fixtures.super_user.invalidlogin3)
        .expect('Content-Type', /json/)
        .expect(400, done);
    });
  });
};

module.exports = authenticate;
