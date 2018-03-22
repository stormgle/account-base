"use strict"

const TestServer = require('../../server')
const { Connect, getAdminUser } = require('../../util')

const server = {
  signup: new TestServer('user/signup'),
  user: {
    query: new TestServer('admin/query/user'),
    update: new TestServer('admin/update/user')
  }
}

let userToken = {};
let userId = '';

function signupUser(conn) {
  return new Promise((resolve, reject) => {
    conn.request(
      {username: 'tester@update-user.com', password: '123456'}, 
      (err, data) => {
        if (err) done(err)
        else if (data) {
          userToken = data.body.tokens.account;
          resolve()
        } else {
          done({error: 'failed to signup new user for test'})
        }
      }
    )
  })
}

function queryUser() {
  return new Promise((resolve, reject) => {
    const conn = new Connect({
      hostname: 'localhost',
      port: process.env.PORT_ADMIN_QUERY_USER,
      path: '/admin/query/user'
    });
    server.user.query.start(() => {
      conn.request(
        {username: 'tester@update-user.com'}, 
        getAdminUser().tokens.super,
        (err, data) => {
          if (err) done(err)
          else if (data) {
            userId = data.body.user.uid;
            server.user.query.close();
            resolve()
          } else {
            done({error: 'failed to signup new user for test'})
          }
        }
      )
    })
    
  })
}

function test() {
  return describe('admin/update/user', function(){

    const conn = new Connect({
      hostname: 'localhost',
      port: process.env.PORT_ADMIN_UPDATE_USER,
      path: '/admin/update/user'
    });

    before(function(done) {
      server.signup.start(function() {
        // create a new user used for testing
        const conn = new Connect({
          hostname: 'localhost',
          port: process.env.PORT_USER_SIGNUP,
          path: '/user/signup'
        });

        signupUser(conn)
          .then(queryUser)
          .then(() => {
            server.signup.close();
            server.user.query.close();
            server.user.update.start(done);
          })

      });
    })

    after(function() {
      server.user.update.close();
    })

    it('admin update user status', function(done) {
      conn.request(
        {
          update: {uid: userId, verified: true }
        },
        getAdminUser().tokens.super,
        (err, data) => {
          if (err) done(err)
          else if (data) {
            if (data.status === 200) {
              done();
            } else {
              done({error: `expect return status code 200, but received ${data.status}`})
            }
          } else {
            done({error: 'failed to update user status'})
          }
        }
      )
    })

    it('user try to update (unauthorized)', function(done) {
      conn.request(
        {
          update: {uid: userId, verified: true }
        },
        userToken,
        (err, data) => {
          if (err) done(err)
          else if (data) {
            if (data.status === 403) {
              done();
            } else {
              done({error: `expect return status code 403, but received ${data.status}`})
            }
          } else {
            done({error: 'failed to update user status'})
          }
        }
      )
    })

    /* should implement security test, e.g admin cannot alternate user profile, username.... */

  })
}

module.exports = test