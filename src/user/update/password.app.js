"use strict"

require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')

const UserDB = require('@stormgle/userdb-api')

const { checkIfUserExist } = require('../../lib/check');
const { authenticateByPassword } = require('../../lib/authen')

const userdb = new UserDB()
const app = express()

function success(req, res) {
  const uid = req.user.uid;
  const login = req.body.login;
  if (typeof login === 'object' && Object.keys(login).length > 0) {
    userdb.update(uid, { login }, (err) => {
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

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))

app.post('/user/update/password',
  checkIfUserExist(userdb),
  authenticateByPassword,
  success
)

module.exports = { app, userdb }