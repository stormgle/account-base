"use strict"

const uuid = require('uuid/v1');
const { serializeUser, success } = require('../../lib/serializer');
const { generateToken } = require('../../lib/token');
const { checkIfNewUser } = require('../../lib/check');

function createUser (userdb) {
  return function (req, res, next) {
  
    const { username, password } = req.body;

    const roles = ['user'];

    userdb.getPolicy(roles, (err, policies) => {

      if (err) {
        res.status(500).json({error: 'Internal error'});
        return;
      }

      if (!username || !password) {
        res.status(403).json({error: 'Invalidated Username or Password'});
        return;
      }

      const user = { 
        username, 
        roles: roles,
        uid: uuid(), 
        login: { password }, 
        policies,
        profile: { email: [username] }
      }

      userdb.createUser( user, (err, user) => {
          if (err) {
            res.status(500).json({error: 'Internal error'});
          } else {
            req.user = user;
            next();
          }
        });
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