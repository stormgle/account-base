"use strict"

const http = require('http')

const DynamoDbLocal = require('dynamodb-local');
const UserDB = require('@stormgle/userdb-api');

class Connect {
  constructor({hostname, port, path}) {

    this.conn = {
      hostname, port, path,
      method: 'POST',
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

  closeServer(done) {
    const conn = {};
    for (let prop in this.conn) {
      conn[prop] = this.conn[prop];
    }
    conn.path = '/close';
    const req = http.request(conn, (res) => {
      res.setEncoding('utf8');
      res.on('data', (chunk) => {});
      res.on('end', () => {});
      })
      req.on('error', (e) => {});
      req.write("{}");
      req.end();
  }

  fire(event) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach((handler) => {
        handler();
      })
    }
  }

  request(data, done) {
    const req = http.request(this.conn, (res) => {
      const ret = {
        status: res.statusCode,
        body: ''
      };
      // console.log(`STATUS: ${res.statusCode}`)
      //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        ret.body += chunk;
      });
      res.on('end', () => {
        ret.body = JSON.parse(ret.body);
        done(null, ret)
      });
    })
    
    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
      done(e, null)
    });
  
    req.write(JSON.stringify(data));
    req.end();
  }

}

const db = {
  launch(done) {
    /* start dynamodb-local */
    DynamoDbLocal.configureInstaller({
      installPath: './localdb',
      downloadUrl: 'https://s3.eu-central-1.amazonaws.com/dynamodb-local-frankfurt/dynamodb_local_latest.tar.gz'
    });

    DynamoDbLocal.launch(process.env.DB_PORT, null, ['shareDb'])
    
  },

  waitForReady(done) {
    /* check when db is up and run */
    const userdb = new UserDB();
    userdb.use(require('@stormgle/userdb-dynamodb')(
      {
        region : 'us-west-2', 
        endpoint : `${process.env.DB_HOST}:${process.env.DB_PORT}`
      },
      (err) => {
        if (err) {
          console.log('Failed to init local db')
          done(err);
        } else {
          done();
        }
      }
    )) 
  },

  close() {
    DynamoDbLocal.stop(process.env.DB_PORT);
  }
}

module.exports = { Connect, db }
