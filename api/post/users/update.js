"use strict"

const { verifyToken } = require('@stormgle/jtoken-util')

const secret = process.env.AUTH_KEY_ADMIN;

function sanitize(update) {
  const sanList = [
    'username', 'roles', 'profile', 'login', 'policies', 'createdAt', 'updatedAt'
  ]
  sanList.forEach( (prop) => {
    if (update[prop]) {
      delete update[prop]
    }
  })

  return update;
}

function update(db) {
  return function (req, res) {
    const uid = req.user.uid;
    const update = req.body.update;

    if (typeof update === 'object' && update.uid) {
      sanitize(update);
      db.userdb.update(uid, update, (err, data) => {
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
  return verifyToken(secret);
}

module.exports = [authen, update]
