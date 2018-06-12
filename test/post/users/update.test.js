"use strict"

const cwd = process.cwd();
const { Connect, getAdminUserToken } = require(`${cwd}/test/util`)

const username = 'tester@users-update.com';
const password = '123456';

let userToken = {};
let userId = '';



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
      // create a new user used for testing
      const conn = new Connect({
        hostname: 'localhost',
        port: process.env.PORT_LOCAL_TEST,
        path: 'post/auth/signup'
      });

      signupUser(conn)
        .then(getUser)
        .then(() => {
          done()
      });
    })

    it('admin update user status', function(done) {
      conn.request(
        {
          update: {uid: userId, verified: true }
        },
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


  function signupUser(conn) {
    return new Promise((resolve, reject) => {
      conn.request(
        {username, password}, 
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
  
  function getUser() {
    return new Promise((resolve, reject) => {
      const conn = new Connect({
        hostname: 'localhost',
        port: process.env.PORT_LOCAL_TEST,
        path: `get/users/:username`
      });
      conn.request(
        username, 
        getAdminUserToken().admin,
        (err, data) => {
          if (err) reject(err)
          else if (data) {
            userId = data.body.user.uid;
            resolve()
          } else {
            reject({error: 'failed to signup new user for test'})
          }
        }
      )

      
    })
  }

  
}

module.exports = test