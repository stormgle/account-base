"use strict"

require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser');

const uuid = require('uuid/v1');
const { serializeUser } = require('./serializer');
const { generateToken } = require('./token');


const app = express();

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))

const keys = {
  profile: process.env.KEY_PROFILE
};

/* simulate USERS API */
const POLICY = {
  get(role, callback) {
    callback(null,{'profile': true});
  }
};

const userDB = {}
const USERS = {
  findUser({ username = null, uid = null }, callback) {
    if (username && userDB[username]) {
      callback(null, userDB[username]);
    } else {
      callback(null, null);
    }
  },
  addUser(user, callback) {
    userDB[user.username] = user;
    callback(null, user)
  }
}
/* end simulate api */

function checkUser (req, res, next) {
  const username = req.body.username;
  USERS.findUser({ username }, (err, user) => {
      if (err) {
        res.status(500).json({error: 'Internal error'});
      } else {
        if (user) {
          res.status(403).json({error: 'Email is already registered'});
        } else {
          next();
        }
      }
    })
}

function createUser (req, res, next) {
  const { username, password } = req.body;
  
  POLICY.get('user', (err, policies) => {

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
      uid: uuid(), 
      login: { password }, 
      email: username, 
      policies
    }

    USERS.addUser( user, (err, user) => {
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
  checkUser,
  createUser,
  generateToken(keys),
  serializeUser,
  respond
);

module.exports = app;