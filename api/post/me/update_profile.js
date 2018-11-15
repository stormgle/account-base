"use strict"

const { verifyToken } = require('@stormgle/jtoken-util')

const secret = process.env.AUTH_KEY_ACCOUNT;

function update(db) {
  return function(req, res) {
    const uid = req.user.uid;
    const profile = req.body.profile;
    if (typeof profile === 'object' && Object.keys(profile).length > 0) {
      // fix issue of empty field
      for (let prop in profile) {
        if (typeof profile[prop] === 'string' && profile[prop].length === 0) {
          profile[prop]  = 'N/A'
        }
      }
      if (profile.email && profile.email.length > 0) {
        profile.email = profile.email.map( email => email.toLowerCase().trim())
      }
      db.userdb.update(uid, { profile }, (err, data) => {
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
