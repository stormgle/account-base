"use strict"

const jwt = require('jsonwebtoken');

function generateToken(keys) {
  return function(req, res, next) {
    const tokens = {};
    const policies = req.user.policies;
    for(let policy in policies) {    
      if (keys[policy]) {
        const token = jwt.sign({
          // uid: req.user.uid,
          username: req.user.username
        }, keys[policy], {
          expiresIn: "14 days"
        });
        tokens[policy] = token;
      }   
    }
    req.tokens = tokens;
    next();
  }
}

module.exports = { generateToken }