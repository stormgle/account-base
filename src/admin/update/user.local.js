"use strict"

const app = require('../app')

const dynamodb = require('@stormgle/userdb-dynamodb')

const dbDriver = dynamodb({ 
  region : 'us-west-2', 
  endpoint : `${process.env.DB_HOST}:${process.env.DB_PORT}`
});

app
  .useDbDriver(dbDriver)
  .createFunction('/admin/update/user', require('./user.app'));

const httpServer = require('http').createServer(app);
const PORT = process.env.PORT_ADMIN_UPDATE_USER;
httpServer.listen(PORT)
console.log(`# /admin/update/user service is running at localhost:${PORT}\n`);








