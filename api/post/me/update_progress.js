"use strict"

const { verifyToken } = require('@stormgle/jtoken-util')

const secret = process.env.AUTH_KEY_ACCOUNT;

function update(db) {
  return function(req, res) {
    const uid = req.user.uid;
    const progress = req.body.progress;
    if (typeof progress === 'object' && Object.keys(progress).length > 0) {
      db.userdb.update(uid, { progress }, (err, data) => {
        if (err) {
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
