"use strict"

require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser');

const UserDB = require('@stormgle/userdb-api');

const uuid = require('uuid/v1');
const { serializeUser } = require('./lib/serializer');
const { generateToken } = require('./lib/token');
const { checkIfNewUser } = require('./lib/check');

const userdb = new UserDB();
const app = express();

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))

const keys = {
  profile: process.env.KEY_PROFILE
};

function createUser (req, res, next) {
  const { username, password } = req.body;
  
  userdb.getPolicy('user', (err, policies) => {

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
      role: 'user',
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


function respond(req, res) {
  res.status(200).json({user: req.user, tokens: req.tokens});
}

app.post('/signup', 
  checkIfNewUser(userdb, 'user'),
  createUser,
  generateToken(keys),
  serializeUser,
  respond
);

module.exports = { app, userdb }