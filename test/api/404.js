var not_found = (api, models) => {
  describe('404 error', () => {
    after((done) => {
      // Rid database of all test data(seeds) before testing begins.
      try {
        models.Document.remove({}, (err) => {
          models.User.remove({}, (err) => {
            models.Role.remove({}, (err) => {
              console.log('Unseed completed!!!');
              done();
            });
          });
        });
      } catch (e) {
        console.log(e);
      }
    });

    it('returns 404 status code if requested route is not found: POST', (done) => {
      api
        .post('/DMS/api/not_found')
        .set('Accept', 'application/x-www-form-urlencoded')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });

    it('returns 404 status code if requested route is not found: GET', (done) => {
      api
        .get('/DMS/api/not_found')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });

    it('returns 404 status code if requested route is not found: PUT', (done) => {
      api
        .put('/DMS/api/not_found')
        .set('Accept', 'application/x-www-form-urlencoded')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });

    it('returns 404 status code if requested route is not found: DELETE', (done) => {
      api
        .get('/DMS/api/not_found')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
  });
};

module.exports = not_found;
