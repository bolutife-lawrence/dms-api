var not_found = (api, expect, models) => {
  describe('404 error', () => {
    after((done) => {
      // Rid database of all test data(seeds) after testing.
      models.Document.remove({}, () => {
        models.User.remove({}, () => {
          models.Role.remove({}, () => {
            console.log('Unseed completed!!!');
            console.log('Test last ran on ' + new Date());
            done();
          });
        });
      });
    });

    var msg = 'returns 404 status code if requested route is not found: POST';
    it(msg, (done) => {
      api
        .post('/api/v0.1/not_found')
        .expect('Content-Type', /json/)
        .expect(404)
        .end((err, res) => {
          expect(res.body.success).not.to.be.ok();
          expect(res.body.message).to.be('Requested resource not found');
          done();
        });
    });

    var msg2 = 'returns 404 status code if requested route is not found: GET';
    it(msg2, (done) => {
      api
        .get('/api/v0.1/not_found')
        .expect('Content-Type', /json/)
        .expect(404)
        .end((err, res) => {
          expect(res.body.success).not.to.be.ok();
          expect(res.body.message).to.be('Requested resource not found');
          done();
        });
    });

    var msg3 = 'returns 404 status code if requested route is not found: PUT';
    it(msg3, (done) => {
      api
        .put('/api/v0.1/not_found')
        .expect('Content-Type', /json/)
        .expect(404)
        .end((err, res) => {
          expect(res.body.success).not.to.be.ok();
          expect(res.body.message).to.be('Requested resource not found');
          done();
        });
    });

    var msg4 = 'returns 404 status code if' +
      'requested route is not found: DELETE';
    it(msg4, (done) => {
      api
        .get('/api/v0.1/not_found')
        .expect('Content-Type', /json/)
        .expect(404)
        .end((err, res) => {
          expect(res.body.success).not.to.be.ok();
          expect(res.body.message).to.be('Requested resource not found');
          done();
        });
    });
  });
};

module.exports = not_found;
