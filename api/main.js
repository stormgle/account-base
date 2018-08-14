"use strict"

const api = require('express-api-binder')

api.generateFunctions = ({forgotPassword, form, reset}) => {
  
  const funcs = [
    'post/auth/signup',
    'post/auth/login',
    'post/me/update_profile',
    'post/me/update_password',
    'post/users/update',
    'post/check/user',
    'get/users/:username',
    'get/users/uid/:uid'
  ];
  
  funcs.forEach(func => {
    const { method, uri, includePath } = api.parseApi(func);
    api.createFunction(method, uri, require(`./${includePath}`))
  }) 
  
  api.createFunction(
    'post', 
    '/auth/forgot_password', 
    require('./post/auth/forgot_password'), 
    forgotPassword
  )
  

  api.createFunction(
    'get', 
    '/auth/0/form', 
    require('./get/auth/0/form'), 
    form
  )
  
  api.createFunction(
    'post', 
    '/auth/reset_password', 
    require('../api/post/auth/reset_password'), 
    reset
  )

  return this;
}


module.exports = api;