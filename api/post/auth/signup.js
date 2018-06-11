"use strict"

const uuid = require('uuid/v1');
const { generateToken } = require('@stormgle/jtoken-util');
const { serializeUser, success } = require('../../../lib/serializer');
const { checkIfNewUser } = require('../../../lib/check');

function createUser (db) {
  return function (req, res, next) {
  
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({error: 'Bad request'});
      return;
    }

    const user = { 
      username, 
      roles: ['user'],
      uid: uuid(), 
      login: { password }, 
      profile: { email: [username] }
    }

    db.userdb.createUser( user, (err, user) => {
      if (err) {
        res.status(500).json({error: 'Internal error'});
      } else {
        req.user = user;          
        next();
      }
    });

  }
}

function serialize() {
  return serializeUser
}

function final() {
  return success
}

module.exports = [checkIfNewUser, createUser, generateToken, serialize, final]