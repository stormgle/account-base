"use strict"

require('dotenv').config()

const db = require('database-test-helper')
const userdb = require('@stormgle/userdb-test-helper')

db.start().add({userdb}).init(() => {
  const app = require('./app.local')
  const PORT = process.env.PORT_LOCAL_TEST;
  const httpServer = require('http').createServer(app);
  httpServer.listen(PORT)
  console.log(`\n# USER-SERVICES is running at http://localhost:${PORT}\n`);
});

