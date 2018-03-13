"use strict"

function authenticateByPassword(req, res, next) {
  const user = req.user;
  const password = req.body.password;
  if (user.verifyPassword(password)) {
    next();
  } else {
    res.status(403).json({error: 'Invalidated Username or Password'});
  }
}

module.exports = { authenticateByPassword }
