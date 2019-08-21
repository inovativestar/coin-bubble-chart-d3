'use strict';

var customErrors = require('n-custom-errors');
var User         = require('mongoose').model('user');


exports.getUser = (filter, keys) => {
    return User
      .findOne(filter)
      .select(keys)
      .exec()
      .then(user => {
        if (!user) {
          return customErrors.rejectWithObjectNotFoundError('user is not found');
        }
        return user;
      });
};


exports.updateUser = (userData) => {
  var filter = {
    _id: userData._id
  };
  var emailFilter = {
    email: (userData.email || '').toLowerCase()
  };
  return User
    .findOne(filter)
    .exec()
    .then(user => {
      if (!user) {
        return customErrors.rejectWithObjectNotFoundError('user is not found');
      }
      if(user.email === userData.email)
        return userData.save();
      else
      {
        return User
          .count(emailFilter)
          .then(cnt => {
            if (cnt > 0) {
              return customErrors.rejectWithDuplicateObjectError('This email is already in use');
            }
            return userData.save();
          });
      }
      
    });
}

exports.saveUser = user => {
  return user.save();
};
