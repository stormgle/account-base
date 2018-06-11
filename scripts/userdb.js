"use strict"

require('dotenv').config()

const DatabaseAbstractor = require('database-abstractor');

const userdb = new DatabaseAbstractor();

/* for generate user LOGIN token */
const jwt = require('jsonwebtoken');
const keys = {
  account: process.env.AUTH_KEY_ACCOUNT,
  admin: process.env.AUTH_KEY_ADMIN,
  super: process.env.AUTH_KEY_SUPER
};

const db = {
  host: null,
  port: null
}

module.exports = {

  _dbready: false,

  _tables: null,

  _users: {},

  queue: [],

  use({host, port}) {
    db.host = host;
    db.port = port;

    userdb.use(require('@stormgle/userdb-dynamodb-driver')(
      {
        region : 'us-west-2', 
        endpoint : `${db.host}:${db.port}`
      },
      (err, data) => {
        if (err) {
          console.log('Failed to init local db')
          throw new Error(err)
        } else {
          this._dbready = true;
          this._tables = data.TableNames;
          if (this.queue.length > 0) {
            this.queue.forEach(fn => this[fn.name].apply(this,fn.args))
          }
        }
      }
    ))

    return this;
  },

  init(done) {
    if (!db.host && !db.port) {
      throw new Error('host and port of database must be define.')
    }
    if (this._tables) {
      if (this._tables.length === 0) {
        console.log('Initializing USER Table...')
        return this.new(() => {
          console.log('USER Table is created and ready to use.');
          done && done();
        });
      } else {
        return this._getUsersFromDB();
      }
    } else {
      this.queue.push({name: 'init', args: [done]})
    }
  },

  new(done) {
    if (!db.host && !db.port) {
      throw new Error('host and port of database must be define.')
    }
    if (this._dbready) {
      userdb.createTable((err, data) => {
        if (err) {
          console.log('Failed to create table')
          console.log(err);
        } else {  
          this._createUsers(done);
        }
      })
    } else {
      this.queue.push({name: 'new', args: [done]})
    }
    return this;
  },

  reset () {
    if (!db.host && !db.port) {
      throw new Error('host and port of database must be define.')
    }
    const self = this;
    if (this._dbready) {
      userdb.dropTable(function(err, data) {
        if (err) {
          console.log('Failed to drop USERS table')
          console.log(err);
        } else {
          console.log('Dropped old USERS table')
          userdb.createTable((err, data) => {
            if (err) {
              console.log('Failed to create table')
              console.log(err);
            } else {  
              self._createUsers();
            }
          })
        }
      })
    } else {
      this.queue.push({name: 'reset', args: [done]})
    }
    return this;
  },

  _createUser(name, user) {
    const username = user.username;
    const password = user.login.password;
    return new Promise((resolve, reject) => {
      userdb.createUser(
        user,
        (err, usr) => {
          if (err) {
            reject();
          } else {
            console.log(`  -> ${name} user is: ${username} / ${password}`)
            this._users[name] = usr;
            this._users[name].login.password = password; // restore original (not hased) password
            this._users[name].login.token = this._genLoginToken(usr);
            resolve();  
          }
        }
      )     
    })
  },

  _genLoginToken(user) {
    const tokens = {}    
    const policies = user.policies;        
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
    return tokens;
  },

  _createUsers(done) {
    console.log('Creating users...')  
    Promise.all([
      this._createUser('super', {
        username: 'super@team.com',
        login: { password: 'qwe'},
        roles: ['super'],
        uid: 'super-amin-special-uid',
        profile: { email: ['super@team.com']}
      }),
      this._createUser('admin', {
        username: 'admin@team.com',
        login: { password: 'qwe'},
        roles: ['admin','user'],
        uid: 'admin-special-uid',
        profile: { email: ['admin@team.com']}
      }),
      this._createUser('tester', {
        username: 'tester@team.com',
        login: { password: '123'},
        roles: ['user'],
        uid: 'tester-uid',
        profile: { email: ['tester@team.com']}
      })      
    ]).then(values => {
      console.log('Created users.')
      done && done();
    })
    return this;
  },

  _getUsersFromDB() {
    console.log('Retrieving users...')
    const users = ['super', 'admin', 'tester'];
    users.forEach(username => {
      userdb.queryUser({username}, (err, user) => {
        this._users[username] = user;
      })
    })
    return this;
  },

  getUser(name) {
    return this._users[name];
  }

}
