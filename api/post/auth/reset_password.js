"use strict"

const { verifyToken } = require('../../../lib/token');

const html = require('../../../client/auth/0/html');
const style = require('../../../client/auth/0/style');

const secret = process.env.DELIGATE_KEY_FORGOT_PASSWORD;

function authen() {
  return verifyToken(secret)
}

function update(userdb, {title, service, redirect}) {
  return function(req, res) {
    const uid = req.user.uid;
    const login = req.body.login;

    if (login && login.password) {
      userdb.update(uid, { login }, (err, data) => {
        if (err) {
          res.status(403).send();
        } else {
          res.status(200).send(html.success({title, service, redirect, style}));
        }
      })
    } else {
      res.status(304).json({status: 'not update'});
    }

  }
}

module.exports = [authen, update]