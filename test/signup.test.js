"use strict"

const TestServer = require('./test.server')
const { Connect } = require('./test.util')

const server = new TestServer('signup');

function testSignup () {
  return describe('api/signup', function(){

    const conn = new Connect({
      hostname: 'localhost',
      port: process.env.PORT_SIGNUP,
      path: '/signup'
    });
  
    before(function(done) {
      server.start(done);
    })
  
    after(function() {
      server.close();
    })
  
    it('create new user', function(done) {
      conn.request(
        {username: 'tester@test-team.com', password: '123456'}, 
        (err, data) => {
          if (err) done(err)
          else if (data) {
            if (data.status >= 500) {
              done({error: `${data.status} - internal server error`})
            } 
            else if (data.status === 200 && data.body.user && data.body.tokens) {
              done()
            } else {
              done({error: `unexpected http response status: ${data.status}`})
            }
          } else {
            done({error: 'invalid return data'})
          }
        }
      )
    })
  
    it('create duplicated user', function(done) {
      conn.request(
        {username: 'tester@test-team.com', password: '123456'}, 
        (err, data) => {
          if (err) done(err)
          else 
          if (data && data.status === 403 && data.body.error === 'Email is already registered') {
            done()
          } else {
            done({error: 'server should reject duplicated user'})
          }
        }
      )
    })
  
    it('create user with empty username', function(done) {
      conn.request(
        {username: '', password: '123456'}, 
        (err, data) => {
          if (err) done(err)
          else 
          if (data && data.status === 403 && data.body.error === 'Invalidated Username or Password') {
            done()
          } else {
            done({error: `unexpected http response status: ${data.status}, expect 403`})
          }
        }
      )
    })
  
    it('create user with undefined username', function(done) {
      conn.request(
        {username: undefined, password: '123456'}, 
        (err, data) => {
          if (err) done(err)
          else 
          if (data && data.status === 403 && data.body.error === 'Invalidated Username or Password') {
            done()
          } else {
            done({error: `unexpected http response status: ${data.status}, expect 403`})
          }
        }
      )
    })
  
    it('create user with null username', function(done) {
      conn.request(
        {username: null, password: '123456'}, 
        (err, data) => {
          if (err) done(err)
          else 
          if (data && data.status === 403 && data.body.error === 'Invalidated Username or Password') {
            done()
          } else {
            done({error: `unexpected http response status: ${data.status}, expect 403`})
          }
        }
      )
    })
  
    it('create user with empty password', function(done) {
      conn.request(
        {username: 'newuser@test-team.com', password: ''}, 
        (err, data) => {
          if (err) done(err)
          else 
          if (data && data.status === 403 && data.body.error === 'Invalidated Username or Password') {
            done()
          } else {
            done({error: `unexpected http response status: ${data.status}, expect 403`})
          }
        }
      )
    })
  
    it('create user with undefined password', function(done) {
      conn.request(
        {username: 'newuser@test-team.com', password: undefined}, 
        (err, data) => {
          if (err) done(err)
          else 
          if (data && data.status === 403 && data.body.error === 'Invalidated Username or Password') {
            done()
          } else {
            done({error: `unexpected http response status: ${data.status}, expect 403`})
          }
        }
      )
    })
  
    it('create user with null password', function(done) {
      conn.request(
        {username: 'newuser@test-team.com', password: null}, 
        (err, data) => {
          if (err) done(err)
          else 
          if (data && data.status === 403 && data.body.error === 'Invalidated Username or Password') {
            done()
          } else {
            done({error: `unexpected http response status: ${data.status}, expect 403`})
          }
        }
      )
    })
  
  })
}

module.exports = testSignup
