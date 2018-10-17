"use strict"

const form = ({title, script, style}) => `
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
const success = {}

success.reset_password = ({title, service, redirect, style}) => `
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

success.verify_email = ({title, style}) => `
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
        <p> Your email has been verified </p>
        <p> Thank you for using our services </p>
      </div>
    </div>
  </body>
</html>
`

const failure = {}

failure.verify_email = ({title, style}) => `
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
    <div class='container' id='failure'>
      <div class='intro'>
        <p> The Verification process is failed </p>
        <p> It is either your link is not correct or has been expired </p>
        <p> Please login and try Re-send Verification Email </p>
      </div>
    </div>
  </body>
</html>
`

const requestResetPasswordLink = {}

requestResetPasswordLink.success = ({title, email, script, style}) => `
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
        <p> We will send Reset Password Link to the following email </p>
      </div>
      <p> ${email} </p>
      <p>
        <button type='button' onclick="submit()"> Send Reset Password Link </button>
      </p>
    </div>
    <script>${script}</script>
  </body>
</html>
`

requestResetPasswordLink.failure = ({title, style}) => `
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
    <div class='container' id='failure'>
      <div class='intro'>
        <p> Email: ${email} is not registered as an account in our system </p>
      </div>
    </div>
  </body>
</html>
`

const sendEmailResetPassword = {}

sendEmailResetPassword.success = ({title, style}) => `
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
        <p> Reset Password Link has been sent to your email </p>
      </div>
    </div>
  </body>
</html>
`

sendEmailResetPassword.failure = ({title, style}) => `
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
    <div class='container' id='failure'>
      <div class='intro'>
        <p> Failed to send email </p>
      </div>
    </div>
  </body>
</html>
`

module.exports = { form, success, failure, requestResetPasswordLink, sendEmailResetPassword };