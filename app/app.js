module.exports = (() => {
  // get dependencies
  var express = require('express'),
    app = express(),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator'),
    methodOverride = require('method-override'),
    mongoConnect = require('../config/db-connect'),
    router = require('./server/routes'),
    errorHandler = require('./middlewares/error-handler');

if (process.env.NODE_ENV === 'development') {
  // load all environment variables in the .env file.
  require('dotenv').load();
}

  // Connect to mongodb
  mongoConnect();

  // App configurations
  app.locals.title = 'DMS API';
  app.locals.strftime = require('strftime');
  app.locals.email = 'lawrence.olaiya@andela.com';
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(expressValidator());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(logger('dev'));

  // App routes mounted on a parent route.
  app.use('/api/v0.1', router);

  // Throw a 404 error if requested route is not found
  app.use(errorHandler.throwError);

  return app;
})();
