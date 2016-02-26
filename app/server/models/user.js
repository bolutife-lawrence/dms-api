 var mongoose = require('mongoose'),
   mongoosePaginate = require('mongoose-paginate'),
   Schema = mongoose.Schema,
   bcrypt = require('bcrypt'),
   ObjectId = Schema.Types.ObjectId,
   SALT_WORK_FACTOR = 10;

 var UserSchema = new Schema({
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
     required: true
   },
   google: {
     id: {
       type: String,
       default: null
     },
     token: {
       type: String,
       default: null
     }
   },
   facebook: {
     id: {
       type: String,
       default: null
     },
     token: {
       type: String,
       default: null
     }
   },
   password: {
     type: String
   },
   img_url: {
     type: String,
     default: 'http://res.cloudinary.com/dms/image/upload/c_scale,h_275,q_98,' +
       'r_30/v1453209823/default_avatar_fnm9wb.gif'
   },
   img_public_id: {
     type: String,
     default: null
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

 UserSchema.pre('save', function (next) {
   var user = this;

   if (!user.isModified('password')) return next();

   // generate a salt
   bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
     if (err) return next(err);

     // hash the password using our new salt
     bcrypt.hash(user.password, salt, (err, hash) => {
       if (err) return next(err);
       // override the cleartext password with the hashed one
       user.password = hash;
       next(user);
     });
   });
 });

 UserSchema.methods.comparePassword = function (userPassword, cb) {
   if(this.google.id || this.facebook.id ) return cb(null, true);
   bcrypt.compare(userPassword, this.password, (err, isMatch) => {
     if (err) return cb(err);
     cb(null, isMatch);
   });
 };

 module.exports = {
   model: mongoose.model('User', UserSchema),
   schema: UserSchema
 };
