"use strict"

const dynamodb = require('@stormgle/userdb-dynamodb')

class TestServer {
  constructor(api) {
    this.api = api;
    this.httpServer = null;
  }

  start(done) {
    const api = this.api
    const app = require('../api/app');
    const funcs = require(`../api/${api}`);
    
    app.useDbDriver(
      dynamodb({ 
        region : 'us-west-1', 
        endpoint : `${process.env.DB_HOST}:${process.env.DB_PORT}`
      })
    ).createFunction(`/${api}`, funcs);
    const portName = api.replace(/\//g,'_');
    const PORT = process.env[`PORT_${portName.toUpperCase()}`];
    this.httpServer = require('http').createServer(app);
    this.httpServer.listen(PORT);
    done && done();
  }

  close() {
    this.httpServer && this.httpServer.close();
  }

}

module.exports = TestServer