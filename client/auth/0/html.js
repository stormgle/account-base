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
      <h2>${title} / Reset Password Form</h2>
    </header>
    <div class='container' id='main'>
      <div class='panel'>
        <p> Please enter your new password </p>
        <p> Your password should contain lower case, upper case, number and special characters. </p>
        <hr />
      </div>
      <h3>Password Reset Form</h3>
      <div id='form'> 
        <p>
          <label>Your new password</label>
          <input id='pwd' />
        </p>
        <p>
          <label>Retype your password</label>
          <input id='retype' />
        </p>
        <hr />
        <p>
          <button type='button' onclick="submit()"> Submit </button>
        </p>
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
      <div class='panel'>
        <p> Your password at ${service} has been updated </p>
        <p> Click <a href='${redirect}'>here</a> to login  </p>
      </div>
    </div>
  </body>
</html>
`

module.exports = { form, success };