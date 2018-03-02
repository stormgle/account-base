"use strict"
const PORT = 3001;

const { app, userdb } = require('./signup.app');

const dynamodb = require('@stormgle/userdb-dynamodb')

userdb.use( dynamodb({
  region : 'us-west-2', 
  endpoint : 'http://localhost:8000'}
));

const httpServer = require('http').createServer(app);

/* only for dev and test purpose, should not in production */
app.post('/close', (res, req) => {
  httpServer.close();
  process.exit(0);
})

httpServer.listen(PORT)

console.log(`Signup service is running at localhost:${PORT}\n`);
