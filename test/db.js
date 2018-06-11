"use strict"

const { spawn } = require('child_process')
const userdb = require('../scripts/userdb')

const db = {

  _proc: null,

  start() {
    console.log('Starting database...\n')
    this._proc = spawn('docker', ['run', `-v ${process.cwd()}/dynamodb_local_db`, '-p', '3001:8000', 'cnadiminti/dynamodb-local'])
    this._proc.stdout.on('data', (data) => console.log(`${data}`));
    this._proc.stderr.on('data', (data) => console.log(`${data}`));
    return this;
  },

  init(done) {
    const host = 'http://localhost';
    const port = 3001;
    userdb.use({host,port}).init(done);
    return this;
  },

  close() {
    console.log('\nClosing database...\n')
    this._proc.kill();
    return this;
  }

}

module.exports = db;