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
  if (typeof profile === 'object' && Object.keys(profile).length > 0) {
    userdb.update(uid, { profile }, (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json(err)
      } else {
        res.status(200).json({status: 'updated success'});
      }
    })
  } else {
    res.status(304).json({status: 'not update'});
  }
  
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
