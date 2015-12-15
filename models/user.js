var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        first: {
            type: String,
            required: true
        },
        last: {
            type: String,
            required: true
        },
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    hashedPass: {
        type: String,
        required: true
    },
    saltPass: {
        type: String,
        required: true
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
