var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  mongoosePaginate = require('mongoose-paginate');

var RoleSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    populate: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// load the mongoose paginate plugin into the Document Schema.
RoleSchema.plugin(mongoosePaginate);

module.exports = {
  model: mongoose.model('Role', RoleSchema),
  schema: RoleSchema
};
