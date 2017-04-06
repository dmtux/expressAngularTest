'use strict';

let bcrypt = require('bcrypt-nodejs');

// create the model for users and expose it to our app
module.exports = (mongoose) => {

  // define the schema for our user model
  let userSchema = mongoose.Schema({
    name: String,
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    dc: {type: Date, default: Date.now}
  });

  userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

  userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.passwordHash;
    return obj;
  };

  return mongoose.model('User', userSchema);
};
