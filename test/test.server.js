"use strict"

const dynamodb = require('@stormgle/userdb-dynamodb')

class TestServer {
  constructor(api) {
    this.api = api;
    this.httpServer = null;
  }

  start(done) {
    const api = this.api
    const { app, userdb } = require(`../src/${api}.app`);
    userdb.use( dynamodb(
      {
        region : 'us-west-2', 
        endpoint : `${process.env.DB_HOST}:${process.env.DB_PORT}`
      },
      (err) => {
        if (err) {
          console.log('Failed to init local db')
          done(err);
        } else {
          const PORT = process.env[`POST_${api.toUpperCase()}`];
          this.httpServer = require('http').createServer(app);
          this.httpServer.listen(PORT);
  
          app.post('/close', (res, req) => {
            httpServer.close();
            // process.exit(0);
          })
  
          done();
        }
      }
    ));
  }

  close() {
    this.httpServer && this.httpServer.close();
  }

}

module.exports = TestServer