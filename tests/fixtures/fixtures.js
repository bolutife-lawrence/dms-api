var yaml = require('js-yaml'),
  fs = require('fs');

// Load in all fixtures and catch any error that might occur.
// This also converts the contents of the yml filr to javascript objects.
try {
  var _userFixtures =
    yaml.safeLoad(fs.readFileSync(__dirname + '/fixtures.yml', 'utf8'));
  module.exports = _userFixtures;
} catch (e) {
  console.log(e);
  return console.log('Seeding not successful!');
}
