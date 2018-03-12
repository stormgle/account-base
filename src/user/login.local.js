"use strict"

const { app, userdb } = require('./login.app');

const dynamodb = require('@stormgle/userdb-dynamodb')


/* add dynamodb driver to userdb-api */
userdb.use( dynamodb(
  {
    region : 'us-west-2', 
    endpoint : `${process.env.DB_HOST}:${process.env.DB_PORT}`
  },
  (err) => {
    if (err) {
      console.log('Failed to init local db')
      console.log(err)
    } else {
      const httpServer = require('http').createServer(app);
      const PORT = process.env.PORT_USER_LOGIN;
      httpServer.listen(PORT)
      console.log(`#Login service is running at localhost:${PORT}\n`);
    }
  }
));

