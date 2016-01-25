var mongoose = require('mongoose'),
  mongoosePaginate = require('mongoose-paginate'),
  Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId;

var UserSchema = new Schema({
  username: {
    type: String
  },
  name: {
    first: {
      type: String
    },
    last: {
      type: String
    },
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  google: {
    id: {
      type: String
    },
    token: {
      type: String
    }
  },
  facebook: {
    id: {
      type: String
    },
    token: {
      type: String
    }
  },
  hashedPass: {
    type: String
  },
  saltPass: {
    type: String
  },
  img_url: {
    type: String,
    default: 'http://res.cloudinary.com/dms/image/upload/c_scale,h_275,q_98,' +
      'r_30/v1453209823/default_avatar_fnm9wb.gif'
  },
  public_img_id: {
    type: String
  },
  createdAt: {
    required: true,
    type: Date,
    default: Date.now
  },
  updatedAt: {
    required: true,
    type: Date,
    default: Date.now
  },
  role: [{
    required: true,
    type: ObjectId,
    ref: 'Role'
  }]
});

// load the mongoose paginate plugin into the User Schema.
UserSchema.plugin(mongoosePaginate);

module.exports = {
  model: mongoose.model('User', UserSchema),
  schema: UserSchema
};
