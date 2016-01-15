var Mongoose = require('mongoose');
var db_connect = () => {
  Mongoose.connect(process.env.DMS_DATA_URI);

  // When successfully connected
  Mongoose.connection.on('connected', function() {
    console.log('Mongoose has connected to the database specified.');
  });

  // If the connection throws an error
  Mongoose.connection.on('error', function(err) {
    console.log('Mongoose default connection error: ' + err);
  });

  // When the connection is disconnected
  Mongoose.connection.on('disconnected', function() {
    console.log('Mongoose default connection disconnected');
  });

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', function() {
    Mongoose.connection.close(function() {
      console.log('Mongoose disconnected on application exit');
      process.exit(0);
    });
  });
};

module.exports = db_connect;
