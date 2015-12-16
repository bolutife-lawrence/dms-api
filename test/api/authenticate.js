var authenticate = (api, expect, fixtures) => {
  // Validate that an already existing user is authenticated and given a token
  // when the right credentials are supplied.
  describe('Authenticate', () => {
    var msg = 'should authenticate a user with correct' +
      ' credentials and return a token.';
    it(msg, (done) => {
      api
        .post('/DMS/api/auth/authenticate')
        .set('Accept', 'application/x-www-form-urlencoded')
        .send(fixtures.super_user.login)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          var errors = res.body.errors,
          success_msg = 'Authentication successful. Enjoy your token!';
          console.log(res.body.errors? errors : 'Params validation Passed!');
          expect(res.body).to.be.an('object');
          expect(res.body).to.only.have.keys(['success', 'message', 'token']);
          expect(res.body.success).to.be.ok();
          expect(res.body.message).to.be(success_msg);
          expect(res.body.token).to.be.ok();
          done();
        });
    });

    var msg2 = 'Should reject invalid login credentials - username';
    it(msg2, (done) => {
      api
        .post('/DMS/api/auth/authenticate')
        .set('Accept', 'application/x-www-form-urlencoded')
        .send(fixtures.super_user.invalidlogin)
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    var msg3 = 'Should reject invalid login credentials - password';
    it(msg3, (done) => {
      api
        .post('/DMS/api/auth/authenticate')
        .set('Accept', 'application/x-www-form-urlencoded')
        .send(fixtures.super_user.invalidlogin2)
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    var msg4 = 'Should validate auth credentials provided before processing.';
    it(msg4, (done) => {
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
