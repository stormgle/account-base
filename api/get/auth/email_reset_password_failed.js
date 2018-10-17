"use strict"

const html = require('../../../client/auth/0/html');
const style = require('../../../client/auth/0/style');

function render(db, {title}) {
  return function(req, res) {
    res.status(200).send(html.sendEmailResetPassword.failure({title, style}));
  }
}

module.exports = [render]