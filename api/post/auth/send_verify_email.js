"use strict"

const jwt = require('jsonwebtoken')

const { verifyToken } = require('@stormgle/jtoken-util')

const auth_key_account = process.env.AUTH_KEY_ACCOUNT;
const deligate_key_verify_email = process.env.DELIGATE_KEY_VERIFY_EMAIL;

function authen() {
  return verifyToken(auth_key_account)
}

function queryUser(db) {
  return function (req, res, next) {
    const uid = req.user.uid;

    if (uid && uid.length > 0) {
      db.userdb.queryUser({ uid }, ((err, user) => {
        if (err) {
          res.status(400).send();
        } else {
          if (user) {
            req.user.email = user.username,
            req.user.displayName = user.profile.displayName
            next();
          } else {
            res.status(400).send({error: 'Bad Request: User does not exist'});
          }      
        }
      }))
    } else {
      res.status(400).send({error: 'Bad Request: Cannot retrieve uid'});
    }
  }
}

function generateEmailVerifyToken(db, { onFailure }) {
  return function(req, res, next) {
    const user = req.user;
    if (user && user.uid) {
      const token = jwt.sign(
        {uid: user.uid}, 
        deligate_key_verify_email,
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

function sendEmail(db, { sendEmail }) {
  return function (req, res, next) {
    if (sendEmail) {
      sendEmail({email:  req.user.email, token: req.token}, (err) => {
        if (err) {
          res.status(200).json({email: null});
        } else {
          res.status(200).json({email: req.user.email})
        }
      })
    } else {
      console.warn('No SendEmail function. Skipping sending email')
      res.status(200).json({email: null})
    }
  }
}

module.exports = [authen, queryUser, generateEmailVerifyToken, sendEmail]