"use strict"

const { generateToken } = require('@stormgle/jtoken-util');
const { checkIfUserExist } = require('../../../lib/check');
const { authenticateByPassword } = require('../../../lib/authen')
const { serializeUser, success } = require('../../../lib/serializer');

function authen() {
  return authenticateByPassword
}

function serialize() {
  return serializeUser
}

function final() {
  return success
}

module.exports = [checkIfUserExist, authen, generateToken, serialize, final]