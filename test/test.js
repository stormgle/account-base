"use strict"

require('dotenv').config()

const { db } = require('./test.util')

const testSignup = require('./user/signup.test')
const testLogin = require('./user/login.test')

const testUpdateProfile = require('./user/update/profile.test')
const testUpdatePassword = require('./user/update/password.test')

const testQueryUser = require('./admin/query/user.test')
const testUpdateUser = require('./admin/update/user.test')

db.launch();

describe('test user-services api', function() {

  before(function(done) {
    this.timeout(500000);
    db.start(done);
  })

  after(function() {
    db.close();
  })

  /* test api */
  testSignup()

  testLogin()

  testUpdateProfile()
  
  testUpdatePassword()

  testQueryUser()

  testUpdateUser()

  
})