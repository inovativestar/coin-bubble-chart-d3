var _              = require('lodash');
var Promise        = require('bluebird');
var customErrors   = require('n-custom-errors');
var consts         = require('../consts');
var usersSrvc      = require('../data-services/users');

exports.changePassword = function(req, res, next){
    function parseParams(body) {
      var allowedFields = ['oldPassword', 'newPassword'];
      var userData = _.pick(body, allowedFields);
      userData.email = req.user.email;
      return Promise.resolve(userData);
    }
  
    
  
     parseParams(req.body)
      .then(userData => usersSrvc
        .getUser({ email: userData.email })
        .then(user => {
            console.log(user);
          if(user.authenticate(userData.oldPassword)){
            user.set("password", userData.newPassword);
            return user;   
          }else {
            return customErrors.rejectWithUnprocessableRequestError({ paramName: 'oldPassword', errMsg: 'must be same as original password' });
          }
          
        })
      )
      .then(user => usersSrvc.saveUser(user))
      .then(user => res.send(user))
      .catch(next);
  
  };