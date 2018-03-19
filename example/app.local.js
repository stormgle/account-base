"use strict"

require('dotenv').config()

const app = require('../api/main')

const dynamodb = require('@stormgle/userdb-dynamodb')

const dbDriver = dynamodb({ 
  region : 'us-west-2', 
  endpoint : `${process.env.DB_HOST}:${process.env.DB_PORT}`
});

const funcs = [
  'user/signup',
  'user/login',
  'user/update/profile',
  'user/update/password',
  'admin/query/user',
  'admin/update/user'
]

app
  .useDbDriver(dbDriver)

funcs.forEach(func => {
  app.createFunction(`/${func}`, require(`../api/${func}`))
})  

const PORT = 3100;
const httpServer = require('http').createServer(app);
httpServer.listen(PORT)
console.log(`# user-services is running at localhost:${PORT}\n`);
  
