"use strict"
const PORT = 3001;

const app = require('./signup.app');

const httpServer = require('http').createServer(app);

/* only for dev and test purpose, should not in production */
app.post('/close', (res, req) => {
  httpServer.close();
  process.exit(0);
})

httpServer.listen(PORT)

console.log(`Signup service is running at localhost:${PORT}\n`);
