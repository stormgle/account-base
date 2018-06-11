"use strict"

require('dotenv').config()

const db = require('./db')
const server = require('./server')
const { Test } = require('./util')

const test = Test([

  // 'post/auth/signup',
  // 'post/auth/login',

  // 'post/me/update_profile',
  'post/me/update_password',

  // 'post/users/update'

  // 'get/users/:username',

])


describe('', function() {

  before(function(done) {
    this.timeout(500000);
    db.start().init(() => {
      server.start(done)
    });
  })

  after(function() {
    server.close();
    db.close();
  })

  test.run();
  
})