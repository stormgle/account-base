"use strict"

require('dotenv').config()

const express = require('express')
const app = require('../example/app.local')

const PORT = process.env.PORT_LOCAL_TEST;

const server = {

  start(done) {
    this.httpServer = require('http').createServer(app);
    this.httpServer.listen(PORT);
    console.log(`\nTest Server is running at http://localhost:${PORT}\n`)
    done && done();
  },

  close() {
    console.log('\nClosing Test Server')
    this.httpServer && this.httpServer.close();
  }

}

module.exports = server