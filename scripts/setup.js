"use strict"

const fs = require('fs');

fs.createReadStream('./env/.keys')
  .pipe(fs.createWriteStream('.env'));