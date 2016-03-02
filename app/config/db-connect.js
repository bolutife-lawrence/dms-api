var Mongoose = require('mongoose');
var db_connect = () => {
  Mongoose.connect(process.env.DMS_DATABASE_URI);

  // When successfully connected
  Mongoose.connection.on('connected', () => {
    console.log('Mongoose has connected to the database specified.');
  });
};

module.exports = db_connect;
