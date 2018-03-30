"use strict"

const form = ({ token, endPoint }) => `
  function submit() {
    console.log('token = ${token}');
    console.log($('pwd').value)
    if (check()) {
      post($('pwd').value, function(err, data) {
        if (err) {
          console.log(err)
        } else {
          console.log(data)
        }
      })
    }
  }
  function $(id) {
    return document.getElementById(id);
  }
  function check() {
    return $('pwd').value === $('retype').value;
  }
  function post(data, callback) {
    var request = new XMLHttpRequest();
    request.open('POST', '${endPoint}', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Authorization', 'Bearer ${token}');
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        callback(null, JSON.parse(request.responseText));
      } else {
        callback({
          status: request.status,
          err: request.responseText
        }, null);
      }
    }
    request.send(JSON.stringify({login:{password:data}}));
  }
`

module.exports = { form }