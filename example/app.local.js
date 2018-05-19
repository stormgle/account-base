"use strict"

require('dotenv').config()

const app = require('../api/main')

const dynamodb = require('@stormgle/userdb-dynamodb')

const PORT = 3100;

const dbDriver = dynamodb({ 
  region : 'us-west-2', 
  endpoint : `${process.env.DB_HOST}:${process.env.DB_PORT}`
});

const funcs = [
  'post/auth/signup',
  'post/auth/login',
  'post/me/update_profile',
  'post/me/update_password',
  'post/users/update',
  'get/users/:username',
]

app
  .useDbDriver(dbDriver)

funcs.forEach(func => {
  const { method, uri, includePath } = app.parseApi(func);
  app.createFunction(method, uri, require(`../api/${includePath}`))
})  

app.createFunction(
  'post', 
  '/auth/forgot_password', 
  require('../api/post/auth/forgot_password'), 
  {
    onSuccess: (token) => console.log(token.token),
    onFailure: (err) => console.log(err)
  }
)

app.createFunction(
  'get', 
  '/auth/0/form', 
  require('../api/get/auth/0/form'), 
  {
    title: 'Auth-0', 
    body:'Hello from Auth-0 / ',
    endPoint: `http://localhost:${PORT}/auth/reset_password`,
    redirect: {
      success: `http://localhost:${PORT}/`
    }
  }
)

app.createFunction(
  'post', 
  '/auth/reset_password', 
  require('../api/post/auth/reset_password'), 
  {
    title: 'Auth-0', 
    service: 'Example',
    redirect: `http://localhost:${PORT}/`
  }
)

const httpServer = require('http').createServer(app);
httpServer.listen(PORT)
console.log(`# user-services is running at localhost:${PORT}\n`);
  
