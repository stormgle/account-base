"use strict"

require('dotenv').config()

const { Test, db } = require('./util')

db.launch();

const test = Test([

  'user/signup',
  'user/login',

  'user/update/profile',
  'user/update/password',

  'admin/query/user',
  'admin/update/user'

])


describe('user-services api', function() {

  before(function(done) {
    this.timeout(500000);
    db.start(done);
  })

  after(function() {
    db.close();
  })

  test.run();
  
})