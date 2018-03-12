"use strict"

const jwt = require('jsonwebtoken');

function generateToken(keys) {
  return function(req, res, next) {
    const tokens = {};
    const policies = req.user.policies;
    for(let policy in policies) {    
      if (keys[policy]) {
        const token = jwt.sign({
          uid: req.user.uid,
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

function verifyToken(key) {
  return function(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader === 'undefined') {
      res.status(403).json({error: 'unauthorized'});
      return
    }

    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;

    jwt.verify(token, key, function(err, decoded) {
      if (err) {
        res.status(403).json({error: 'unauthorized'});
      } else {
        req.user = decoded;
        next();
      }
    });
    
  }
}

module.exports = { generateToken, verifyToken }