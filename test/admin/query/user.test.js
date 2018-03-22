"use strict"

const TestServer = require('../../server')
const { Connect, getAdminUser } = require('../../util')

const server = {
  signup: new TestServer('user/signup'),
  user: new TestServer('admin/query/user')
}

let userToken = {};



function signupUser(conn) {
  return new Promise((resolve, reject) => {
    conn.request(
      {username: 'tester@query-user.com', password: '123456'}, 
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

function test() {

  return describe('admin/query/user', function(){

    const conn = new Connect({
      hostname: 'localhost',
      port: process.env.PORT_ADMIN_QUERY_USER,
      path: '/admin/query/user'
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
          .then(() => {
            server.signup.close();
            server.user.start(done);
          })

      });
    })

    after(function() {
      server.user.close();
    })

    it('admin query user with correct username', function(done) {
      conn.request(
        {
          username: 'tester@query-user.com'
        },
        getAdminUser().tokens.admin,
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

    it('admin query user with incorrect username', function(done) {
      conn.request(
        {
          username: 'incorrect.name@query-user.com'
        },
        getAdminUser().tokens.admin,
        (err, data) => {
          if (err) done(err)
          else if (data) {
            if (data.status === 404) {
              done();
            } else {
              done({error: `expect return status code 404, but received ${data.status}`})
            }
          } else {
            done({error: 'failed to update user status'})
          }
        }
      )
    })

    it('admin query user with empty username', function(done) {
      conn.request(
        {
          username: ''
        },
        getAdminUser().tokens.admin,
        (err, data) => {
          if (err) done(err)
          else if (data) {
            if (data.status === 400) {
              done();
            } else {
              done({error: `expect return status code 400, but received ${data.status}`})
            }
          } else {
            done({error: 'failed to update user status'})
          }
        }
      )
    })

    it('user query a user (unauthorized)', function(done) {
      conn.request(
        {
          username: 'tester@query-user.com'
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

  })
}

module.exports = test