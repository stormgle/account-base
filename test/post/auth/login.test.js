"use strict"

const cwd = process.cwd();
const { Connect } = require(`${cwd}/test/util`)

function test(path) {

  const patt = /^\w+/i;
  const method = `${path.match(patt)}`.toUpperCase();
  const uri = path.replace(patt,"");

  return describe(`${method} ${uri}`, function(){

    const conn = new Connect({
      hostname: 'localhost',
      port: process.env.PORT_LOCAL_TEST,
      path
    });

    it('login normal user with correct credential', function(done) {
      conn.request(
        {username: 'tester@test-team.com', password: '123456'}, 
        (err, data) => {
          if (err) done(err)
          else if (data) {
            if (data.status >= 500) {
              done({error: `${data.status} - internal server error`})
            } 
            else if (data.status === 200 && data.body.user && data.body.tokens) {
              done()
            } else {
              done({error: `unexpected http response status: ${data.status}`})
            }
          } else {
            done({error: 'invalid return data'})
          }
        }
      )
    })

    it('login normal user with incorrect username', function(done) {
      conn.request(
        {username: 'foo@test-team.com', password: '123456'}, 
        (err, data) => {
          if (err) done(err)
          else if (data) {
            if (data.status >= 500) {
              done({error: `${data.status} - internal server error`})
            } 
            else if (data.status === 403) {
              done()
            } else {
              done({error: `unexpected http response status: ${data.status}`})
            }
          } else {
            done({error: 'invalid return data'})
          }
        }
      )
    })

    it('login normal user with incorrect password', function(done) {
      conn.request(
        {username: 'tester@test-team.com', password: '12345'}, 
        (err, data) => {
          if (err) done(err)
          else if (data) {
            if (data.status >= 500) {
              done({error: `${data.status} - internal server error`})
            } 
            else if (data.status === 403) {
              done()
            } else {
              done({error: `unexpected http response status: ${data.status}`})
            }
          } else {
            done({error: 'invalid return data'})
          }
        }
      )
    })

    it('login normal user with empty username', function(done) {
      conn.request(
        {username: '', password: '12345'}, 
        (err, data) => {
          if (err) done(err)
          else if (data) {
            if (data.status >= 500) {
              done({error: `${data.status} - internal server error`})
            } 
            else if (data.status === 400) {
              done()
            } else {
              done({error: `unexpected http response status: ${data.status}`})
            }
          } else {
            done({error: 'invalid return data'})
          }
        }
      )
    })

    it('login normal user with undefined username', function(done) {
      conn.request(
        {username: undefined, password: '12345'}, 
        (err, data) => {
          if (err) done(err)
          else if (data) {
            if (data.status >= 500) {
              done({error: `${data.status} - internal server error`})
            } 
            else if (data.status === 400) {
              done()
            } else {
              done({error: `unexpected http response status: ${data.status}`})
            }
          } else {
            done({error: 'invalid return data'})
          }
        }
      )
    })

    it('login normal user with null username', function(done) {
      conn.request(
        {username: null, password: '12345'}, 
        (err, data) => {
          if (err) done(err)
          else if (data) {
            if (data.status >= 500) {
              done({error: `${data.status} - internal server error`})
            } 
            else if (data.status === 400) {
              done()
            } else {
              done({error: `unexpected http response status: ${data.status}`})
            }
          } else {
            done({error: 'invalid return data'})
          }
        }
      )
    })

    it('login normal user with empty password', function(done) {
      conn.request(
        {username: 'tester@test-team.com', password: ''}, 
        (err, data) => {
          if (err) done(err)
          else if (data) {
            if (data.status >= 500) {
              done({error: `${data.status} - internal server error`})
            } 
            else if (data.status === 403) {
              done()
            } else {
              done({error: `unexpected http response status: ${data.status}`})
            }
          } else {
            done({error: 'invalid return data'})
          }
        }
      )
    })

    it('login normal user with undefine password', function(done) {
      conn.request(
        {username: 'tester@test-team.com', password: undefined,}, 
        (err, data) => {
          if (err) done(err)
          else if (data) {
            if (data.status >= 500) {
              done({error: `${data.status} - internal server error`})
            } 
            else if (data.status === 403) {
              done()
            } else {
              done({error: `unexpected http response status: ${data.status}`})
            }
          } else {
            done({error: 'invalid return data'})
          }
        }
      )
    })

    it('login normal user with null password', function(done) {
      conn.request(
        {username: 'tester@test-team.com', password: null}, 
        (err, data) => {
          if (err) done(err)
          else if (data) {
            if (data.status >= 500) {
              done({error: `${data.status} - internal server error`})
            } 
            else if (data.status === 403) {
              done()
            } else {
              done({error: `unexpected http response status: ${data.status}`})
            }
          } else {
            done({error: 'invalid return data'})
          }
        }
      )
    })

  })
}

module.exports = test