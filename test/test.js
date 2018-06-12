"use strict"

require('dotenv').config()

const db = require('./db')
const userdb = require('../scripts/userdb')

const server = require('./server')
const { Test } = require('./util')

const test = Test([

  'post/auth/signup',
  'post/auth/login',

  'post/me/update_profile',
  'post/me/update_password',
  
  'get/users/:username',

  'post/users/update'

])


describe('', function() {

  before(function(done) {
    this.timeout(500000);
    db.start().add({userdb}).init(() => {
      server.start(done)
    });
  })

  after(function() {
    server.close();
    db.close();
  })

  test.run();
  
})