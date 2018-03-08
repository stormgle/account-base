"use strict"

module.exports = {
  signup: require('./signup.app'),
  login: require('./login.app'),
  update: {
    profile: require('/update/profile.app')
  }
}