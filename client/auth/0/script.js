"use strict"

const form = ({ token, endPoint }) => `
  function submit() {
    if (check()) {
      post($('pwd').value, function(err, data) {
        if (err) {
          console.log(err)
        } else {
          document.body.innerHTML = data
        }
      })
    } else {
      $('err').setAttribute("style", "color:#f44336")
    }
  }
  function $(id) {
    return document.getElementById(id)
  }
  function check() {
    return $('pwd').value === $('retype').value
  }
  function post(data, callback) {
    var request = new XMLHttpRequest()
    request.open('POST', '${endPoint}', true)
    request.setRequestHeader('Content-Type', 'application/json')
    request.setRequestHeader('Authorization', 'Bearer ${token}')
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        callback(null, request.responseText)
      } else {
        callback({
          status: request.status,
          err: request.responseText
        }, null);
      }
    }
    request.send(JSON.stringify({login:{password:data}}))
  }
  function score(p) {
    var s = 2
    if (p.length == 0) {
      return 0
    } else if (p.length < 6) {
      s -= 2
    } else if (p.length == 6) {
      s -= 1
    } else if (p.length > 7 ) {
      s += 1
    }
    s += /[a-z]/.test(p) ? 1 : 0
    s += /[A-Z]/.test(p) ? 1 : 0
    s += /[0-9]/.test(p) ? 1 : 0
    s += /\\W/.test(p)    ? 1 : 0
    return s
  }
  function pwdStrInd() {
    var p = $('pwd').value;
    switch (score(p)) {
      case 0:
        bar(100); res(''); break
      case 1:
        bar(86); res('wreid'); break
      case 2:
        bar(72); res('weak'); break
      case 3:
        bar(60); res('weak'); break
      case 4:
        bar(44); res('medium'); break
      case 5:
        bar(30); res('good'); break
      case 6:
        bar(14); res('awesome'); break
      case 7:
        bar(0);break
    }
  }
  function bar(val) {
    $('msk').setAttribute("style", "width:" + val + '%')
  }
  function res(val) {
    $('res').innerHTML = val
  }
  function clearTxt() {
    if ($('retype').value.length === 0) {
      $('err').setAttribute("style", "color:white")
    }
  }
`
const requestResetPasswordLink = ({ email, endPoint }) => `
  function submit() {
    post(${email}, function(err, data) {
      if (err) {
        console.log(err)
      } else {
        document.body.innerHTML = data
      }
    })
  }
  function post(data, callback) {
    var request = new XMLHttpRequest()
    request.open('POST', '${endPoint}', true)
    request.setRequestHeader('Content-Type', 'application/json')
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        callback(null, request.responseText)
      } else {
        callback({
          status: request.status,
          err: request.responseText
        }, null);
      }
    }
    request.send(JSON.stringify({email:data}))
  }
`

module.exports = { form, requestResetPasswordLink }