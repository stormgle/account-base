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

api.useDatabase({ userdb })

const app = express();

app
  .use(cors())
  .use('/', api)

module.exports =app;

  
