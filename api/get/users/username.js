"use strict"

const { verifyToken } = require('@stormgle/jtoken-util')
const { serializeQueriedUser } = require('../../../lib/serializer')

const secret = process.env.AUTH_KEY_ADMIN;

function queryUser(db) {
  return function (req, res, next) {
    const uid = req.user.uid;
    const username = req.params.username;

    if (username && username.length > 0) {
      db.userdb.queryUser({ username }, ((err, user) => {
        if (err) {
          res.status(400).send();
        } else {
          if (user) {
            req.user = user;
            next();
          } else {
            res.status(404).json('resource not found')
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