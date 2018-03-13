"use strict"

function checkIfNewUser(userdb) {
  return function (req, res, next) {
    const username = req.body.username;
    const role = 'user'
    if (!username) {
      res.status(403).json({error: 'Invalidated Username or Password'});
      return;
    }
    userdb.queryUser({username}, (err, user) => {
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

function checkIfUserExist(userdb) {
  return function (req, res, next) {
    const username = req.body.username;
    const role = req.body.role;
    if (!username) {
      res.status(403).json({error: 'Invalidated Username or Password'});
      return;
    }
    userdb.queryUser({username}, (error, user) => {
        if (error) {
          res.status(403).json(error);
        } else {
          if (user) {
            req.user = user;
            next();
          } else {
            res.status(403).json({error: 'User is not registerd'});
          }
        }
      })
  }
}

module.exports = { checkIfNewUser, checkIfUserExist}