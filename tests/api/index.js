var
  app = require('../../app/app'),
  request = require('supertest'),
  expect = require('expect.js'),
  _async = require('async'),
  _api = require('./api'),
  fixtures = require('../fixtures/fixtures'),
  invalidId = '4edd40c86762e0fb12000003',
  userResource = require('./user-resource'),
  authenticate = require('./authenticate'),
  documentResource = require('./document-resource'),
  roleResource = require('./role-resource'),
  not_found = require('./404'),
  models = require('../../app/server/models'),
  ctrlHelpers = require('../../app/server/controllers/controller-helpers'),
  jwt = require('jsonwebtoken'),
  api = request(app);


// Run tests for the api's root '/' path.
_api(api, expect, fixtures, models, ctrlHelpers.userHelper);

//Load in test fixtures and run tests on the authenticate route.
authenticate(api, expect, fixtures);

// Load in test fixtures and run tests for the User Resource.
userResource(api, expect, fixtures);

// Load in test fixtures and run tests for Document Resource.
documentResource(api, expect, fixtures, jwt, _async, invalidId);

//Load in test fixtures and run tests for Role Resource.
roleResource(api, expect, fixtures, invalidId);

// Run tests for requested Resource not found.
not_found(api, expect, models);
