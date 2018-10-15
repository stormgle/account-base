"use strict"

const jwt = require('jsonwebtoken');

const html = require('../../../../client/auth/0/html');
const style = require('../../../../client/auth/0/style');
const js = require('../../../../client/auth/0/script');

const secret = process.env.DELIGATE_KEY_VERIFY_EMAIL;

function authen(db, {title, style}) {
  return function(req, res) {
    const token = req.query.t;

    if (!token) {
      res.status(400).send();
      return
    }

    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        res.status(200).send(html.success.verify_email({title, style}));
      } else {
        res.status(200).send(html.failure.verify_email({title, style}));
      }
    });
  }
}

module.exports = [authen]