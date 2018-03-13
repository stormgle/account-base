"use strict"

require('dotenv').config()

const { checkIfUserExist } = require('../lib/check');
const { authenticateByPassword } = require('../lib/authen')
const { serializeUser, success } = require('../lib/serializer');
const { generateToken } = require('../lib/token');


const keys = {
  account: process.env.KEY_ACCOUNT,
  super: process.env.KEY_SUPER
};

function authen() {
  return authenticateByPassword
}

function genToken() {
  return generateToken(keys);
}

function serialize() {
  return serializeUser
}

function final() {
  return success
}

module.exports = [checkIfUserExist, authen, genToken, serialize, final]