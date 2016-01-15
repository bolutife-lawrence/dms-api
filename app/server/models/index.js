var models = {
  User: require('./user').model,
  Document: require('./document').model,
  Role: require('./role').model
};
module.exports = models;
