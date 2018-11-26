"use strict"

const api = require('express-api-binder')

api.generateFunctions = ({sendEmailResetPassword, form, updatePassword, signup, emailProps, sendVerifyEmail, requestResetPasswordLink}) => {
  
  const funcs = [
    'post/auth/login',
    'post/auth/admin_login',
    'post/me/update_profile',
    'post/me/update_password',
    'post/me/update_progress',
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
    emailProps
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
    emailProps
  )

  /* this function return html page for request send mail reset password*/
  api.createFunction(
    'get',
    '/auth/request_reset_password_link',
    require('./get/auth/request_reset_password_link'),
    requestResetPasswordLink
  )

  /* this function send mail reset password*/
  api.createFunction(
    'post', 
    '/auth/send_email_reset_password', 
    require('./post/auth/send_email_reset_password'), 
    sendEmailResetPassword
  )

   /* this function update user test results*/
   api.createFunction(
    'post', 
    '/users/:uid/test_results', 
    require('./post/user/uid/test_results'), 
    sendEmailResetPassword
  )

  return this;
}


module.exports = api;