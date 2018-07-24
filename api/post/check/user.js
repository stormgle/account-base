"use strict"

function queryUser(db) {
  return function (req, res, next) {
    const username = req.body.username;

    if (username && username.length > 0) {
      db.userdb.queryUser({ username }, ((err, user) => {
        if (err) {
          res.status(400).send();
        } else {
          if (user) {
            req.user = {
              email: user.profile.email,
              displayName: user.profile.displayName
            };
            next();
          } else {
            res.status(404).json('resource not found')
          }      
        }
      }))
    } else {
      res.status(400).send();
    }
  }
}


function final() {
  return function(req, res) {
    res.status(200).json({ user: req.user });
  }
}

module.exports = [queryUser, final]