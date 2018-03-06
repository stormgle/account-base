"use strict"

function checkIfNewUser(userdb, role) {
  return function (req, res, next) {
    const username = req.body.username;
    if (!username) {
      res.status(403).json({error: 'Invalidated Username or Password'});
      return;
    }
    userdb.findUser({ username, role }, (err, user) => {
        if (err) {
          res.status(500).json({error: 'Internal error'});
        } else {
          if (user && Object.keys(user).length > 0) {
            res.status(403).json({error: 'Email is already registered'});
          } else {
            next();
          }
        }
      })
  }
}

function checkIfUserExist(userdb, role) {
  return function (req, res, next) {
    const username = req.body.username;
    if (!username) {
      res.status(403).json({error: 'Invalidated Username or Password'});
      return;
    }
    userdb.findUser({ username, role }, (err, user) => {
        if (err) {
          res.status(500).json({error: 'Internal error'});
        } else {
          if (user && Object.keys(user).length > 0) {
            next();
          } else {
            res.status(403).json({error: 'User is not registerd'});
          }
        }
      })
  }
}

module.exports = { checkIfNewUser, checkIfUserExist}