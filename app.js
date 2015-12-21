module.exports = (function () {
  // get dependencies
  var express = require('express'),
    app = express(),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator'),
    methodOverride = require('method-override'),
    mongoConnect = require('./config/db_connect'),
    router = require('./routes'),
    errorHandler = require('./middlewares/errorHandler'),
    customValidators = require('./helpers/customValidators');

// load all environment variables in the .env file.
require('dotenv').load();
// Connect to mongodb
mongoConnect();

  // App configurations
  app.locals.title = 'DMS API';
  app.locals.strftime = require('strftime');
  app.locals.email = 'lawrence.olaiya@andela.com';
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(expressValidator(customValidators));
  app.use(bodyParser.json());
  app.use(expressValidator());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(logger('dev'));

  // App routes mounted on a parent route.
  app.use('/DMS/api', router);

  // catch 404 and forward to error handler
  app.use(errorHandler.setError);
  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(errorHandler.throwErrorDev);
  }
  // production error handler
  // no stacktraces leaked to user
  app.use(errorHandler.throwError);
  return app;
})();
