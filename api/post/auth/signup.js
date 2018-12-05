"use strict"

const uuid = require('uuid/v1');
const jwt = require('jsonwebtoken')
const { generateToken } = require('@stormgle/jtoken-util');
const { serializeUser, success } = require('../../../lib/serializer');
const { checkIfNewUser } = require('../../../lib/check');

const secret = process.env.DELIGATE_KEY_VERIFY_EMAIL;

function createUser (db) {
  return function (req, res, next) {
  
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({error: 'Bad request'});
      return;
    }

    let profile = req.body.profile;

    if (!profile) {
      profile = {} 
    }
    if (!profile.email) {
      profile.email = [username.toLowerCase().trim()]
    }

    // fix issue of empty field
    for (let prop in profile) {
      if (typeof profile[prop] === 'string' && profile[prop].length === 0) {
        profile[prop]  = 'N/A'
      }
    }

    if (profile.gender && profile.gender === 'female') {
      profile.picture = process.env.DEFAULT_FEMALE_PICTURE
    } else {
      profile.picture = process.env.DEFAULT_MALE_PICTURE
    }

    const user = { 
      username: username.toLowerCase().trim(), 
      roles: ['user'],
      uid: uuid(), 
      login: { password }, 
      profile,
      verified: false,
      testResults: {},
      skills: [],
      promote: {}
    }

    db.userdb.createUser( user, (err, user) => {
      if (err) {
        res.status(500).json({error: 'Internal error'});
      } else {
        req.user = user;          
        next();
      }
    });

  }
}

function generateEmailVerifyToken(db, { onFailure }) {
  return function(req, res, next) {
    const user = req.user;
    if (user && user.uid) {
      const token = jwt.sign(
        {uid: user.uid}, 
        secret,
        { expiresIn: "1 days"}
      );
      req.token = token;
      next();
    } else {
      res.status(400).json({error: 'Bad request: failed to generate email verfify token'});
      onFailure && onFailure({error: 'Bad request: failed to generate email verfify token'});
    }
  }
}

function serialize() {
  return serializeUser
}

function sendEmail(db, { sendEmail }) {
  return function (req, res, next) {
    if (sendEmail) {
      sendEmail({email:  req.user.username, token: req.token}, () => {
        next()
      })
    } else {
      console.warn('No SendEmail function. Skipping sending email')
      next()
    }
    
  }
}

function final() {
  return success
}

module.exports = [checkIfNewUser, createUser, generateToken, generateEmailVerifyToken, serialize, sendEmail, final]