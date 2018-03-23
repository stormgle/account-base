"use strict"

const cwd = process.cwd();
const TestServer = require(`${cwd}/test/server`)
const { Connect, getAdminUser } = require(`${cwd}/test/util`)

let userToken = {};

const username = 'tester@team.com';
const password = '123456';

function signupUser(conn) {
  return new Promise((resolve, reject) => {
    conn.request(
      { username, password }, 
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

function test(path) {

  const server = {
    signup: new TestServer('post/auth/signup'),
    test: new TestServer(path)
  }

  const patt = /^\w+/i;
  const method = `${path.match(patt)}`.toUpperCase();
  const uri = path.replace(patt,"");


  return describe(`${method} ${uri}`, function(){

    const conn = new Connect({
      hostname: 'localhost',
      port: process.env.PORT_USERS_USERNAME,
      path
    });

    before(function(done) {
      server.signup.start(function() {
        // create a new user used for testing
        const conn = new Connect({
          hostname: 'localhost',
          port: process.env.PORT_AUTH_SIGNUP,
          path: 'post/auth/signup'
        });

        signupUser(conn)
          .then(() => {
            server.signup.close();
            server.test.start(done);
          })

      });
    })

    after(function() {
      server.test.close();
    })

    it('admin query user with correct username', function(done) {
      conn.request(
        username,
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
        'incorrect-username@test.com',
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

    it('user query a user (unauthorized)', function(done) {
      conn.request(
        username,
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