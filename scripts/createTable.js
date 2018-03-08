"use strict"

require('dotenv').config()

const UserDB = require('@stormgle/userdb-api');
const dynamodb = require('@stormgle/userdb-dynamodb')

const userdb = new UserDB();

userdb.use(require('@stormgle/userdb-dynamodb')(
  {
    region : 'us-west-2', 
    endpoint : `${process.env.DB_HOST}:${process.env.DB_PORT}`
  },
  (err) => {
    if (err) {
      console.log('Failed to init local db')
      console.log(err);
    } else {
      userdb.createTable(function(err, data) {
        if (err) {
          console.log('Failed to create table')
          console.log(err);
        } else {
          console.log('Created new USERS table')
        }
      })
    }
  }
))

