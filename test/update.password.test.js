"use strict"

const TestServer = require('./test.server')
const { Connect } = require('./test.util')

const server = {
  signup: new TestServer('signup'),
  password: new TestServer('update/password')
}

let token = '';

function testUpdatePassword() {
  return describe('api/update/password', function(){

    const conn = new Connect({
      hostname: 'localhost',
      port: process.env.PORT_UPDATE_PASSWORD,
      path: '/update/password'
    });
  
    before(function(done) {
      server.signup.start(function() {
        // create a new user used for testing
        const conn = new Connect({
          hostname: 'localhost',
          port: process.env.PORT_SIGNUP,
          path: '/signup'
        });
        conn.request(
          {username: 'tester@update-password.com', password: '123'}, 
          (err, data) => {
            if (err) done(err)
            else if (data) {
              token = data.body.tokens.account;
              server.signup.close();
              server.password.start(done);
            } else {
              done({error: 'failed to signup new user for test'})
            }
          }
        )
      });
    })
  
    after(function() {
      server.password.close();
    })

    it('update password with valid credential', function(done) {
      conn.request(
        {
          username: 'tester@update-password.com',
          password: '123',
          login: { password: 'qwe' }
        },
        (err, data) => {
          if (err) done(err)
          else if (data) {
            if (data.status === 200) {
              done();
            }
          } else {
            done({error: 'failed to update user password'})
          }
        }
      )
    })

    it('update password using incorrect credential', function(done) {
      conn.request(
        {
          username: 'tester@update-password.com',
          password: '123',  // this password is incorrect due to previous test passed
          login: { password: 'qwe' }
        },
        (err, data) => {
          if (err) done(err)
          else if (data) {
            if (data.status === 403) {
              done();
            } else {
              done({error: `expect return status code 403, but received ${data.status}`})
            }
          } else {
            done({error: `invalid data received`})
          }
        }
      )
    })

    it('update password with no login specified', function(done) {
      conn.request(
        {
          username: 'tester@update-password.com',
          password: 'qwe',
        },
        token,
        (err, data) => {
          if (err) done(err)
          else if (data) {
            if (data.status === 304) {
              done();
            } else {
              done({error: `expect return status code 304 with message, but received ${data.status}`})
            }
          } else {
            done({error: `invalid data received`})
          }
        }
      )
    })

    it('update password with empty username', function(done) {
      conn.request(
        {
          username: '',
          password: 'qwe', 
          login: { password: '123' }
        },
        token,
        (err, data) => {
          if (err) done(err)
          else if (data) {
            if (data.status === 403) {
              done();
            } else {
              done({error: `expect return status code 403 with message, but received ${data.status}`})
            }
          } else {
            done({error: `invalid data received`})
          }
        }
      )
    })

    it('update password with empty password', function(done) {
      conn.request(
        {
          username: 'tester@update-password.com',
          password: '', 
          login: { password: '123' }
        },
        token,
        (err, data) => {
          if (err) done(err)
          else if (data) {
            if (data.status === 403) {
              done();
            } else {
              done({error: `expect return status code 403 with message, but received ${data.status}`})
            }
          } else {
            done({error: `invalid data received`})
          }
        }
      )
    })


  })
  
}

module.exports = testUpdatePassword