"use strict"

const { app, userdb } = require('./password.app');

const dynamodb = require('@stormgle/userdb-dynamodb')

/* add dynamodb driver to userdb-api */
userdb.use(dynamodb(
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
      const PORT = process.env.PORT_UPDATE_PASSWORD;
      httpServer.listen(PORT)
      console.log(`#Update/Password service is running at localhost:${PORT}\n`);
    }
  }
));
