"use strict"

require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser');

const UserDB = require('@stormgle/userdb-api');

const { verifyToken } = require('../../lib/token')

const secret = process.env.KEY_SUPER;

const userdb = new UserDB();

function updateUser(req, res) {
  const uid = req.user.uid;
  const update = req.body.update;

  if (typeof update === 'object' && update.uid) {
    userdb.update(uid, update, (err, data) => {
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

app.post('/admin/update/user', 
  verifyToken(secret), 
  updateUser
)

module.exports = { app, userdb }
