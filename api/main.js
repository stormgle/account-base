"use strict"

const express = require('express')
const bodyParser = require('body-parser');

const UserDB = require('@stormgle/userdb-api');

const userdb = new UserDB();
const app = express();

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))

app.useDbDriver = function(dbDriver) {
    userdb.use(dbDriver)
    return this;
  }

app.parseApi = function(api) {
  const patt = /^\w+/i;
  const method = `${api.match(patt)}`;          // convert to string
  const uri = `${api.replace(patt,"")}`;
  const includePath = `${api.replace(":","")}`;
  return { method, uri, includePath }
}

app.createFunction = function(method, uri, funcs, options) {
  const middleWares = funcs.map( (func) => {
    return func(userdb, options)
  })
  app[method](uri, ...middleWares)
  return app;
}

module.exports = app;