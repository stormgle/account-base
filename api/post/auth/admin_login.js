"use strict"

const { generateToken } = require('@stormgle/jtoken-util');
const { checkIfUserExist } = require('../../../lib/check');
const { authenticateByPassword } = require('../../../lib/authen')
const { serializeUser, success } = require('../../../lib/serializer');

function checkRole() {
  return function (req, res, next) {
    const user = req.user;
    if (user.roles.indexOf('admin') === -1) {
      res.status(403).json({err: 'not enough permission'})
    } else {
      next()
    }
  }
}

function authen() {
  return authenticateByPassword
}

function serialize() {
  return serializeUser
}

function final() {
  return success
}

module.exports = [checkIfUserExist, checkRole, authen, generateToken, serialize, final]