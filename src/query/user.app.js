"use strict"

require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser');

const UserDB = require('@stormgle/userdb-api');

const { verifyToken } = require('../lib/token')
const { serializeQueriedUser } = require('../lib/serializer')

const secret = process.env.KEY_SUPER;

const userdb = new UserDB();


function queryUser(req, res, next) {
  const uid = req.user.uid;
  const username = req.body.username;

  if (username && username.length > 0) {
    userdb.queryUser({ username }, ((err, user) => {
      if (err) {
        res.status(400).send();
      } else {
        req.user = user;
        next();
      }
    }))
  } else {
    res.status(400).send();
  }
  
}

const app = express();

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))

app.post('/query/user', 
  verifyToken(secret), 
  queryUser,
  serializeQueriedUser,
  (req, res) => {
    res.status(200).json({ user: req.user });
  }
)

module.exports = { app, userdb }