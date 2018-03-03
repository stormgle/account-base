"use strict"

require('dotenv').config()

const testSignup = require('./signup.test')
const { db } = require('./test.util')

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

})