var _async = require('async'),
  models = require('./app/server/models'),
  co = require('co'),
  user = require('./seeds/user.json'),
  role = require('./seeds/role.json'),
  mongoConnect = require('./app/config/db-connect');

_async.waterfall([
  cb => {
    mongoConnect();
    setTimeout(() => {
      cb(null, true);
    }, 1000);
  },

  (dbReadyState, cb) => {
    if (dbReadyState) {
      co(function* () {
        var newRole = new models.Role(role),
        savedRole = yield newRole.save();
        cb(null, savedRole, dbReadyState);
      });
    }
  },

  (savedRole, dbReadyState, cb) => {
    if (dbReadyState) {
      user.role.push(savedRole);
      co(function* () {
        var newUser = new models.User(user);
        var savedUser = yield newUser.save(user);
        cb(null, savedUser);
      });
    }
  },

  (savedUser, cb) => {
    if (savedUser) cb(null, 'All done. Go play!');
  }
], (err, res) => {
  if (err) throw err;
  console.log(res);
  process.exit(0);
});
