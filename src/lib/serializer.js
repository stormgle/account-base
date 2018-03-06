"use strict"

function serializeUser(req, res, next) {
  delete req.user.uid
  delete req.user.login
  delete req.user.policies
  for (let props in req.user) {
    if (typeof req.user[props] === 'function') {
      delete req.user[props]
    }
  }
  next();
}

function success(req, res) {
  res.status(200).json({user: req.user, tokens: req.tokens});
}

module.exports = { serializeUser, success }