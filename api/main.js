"use strict"

const express = require('express')
const bodyParser = require('body-parser');

const UserDB = require('@stormgle/userdb-api');

const userdb = new UserDB();
const app = express();

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))

app.useDbDriver = function (dbDriver) {
    userdb.use(dbDriver)
    return this;
  }

app.createFunction = function (method, uri, funcs) {
  const middleWares = funcs.map( (func) => {
    return func(userdb)
  })
  app[method](uri, ...middleWares)
  return app;
}

module.exports = app;