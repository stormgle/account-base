"use strict"

const cwd = process.cwd();
const { Connect, getAdminUserToken } = require(`${cwd}/test/util`)

let userToken = {};

const username = 'tester.testSignup@team.com';
const password = '123456';

function signupUser(conn) {
  return new Promise((resolve, reject) => {
    conn.request(
      { username, password }, 
      (err, data) => {
        if (err) reject(err)
        else if (data) {
          userToken = data.body.tokens.account;
          resolve()
        } else {
          reject({error: 'failed to signup new user for test'})
        }
      }
    )
  })
}

function test(path) {


  const patt = /^\w+/i;
  const method = `${path.match(patt)}`.toUpperCase();
  const uri = path.replace(patt,"");


  return describe(`${method} ${uri}`, function(){

    const conn = new Connect({
      hostname: 'localhost',
      port: process.env.PORT_LOCAL_TEST,
      path
    });

    before(function(done) {
      const conn = new Connect({
        hostname: 'localhost',
        port: process.env.PORT_LOCAL_TEST,
        path: 'post/auth/signup'
      });
      signupUser(conn)
        .then(() => {
          done();
        })
    })

    it('admin query user with correct username', function(done) {
      conn.request(
        username,
        getAdminUserToken().admin,
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
        getAdminUserToken().admin,
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