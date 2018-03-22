"use strict"

const http = require('http')

const DynamoDbLocal = require('dynamodb-local');
const UserDB = require('@stormgle/userdb-api');

const jwt = require('jsonwebtoken');

const keys = {
  account: process.env.AUTH_KEY_ACCOUNT,
  admin: process.env.AUTH_KEY_ADMIN,
  super: process.env.AUTH_KEY_SUPER
};

let _admin = {};

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

    const req = http.request(this.conn, (res) => {
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
  
    req.write(JSON.stringify(data));
    req.end();
  }

}

const db = {

  launch() {
    /* start dynamodb-local */
    DynamoDbLocal.configureInstaller({
      installPath: './localdb',
      downloadUrl: 'https://s3.eu-central-1.amazonaws.com/dynamodb-local-frankfurt/dynamodb_local_latest.tar.gz'
    });

    DynamoDbLocal.launch(process.env.DB_PORT, null, ['shareDb'])
    
  },

  start(done) {
    /* check when db is up and run */
    const userdb = new UserDB();
    userdb.use(require('@stormgle/userdb-dynamodb')(
      {
        region : 'us-west-1', 
        endpoint : `${process.env.DB_HOST}:${process.env.DB_PORT}`
      },
      (err) => {
        if (err) {
          console.log('Failed to init local db')
          done(err);
        } else {
          userdb.createTable(function(err, data) {
            if (err) {
              done(err);
            } else {
              const  policies = {admin: true, account: true}
              // add admin user into database
              userdb.createUser(
                {
                  username: 'admin',
                  login: { password: 'qwe'},
                  roles: ['admin','user'],
                  uid: 'admin-specific-uid',
                  policies,
                  profile: { email: ['admin@team.com']}
                },
                (err, user) => {
                  if (err) done(err)
                  else {
                    const tokens = {}
                    for(let policy in policies) {    
                      if (keys[policy]) {
                        const token = jwt.sign({
                          uid: user.uid,
                        }, keys[policy], {
                          expiresIn: "14 days"
                        });
                        tokens[policy] = token;
                      }   
                    }
                    _admin = user;
                    _admin.tokens = tokens;
                    done();
                  }
                }
              )
            }
          })
        }
      }
    )) 
  },

  close() {
    DynamoDbLocal.stop(process.env.DB_PORT);
  }
}

function getAdminUser() {
  return _admin;
}

const _tests = [];

function Test(tests) {

  tests.forEach( function (path) {
    _tests.push(require(`./${path}.test`))
  })

  return {
    run() {
      return _tests.map(function(test) {
        return test();
      })
    }
  }

}

module.exports = { Connect, db, getAdminUser, Test }
