var authenticate = (api, expect, fixtures) => {
  // Validate that an already existing user is authenticated and given a token
  // when the right credentials are supplied.
  describe('Authenticate', () => {

    before((done) => {
      fixtures.super_user.create.auth_code = process.env.AUTH_CODE;
      api
        .post('/api/v0.1/users')
        .set('Accept', 'application/x-www-form-urlencoded')
        .send(fixtures.super_user.create)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(err).to.be(null);
          expect(res.body.success).to.be.ok();
          done();
        });
    });

    var msg = 'should authenticate a user with correct' +
      ' credentials and return a token.';
    it(msg, (done) => {
      api
        .post('/api/v0.1/auth/authenticate')
        .set('Accept', 'application/x-www-form-urlencoded')
        .send(fixtures.super_user.login)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          var success_msg = 'Authentication successful. Enjoy your token!';
          expect(err).to.be(null);
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
        .post('/api/v0.1/auth/authenticate')
        .set('Accept', 'application/x-www-form-urlencoded')
        .send(fixtures.super_user.invalidlogin)
        .expect('Content-Type', /json/)
        .expect(404)
        .end((err, res) => {
          var msg = 'Authentication failed. User not found.';
          expect(err).to.be(null);
          expect(res.body).to.be.an('object');
          expect(res.body).to.only.have.keys(['success', 'message']);
          expect(res.body.success).not.to.be.ok();
          expect(res.body.message).to.be(msg);
          done();
        });
    });

    var msg3 = 'Should reject invalid login credentials - password';
    it(msg3, (done) => {
      api
        .post('/api/v0.1/auth/authenticate')
        .set('Accept', 'application/x-www-form-urlencoded')
        .send(fixtures.super_user.invalidlogin2)
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          var msg = 'Authentication failed. Wrong password.';
          expect(err).to.be(null);
          expect(res.body).to.be.an('object');
          expect(res.body).to.only.have.keys(['success', 'message']);
          expect(res.body.success).not.to.be.ok();
          expect(res.body.message).to.be(msg);
          done();
        });
    });

    var msg4 = 'Should validate auth credentials provided before processing.';
    it(msg4, (done) => {
      api
        .post('/api/v0.1/auth/authenticate')
        .set('Accept', 'application/x-www-form-urlencoded')
        .send(fixtures.super_user.invalidlogin3)
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          var msg = 'Params Validation Failed!';
          expect(err).to.be(null);
          expect(res.body).to.be.an('object');
          expect(res.body).to.only.have.keys(['success', 'message', 'errors']);
          expect(res.body.success).not.to.be.ok();
          expect(res.body.message).to.be(msg);
          done();
        });
    });
  });
};

module.exports = authenticate;
