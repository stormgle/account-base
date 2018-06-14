"use strict"

require('dotenv').config()

const express = require('express')
const cors = require('cors')

const api = require('../api/main')

const DatabaseAbstractor = require("database-abstractor")
const userdb = new DatabaseAbstractor();

const dynamodb = require('@stormgle/userdb-dynamodb-driver')

userdb.use(dynamodb({ 
  region : 'us-west-2', 
  endpoint : `${process.env.DB_HOST}:${process.env.DB_PORT}`
}));

const PORT = process.env.PORT_LOCAL_TEST || 3100;

const forgotPassword = {
  onSuccess: (token) => console.log(token.token),
  onFailure: (err) => console.log(err)
};

const form = {
  title: 'Auth-0', 
  body:'Hello from Auth-0 / ',
  endPoint: `http://localhost:${PORT}/auth/reset_password`,
  redirect: {
    success: `http://localhost:${PORT}/`
  }
};

const reset = {
  title: 'Auth-0', 
  service: 'Example',
  redirect: `http://localhost:${PORT}/`
}

api.useDatabase({ userdb })
   .generateFunctions({forgotPassword, form, reset});

const app = express();

app
  .use(cors())
  .use('/', api)

module.exports =app;

  
