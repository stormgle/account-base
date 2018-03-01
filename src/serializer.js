"use strict"

function serializeUser (req, res, next) {
  delete req.user.login
  delete req.user.policies
  next();
}

module.exports = { serializeUser }