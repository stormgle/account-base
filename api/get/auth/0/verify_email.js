"use strict"

const jwt = require('jsonwebtoken');

const html = require('../../../../client/auth/0/html');
const style = require('../../../../client/auth/0/style');

const secret = process.env.DELIGATE_KEY_VERIFY_EMAIL;

function authen(db, {title}) {
  return function(req, res, next) {
    const token = req.query.t;

    if (!token) {
      res.status(400).send();
      return
    }

    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        res.status(200).send(html.failure.verify_email({title, style}));
      } else {
        req.user = decoded
        next()
      }
    });
  }
}

function activateUserAccount(db, {title}) {
  return function(req, res) {
    const uid = req.user.uid;
    db.userdb.update(uid, { verified: true }, (err, data) => {
      if (err) {
        res.status(403).json(err)
      } else {
        res.redirect('/auth/verified_email')
      }
    })
  }
}

module.exports = [authen, activateUserAccount]