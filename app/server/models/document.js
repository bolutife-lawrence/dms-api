var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId,
  mongoosePaginate = require('mongoose-paginate');

var DocumentSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  userId: [{
    required: true,
    type: ObjectId,
    ref: 'User'
  }],
  roles: [{
    required: true,
    type: ObjectId,
    ref: 'Role'
  }]
});

// load the mongoose paginate plugin into the Document Schema.
DocumentSchema.plugin(mongoosePaginate);

module.exports = {
  model: mongoose.model('Document', DocumentSchema),
  schema: DocumentSchema
};
