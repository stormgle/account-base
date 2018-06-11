"use strict"

const api = require('express-api-binder')

const funcs = [
  'post/auth/signup',
  'post/auth/login',
  'post/me/update_profile',
  'post/me/update_password',
  'post/users/update',
  'get/users/:username',
];

funcs.forEach(func => {
  const { method, uri, includePath } = api.parseApi(func);
  api.createFunction(method, uri, require(`./${includePath}`))
}) 

api.createFunction(
  'post', 
  '/auth/forgot_password', 
  require('./post/auth/forgot_password'), 
  {
    onSuccess: (token) => console.log(token.token),
    onFailure: (err) => console.log(err)
  }
)

const PORT = 3100;
api.createFunction(
  'get', 
  '/auth/0/form', 
  require('./get/auth/0/form'), 
  {
    title: 'Auth-0', 
    body:'Hello from Auth-0 / ',
    endPoint: `http://localhost:${PORT}/auth/reset_password`,
    redirect: {
      success: `http://localhost:${PORT}/`
    }
  }
)

api.createFunction(
  'post', 
  '/auth/reset_password', 
  require('../api/post/auth/reset_password'), 
  {
    title: 'Auth-0', 
    service: 'Example',
    redirect: `http://localhost:${PORT}/`
  }
)


module.exports = api;