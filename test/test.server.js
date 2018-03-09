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
        region : 'us-west-1', 
        endpoint : `${process.env.DB_HOST}:${process.env.DB_PORT}`
      },
      (err) => {
        if (err) {
          console.log('Failed to init local db')
          done(err);
        } else {
          const portName = api.replace('/','_');
          const PORT = process.env[`PORT_${portName.toUpperCase()}`];
          this.httpServer = require('http').createServer(app);
          this.httpServer.listen(PORT);
          done && done();
        }
      }
    ));
  }

  close() {
    this.httpServer && this.httpServer.close();
  }

}

module.exports = TestServer