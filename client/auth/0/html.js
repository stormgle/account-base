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
    <div id='container'>
      <div id='panel'>
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
</html>
`



module.exports = { form };