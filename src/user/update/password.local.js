"use strict"

const app = require('../app')

const dynamodb = require('@stormgle/userdb-dynamodb')

const dbDriver = dynamodb({ 
  region : 'us-west-2', 
  endpoint : `${process.env.DB_HOST}:${process.env.DB_PORT}`
});

app
  .useDbDriver(dbDriver)
  .createFunction('/user/update/password', require('./password.app'));

const httpServer = require('http').createServer(app);
const PORT = process.env.PORT_USER_UPDATE_PASSWORD;
httpServer.listen(PORT)
console.log(`# /user/update/password service is running at localhost:${PORT}\n`);








