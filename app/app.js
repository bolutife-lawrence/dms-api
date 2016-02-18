module.exports = (() => {
  // get dependencies
  var env = process.env.NODE_ENV || 'development';
  if (env === 'development') {
    var dotenv = require('dotenv');
    // load all environment variables in the .env file.
    dotenv.load();
  }

  var express = require('express'),
    session = require('express-session'),
    app = express(),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    jwt = require('jsonwebtoken'),
    expressValidator = require('express-validator'),
    methodOverride = require('method-override'),
    mongoConnect = require('./config/db-connect'),
    passportConfig = require('./config/passport'),
    passportRoutes = require('./server/routes/passport'),
    router = require('./server/routes'),
    errorHandler = require('./middlewares/error-handler'),
    cloudinary = require('cloudinary'),
    cors = require('cors');

  // pass in an instance of passport fopr configuration
  passportConfig(passport);

  // Initiate cloudinary
  cloudinary.config(process.env.CLOUDINARY_URL);

  // Connect to mongodb
  mongoConnect();

  app.locals.title = 'DMS API';
  app.locals.strftime = require('strftime');
  app.locals.email = 'lawrence.olaiya@andela.com';
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(expressValidator());
  app.use(methodOverride());
  app.use(cors()); // Enable CORS
  app.use(cookieParser());
  app.use(logger('dev'));
  app.use(session({
    secret: 'process.env.SESSION_SECRET'
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  // App routes mounted on a parent route.
  app.use('/api/v0.1', router);

  // Throw a 404 error if requested route is not found
  app.use(errorHandler.throwError);

  // pass in fully configured passport instance into the passport routes
  passportRoutes(router, passport, jwt);

  return app;
})();
