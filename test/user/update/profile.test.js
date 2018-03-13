"use strict"

const TestServer = require('../../test.server')
const { Connect } = require('../../test.util')

const server = {
  signup: new TestServer('user/signup'),
  profile: new TestServer('user/update/profile')
}

let token = '';

function test() {
  return describe('user/update/profile', function(){

    const conn = new Connect({
      hostname: 'localhost',
      port: process.env.PORT_USER_UPDATE_PROFILE,
      path: '/user/update/profile'
    });
  
    before(function(done) {
      server.signup.start(function() {
        // create a new user used for testing
        const conn = new Connect({
          hostname: 'localhost',
          port: process.env.PORT_USER_SIGNUP,
          path: '/user/signup'
        });
        conn.request(
          {username: 'tester@update-profile.com', password: '123456'}, 
          (err, data) => {
            if (err) done(err)
            else if (data) {
              token = data.body.tokens.account;
              server.signup.close();
              server.profile.start(done);
            } else {
              done({error: 'failed to signup new user for test'})
            }
          }
        )
      });
    })
  
    after(function() {
      server.profile.close();
    })

    it('update profile using correct bearer token', function(done) {
      conn.request(
        {
          profile: { displayName: 'Tester' }
        },
        token,
        (err, data) => {
          if (err) done(err)
          else if (data) {
            if (data.status === 200) {
              done();
            } else {
              done({error: `expect return status code 200, but received ${data.status}`})
            }
          } else {
            done({error: 'failed to update user profile'})
          }
        }
      )
    })

    it('update profile using incorrect bearer token', function(done) {
      conn.request(
        {
          profile: { displayName: 'Tester' }
        },
        'invalid-bearer-token',
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

    it('update with no profile specified', function(done) {
      conn.request(
        {},
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

    it('update profile with empty value', function(done) {
      conn.request(
        {
          profile: {}
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


  })
  
}

module.exports = test