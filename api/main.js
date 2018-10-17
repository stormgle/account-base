"use strict"

const api = require('express-api-binder')

api.generateFunctions = ({forgotPassword, form, updatePassword, signup, verifyEmail, sendVerifyEmail}) => {
  
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
    '/auth/update_password', 
    require('./post/auth/update_password'), 
    updatePassword
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
    '/auth/verify_email',
    require('./get/auth/verify_email'),
    verifyEmail
  )

  /* this function send an email that contain link to verify email owner*/
  api.createFunction(
    'post',
    '/auth/send_verify_email',
    require('./post/auth/send_verify_email'),
    sendVerifyEmail
  )

  /* this function indicate to user that email is verified successful*/
  api.createFunction(
    'get',
    '/auth/verified_email',
    require('./get/auth/verified_email'),
    verifyEmail
  )

  /* this function return html page for request send mail reset password*/
  api.createFunction(
    'get',
    '/auth/request_reset_password_link',
    require('./get/auth/request_reset_password_link'),
    requestResetPasswordLink
  )

  return this;
}


module.exports = api;