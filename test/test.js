"use strict"

require('dotenv').config()

const { db } = require('./test.util')

const testSignup = require('./signup.test')
const testLogin = require('./login.test')
const testUpdateProfile = require('./update.profile.test')

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
  

})