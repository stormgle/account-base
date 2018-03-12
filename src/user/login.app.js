"use strict"

require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser');

const UserDB = require('@stormgle/userdb-api');

const { checkIfUserExist } = require('../lib/check');
const { authenticateByPassword } = require('../lib/authen')
const { serializeUser, success } = require('../lib/serializer');
const { generateToken } = require('../lib/token');

const userdb = new UserDB();
const app = express();

const keys = {
  account: process.env.KEY_ACCOUNT,
  super: process.env.KEY_SUPER
};

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))

app.post('/user/login', 
  checkIfUserExist(userdb),
  authenticateByPassword,
  generateToken(keys),
  serializeUser,
  success
);

module.exports = { app, userdb }