"use strict"

const api = require('express-api-binder')

api.generateFunctions = ({forgotPassword, form, reset, signup, verifyEmail}) => {
  
  const funcs = [
    'post/auth/login',
    'post/auth/admin_login',
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
    require('./post/auth/reset_password'), 
    reset
  )

  api.createFunction(
    'post',
    '/auth/signup',
    require('./post/auth/signup'),
    signup
  )

  /* this function verify email and activate user status from verify email link */
  api.createFunction(
    'get',
    '/auth/0/verify_email',
    require('./get/auth/0/verify_email'),
    verifyEmail
  )

  /* this function send an email thata contain link to verify email owner*/
  api.createFunction(
    'post',
    '/auth/send_verify_email',
    require('./post/auth/send_verify_email'),
    send_verifyEmail
  )

  return this;
}


module.exports = api;