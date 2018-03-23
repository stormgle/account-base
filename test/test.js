"use strict"

require('dotenv').config()

const { Test, db } = require('./util')

db.launch();

const test = Test([

  'get/users/:username',

  'post/auth/signup',
  'post/auth/login',

  'post/me/update_profile',
  'post/me/update_password',

  'post/users/update'

])


describe('', function() {

  before(function(done) {
    this.timeout(500000);
    db.start(done);
  })

  after(function() {
    db.close();
  })

  test.run();
  
})