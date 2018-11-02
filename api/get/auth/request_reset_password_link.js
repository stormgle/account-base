"use strict"

const html = require('../../../client/auth/0/html')
const style = require('../../../client/auth/0/style')
const js = require('../../../client/auth/0/script')


function render(db, {title, endPoint}) {
  return function(req, res) {
    const email = req.query.email;
    if (email && email.length > 0) {
      db.userdb.queryUser({ username: email }, ((err, user) => {
        if (err) {
          res.status(400).send();
        } else {
          if (user) {
            const script = js.requestResetPasswordLink ({ email, endPoint });
            res.status(200).send(html.requestResetPasswordLink.success({title, email, script, style}));
          } else {
            res.status(200).send(html.requestResetPasswordLink.failure({title, email, style}));
          }
        }
      }))    
    } else {
      res.status(400).send();
    }
  }
}

module.exports = [render]