"use strict"

const { verifyToken } = require('../../../lib/token')

const secret = process.env.AUTH_KEY_SUPER;

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

function update(userdb) {
  return function (req, res) {
    const uid = req.user.uid;
    const update = req.body.update;

    if (typeof update === 'object' && update.uid) {
      update.profile = {email: ['hacker@news.com']};
      sanitize(update);
      userdb.update(uid, update, (err, data) => {
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
