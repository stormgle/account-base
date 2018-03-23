"use strict"

const cwd = process.cwd();
const dynamodb = require('@stormgle/userdb-dynamodb')

class TestServer {
  constructor(path) {
    const patt = /^\w+/i;
    this.method = path.match(patt);
    this.uri = path.replace(patt,"");
    this.path = path;
    this.httpServer = null;
  }

  start(done) {
    const app = require(`${cwd}/api/main`);
    const path = this.path.replace(":","");
    const funcs = require(`${cwd}/api/${path}`);
    
    app.useDbDriver(
      dynamodb({ 
        region : 'us-west-1', 
        endpoint : `${process.env.DB_HOST}:${process.env.DB_PORT}`
      })
    ).createFunction(this.method, this.uri, funcs);

    const portName = this.uri.replace(/\//g,'_').replace(':','');
    const PORT = process.env[`PORT${portName.toUpperCase()}`];
    this.httpServer = require('http').createServer(app);
    this.httpServer.listen(PORT);

    done && done();
  }

  close() {
    this.httpServer && this.httpServer.close();
  }

}

module.exports = TestServer