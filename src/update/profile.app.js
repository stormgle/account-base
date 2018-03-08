"use strict"

require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser');

const UserDB = require('@stormgle/userdb-api');

const { verifyToken } = require('../lib/token')

const secret = process.env.KEY_ACCOUNT;

const userdb = new UserDB();

function success(req, res) {
  const uid = req.user.uid;
  const profile = req.body.profile;
  userdb.get
  userdb.update(uid, { profile }, (err, data) => {
    if (err) {
      console.log(err)
      res.status(403).json(err)
    } else {
      console.log(data)
      res.status(200).json({status: 'success'});
    }
  })
}

const app = express();

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))

app.post('/update/profile', 
  verifyToken(secret), 
  success
)

module.exports = { app, userdb }
