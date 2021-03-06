"use strict"

const { verifyToken } = require('@stormgle/jtoken-util');

const html = require('../../../client/auth/0/html');
const style = require('../../../client/auth/0/style');

const secret = process.env.DELIGATE_KEY_FORGOT_PASSWORD;

function authen() {
  return verifyToken(secret)
}

function update(db, {title, service, redirect}) {
  return function(req, res) {
    const uid = req.user.uid;
    const login = req.body.login;

    if (login && login.password) {
      db.userdb.update(uid, { login }, (err, data) => {
        if (err) {
          console.log(err)
          res.status(200).send(html.resetPassword.failure({title, style}));
        } else {
          res.status(200).send(html.resetPassword.success({title, service, redirect, style}));
        }
      })
    } else {
      res.status(304).json({status: 'not update'});
    }

  }
}

module.exports = [authen, update]