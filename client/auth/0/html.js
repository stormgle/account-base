"use strict"

const form = ({title, body, script, style}) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <style>${style}</style>
  </head>
  <body>
    <header>
      <h2>${title}</h2>
      <div>  Reset Password Form </div>
    </header>
    <div class='container' id='main'>
      <div class='intro'>
        <p> Please enter your new password </p>
        <p> Your password should contain lower case, upper case, number and special characters. </p>
        <hr />
      </div>
      <div class='panel' style="max-width: 560px; margin: auto;">
        <h3>Password Reset Form</h3>
        <div id='form'> 
          <div>
            <label>Your new password</label>
            <input type='password' id='pwd' />
            <!--
            <div class='msg'>
              <div id='res'>  </div>
              <div class='bar'>
                <div class='ind red'></div><div class='ind red'></div><div class='ind orange'></div><div class='ind orange'></div><div class='ind yellow'></div><div class='ind blue'></div><div class='ind green'></div>
                <div id='msk'></div>
              </div>
            </div>
            -->
          </div>
          <div>
            <label>Retype your password</label>
            <input type='password' id='retype' onkeyup="clearTxt()"/>
            <div class='msg'>
              <div id='err'>Password mismatch</div>
            </div>
          </div>
          <hr />
          <p>
            <button type='button' onclick="submit()"> Update New Password </button>
          </p>
        </div>
      </div>
    </div>
    <script>${script}</script>
  </body>
</html>
`

const success = ({title, service, redirect, style}) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <style>${style}</style>
  </head>
  <body>
    <header>
      <h2>${title}</h2>
    </header>
    <div class='container' id='success'>
      <div class='intro'>
        <p> Your password at ${service} has been updated </p>
        <p> Click <a href='${redirect}'>here</a> to login  </p>
      </div>
    </div>
  </body>
</html>
`

module.exports = { form, success };