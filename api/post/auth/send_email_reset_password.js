"use strict"

const jwt = require('jsonwebtoken')

const html = require('../../../client/auth/0/html');
const style = require('../../../client/auth/0/style');

const secret = process.env.DELIGATE_KEY_FORGOT_PASSWORD;

function generateToken(db, { onFailure }) {
  return function(req, res, next) {
    const email = req.body.email;
    if (!email) {
      res.status(400).json({error: 'Bad request: must specify email'});
      onFailure && onFailure({error: 'Bad request: must specify email'});
      return
    }
    
    db.userdb.queryUser(
      { username: email },
      (err, user) => {
        if (err) {
          res.status(500).json({error: 'Internal error: Access database error'});
          onFailure && onFailure({error: 'Internal error: Access database error'})
        } else {
          if (user && user.uid) {
            const token = jwt.sign(
              {uid: user.uid}, 
              secret,
              { expiresIn: "1 days"}
            );
            req.token = token;
            next();
          } else {
            res.status(400).json({error: 'Bad request: must specify email'});
            onFailure && onFailure({error: 'Bad request: email is npot registered'});
          }
        }
      }
    )
  }
}

function sendEmailAndResponse(db, {title, sendEmail}) {
  return function (req, res) {
    if (sendEmail) {
      sendEmail({email:  req.body.email, token: req.token}, (err) => {
        if (err) {
          res.status(200).send(html.sendEmailResetPassword.success({title, email, style}));
        } else {
          res.status(200).send(html.sendEmailResetPassword.failure({title, email, style}));
        }
      })
    } else {
      console.warn('No SendEmail function. Skipping sending email')
      res.status(200).send(html.sendEmailResetPassword.success({title, email, style}));
    }    
  }
}

module.exports = [generateToken, sendEmailAndResponse]
