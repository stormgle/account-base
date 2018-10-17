"use strict"

const jwt = require('jsonwebtoken');

const html = require('../../../../client/auth/0/html');
const style = require('../../../../client/auth/0/style');
const js = require('../../../../client/auth/0/script');

const secret = process.env.DELIGATE_KEY_FORGOT_PASSWORD;

function authen() {
  return function(req, res, next) {
    const token = req.query.t;

    if (!token) {
      res.status(400).send();
      return
    }

    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        res.status(403).send();
      } else {
        req.user = decoded;
        next();
      }
    });
  }
}

function renderHTML(db, {title, endPoint}) {
  return function(req, res) {
    const token = req.query.t;
    const script = js.form({token, endPoint});
    res.status(200).send(html.form({ title, style, script }))
  }
}

module.exports = [authen, renderHTML]