"use strict"

require('dotenv').config()

const { checkIfUserExist } = require('../../lib/check');
const { authenticateByPassword } = require('../../lib/authen')

function update(userdb) {
  return function (req, res) {
    const uid = req.user.uid;
    const login = req.body.login;
    if (typeof login === 'object' && Object.keys(login).length > 0) {
      userdb.update(uid, { login }, (err) => {
        if (err) {
          console.log(err)
          res.status(403).json(err)
        } else {
          res.status(200).json({status: 'updated success'});
        }
      })
    } else {
      res.status(304).json({status: 'not update'});
    }
  }
}

function authen() {
  return authenticateByPassword
}

module.exports = [checkIfUserExist, authen, update]