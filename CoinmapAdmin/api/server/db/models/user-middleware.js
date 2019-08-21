'use strict';

var bcrypt = require('bcrypt');

module.exports = userSchema => {
  userSchema.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  });

  userSchema.pre('save', function(next) {
    this.email = this.email.toLowerCase();
    next();
  });

  userSchema.methods = {
    authenticate: function(plainText) {
      return bcrypt.compareSync(plainText, this.hashedPassword);
    },

    encryptPassword: function(password) {
      if (!password || !this.salt) {
        return '';
      }
    
      return bcrypt.hashSync(password, this.salt);
    },

    makeSalt: function() {
   
      const saltRounds = 10;
      return bcrypt.genSaltSync(saltRounds);
 
    },

  };
};
