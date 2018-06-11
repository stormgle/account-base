"use strict"

const http = require('http')

const userdb = require('../scripts/userdb')

function _clone(obj) {
  const clonedObj = {};
  for (let prop in obj) {
    clonedObj[prop] = obj[prop]
  }
  return clonedObj;
}

class Connect {
  constructor({hostname, port, path}) {

    const patt = /^\w+/i;
    const method = `${path.match(patt)}`.toUpperCase();
    const uri = path.replace(patt,"");

    this.conn = {
      hostname, port, path: uri,
      method,
      headers: { 'Content-Type': 'application/json' }
    }

    this.eventHandlers = {};

  }

  on(event, handler) {
    if (!this.eventHandlers[event]) { 
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);
  }

  tryConnect() {
    setTimeout(() => {
      const req = http.request(this.conn, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          //stub here
        });
        res.on('end', () => {
          this.fire('online');
        });
      })
      req.on('error', (e) => {
        this.tryConnect();  
      });
      req.write("{}");
      req.end();
    },100);
  }

  fire(event) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach((handler) => {
        handler();
      })
    }
  }

  request(data, bearer, done) {

    if (typeof bearer === 'function') {
      done = bearer;
      bearer = null;
    }

    const conn = _clone(this.conn);

    if (this.conn.method === 'GET' && typeof data === 'string') {
      conn.path = this.conn.path.replace(/\/:\w+$/,`/${data}`);
    }

    const req = http.request(conn, (res) => {
      const ret = {
        status: res.statusCode,
        body: ''
      };
      // console.log(`STATUS: ${res.statusCode}`)
      // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        ret.body += chunk;
      });
      res.on('end', () => {
        if (ret.body) {
          ret.body = JSON.parse(ret.body);
        }   
        done(null, ret)
      });
    })

    if (bearer) {
      req.setHeader('Authorization',  `Bearer ${bearer}`);
    }
    
    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
      done(e, null)
    });
    
    if (this.conn.method === 'POST') {
      req.write(JSON.stringify(data));
    }
    req.end();
  }

}

function getAdminUserToken() {
  return userdb.getUser('admin').login.token;
}

const _tests = [];

function Test(tests) {

  tests.forEach( function (path) {
    _tests.push({ path, run: require(`./${path.replace(":","")}.test`) })
  })

  return {
    run() {
      return _tests.map(function(test) {
        return test.run(test.path);
      })
    }
  }

}

module.exports = { Connect, getAdminUserToken, Test }
