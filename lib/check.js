"use strict"

function checkIfNewUser(db) {
  return function (req, res, next) {
    const username = req.body.username.toLowerCase().trim();
    if (!username) {
      res.status(400).json({error: 'Bad request'});
      return;
    }
    db.userdb.queryUser({username}, (err, user) => {
        if (err) {
          res.status(403).json({error: 'Access database failed'});
        } else {
          if (user) {
            res.status(403).json({error: 'Email is already registered'});
          } else {
            next();
          }
        }
      })
  }
}

function checkIfUserExist(db) {
  return function (req, res, next) {
    const username = req.body.username.toLowerCase().trim();
    if (!username) {
      res.status(400).json({error: 'Missing Username'});
      return;
    }
    db.userdb.queryUser({username}, (error, user) => {
        if (error) {
          res.status(403).json(error);
        } else {
          if (user) {
            req.user = user;
            next();
          } else {
            res.status(403).json({error: 'User is not registered'});
          }
        }
      })
  }
}

module.exports = { checkIfNewUser, checkIfUserExist}