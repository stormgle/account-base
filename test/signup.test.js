"use strict"

const Connect = require('./test.util')

describe('api/signup', function(){

  const conn = new Connect({
    hostname: 'localhost',
    port: 3001,
    path: '/signup'
  });

  before(function(done) {
    conn.on('online', done);
    conn.tryConnect();
  })

  after(function() {
    console.log('    test completed: api/signup');
    conn.closeServer();
  })

  it('create new user', function(done) {
    conn.request(
      {username: 'tester@test-team.com', password: '123456'}, 
      (err, data) => {
        if (err) done(err)
        else if (data && data.status === 200 && data.body.user && data.body.tokens) {
          done()
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

  it('create user with empty email', function(done) {
    conn.request(
      {username: '', password: '123456'}, 
      (err, data) => {
        if (err) done(err)
        else 
        if (data && data.status === 403 && data.body.error === 'Invalidated Username or Password') {
          done()
        } else {
          done({error: 'server should reject invalid credential'})
        }
      }
    )
  })

  it('create user with undefined email', function(done) {
    conn.request(
      {username: undefined, password: '123456'}, 
      (err, data) => {
        if (err) done(err)
        else 
        if (data && data.status === 403 && data.body.error === 'Invalidated Username or Password') {
          done()
        } else {
          done({error: 'server should reject invalid credential'})
        }
      }
    )
  })

  it('create user with null email', function(done) {
    conn.request(
      {username: null, password: '123456'}, 
      (err, data) => {
        if (err) done(err)
        else 
        if (data && data.status === 403 && data.body.error === 'Invalidated Username or Password') {
          done()
        } else {
          done({error: 'server should reject invalid credential'})
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
          done({error: 'server should reject invalid credential'})
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
          done({error: 'server should reject invalid credential'})
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
          done({error: 'server should reject invalid credential'})
        }
      }
    )
  })

})
