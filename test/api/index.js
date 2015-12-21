var
  app = require('../../app'),
  request = require('supertest'),
  expect = require('expect.js'),
  _api = require('./api'),
  fixtures = require('../fixtures/fixtures'),
  userResource = require('./userResource'),
  authenticate = require('./authenticate'),
  documentResource = require('./documentResource'),
  roleResource = require('./roleResource'),
  not_found = require('./404'),
  models = require('../../models'),
  ControllerHelpers = require('../../controllers/ControllerHelpers'),
  jwt = require('jsonwebtoken'),
  api = request(app);


// Run tests for the api's root '/' path.
_api(api, expect, fixtures, models, ControllerHelpers.UserHelper);

//Load in test fixtures and run tests on the authenticate route.
authenticate(api, expect, fixtures);

// Load in test fixtures and run tests for the User Resource.
userResource(api, expect, fixtures);

// Load in test fixtures and run tests for Document Resource.
documentResource(api, expect, fixtures, jwt);

//Load in test fixtures and run tests for Role Resource.
roleResource(api, expect, fixtures, jwt);

// Run tests for requested Resource not found.
not_found(api, models);
