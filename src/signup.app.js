"use strict"

require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser');

const uuid = require('uuid/v1');
const { serializeUser } = require('./serializer');
const { generateToken } = require('./token');

const UserDB = require('@stormgle/userdb-api');

const userdb = new UserDB();
const app = express();

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))

const keys = {
  profile: process.env.KEY_PROFILE
};

function checkUser (req, res, next) {
  const username = req.body.username;
  userdb.findUser({ username }, (err, user) => {
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
      uid: uuid(), 
      login: { password }, 
      email: username, 
      policies
    }

    userdb.addUser( user, (err, user) => {
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

module.exports = { app, userdb }