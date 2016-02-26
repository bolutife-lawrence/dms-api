var Mongoose = require('mongoose');
var db_connect = () => {
  Mongoose.connect(process.env.DMS_DATABASE_URI);

  // When successfully connected
  Mongoose.connection.on('connected', () => {
    console.log('Mongoose has connected to the database specified.');
  });

  // If the connection throws an error
  Mongoose.connection.on('error', err => {
    console.log('Mongoose default connection error: ' + err);
  });

  // When the connection is disconnected
  Mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
  });

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', () => {
    Mongoose.connection.close(() => {
      console.log('Mongoose disconnected on application exit');
      process.exit(0);
    });
  });
};

module.exports = db_connect;
