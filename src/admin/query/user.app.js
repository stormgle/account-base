"use strict"

require('dotenv').config()

const { verifyToken } = require('../../lib/token')
const { serializeQueriedUser } = require('../../lib/serializer')

const secret = process.env.KEY_SUPER;

function queryUser(userdb) {
  return function (req, res, next) {
    const uid = req.user.uid;
    const username = req.body.username;

    if (username && username.length > 0) {
      userdb.queryUser({ username }, ((err, user) => {
        if (err) {
          res.status(400).send();
        } else {
          if (user) {
            req.user = user;
            next();
          } else {
            res.status(404).json('not found')
          }      
        }
      }))
    } else {
      res.status(400).send();
    }
  }
}

function authen() {
  return verifyToken(secret);
}

function serializer() {
  return serializeQueriedUser;
}

function final() {
  return function(req, res) {
    res.status(200).json({ user: req.user });
  }
}

module.exports = [authen, queryUser, serializer, final]