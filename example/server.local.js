"use strict"

const app = require('./app.local')

const PORT = process.env.PORT_LOCAL_TEST;

const httpServer = require('http').createServer(app);
httpServer.listen(PORT)
console.log(`# user-services is running at http://localhost:${PORT}\n`);