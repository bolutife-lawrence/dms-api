var not_found = (api, models) => {
  describe('404 error', () => {
    after((done) => {
      // Rid database of all test data(seeds) before testing begins.
      try {
        models.Document.remove({}, () => {
          models.User.remove({}, () => {
            models.Role.remove({}, () => {
              console.log('Unseed completed!!!');
              done();
            });
          });
        });
      } catch (e) {
        console.log(e);
      }
    });

    var msg = 'returns 404 status code if requested route is not found: POST';
    it(msg, (done) => {
      api
        .post('/DMS/api/not_found')
        .set('Accept', 'application/x-www-form-urlencoded')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });

    var msg2 = 'returns 404 status code if requested route is not found: GET';
    it(msg2, (done) => {
      api
        .get('/DMS/api/not_found')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });

    var msg3 = 'returns 404 status code if requested route is not found: PUT';
    it(msg3, (done) => {
      api
        .put('/DMS/api/not_found')
        .set('Accept', 'application/x-www-form-urlencoded')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });

    var msg4 = 'returns 404 status code if' +
    'requested route is not found: DELETE';
    it(msg4, (done) => {
      api
        .get('/DMS/api/not_found')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
  });
};

module.exports = not_found;
