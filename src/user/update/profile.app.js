"use strict"

require('dotenv').config()

const { verifyToken } = require('../../lib/token')

const secret = process.env.KEY_ACCOUNT;

function update(userdb) {
  return function(req, res) {
    const uid = req.user.uid;
    const profile = req.body.profile;
    if (typeof profile === 'object' && Object.keys(profile).length > 0) {
      userdb.update(uid, { profile }, (err, data) => {
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
  return verifyToken(secret)
}


module.exports = [authen, update]
