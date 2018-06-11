"use strict"

const fs = require('fs');

// remove .env file, then create new one
if (fs.existsSync('./.env')) {
  console.log('Removing old [.env] file...')
  fs.unlinkSync('.env');
}

console.log('Generating new [.env] file...');

['.keys', '.env.test'].forEach( (env) => {
  fs.createReadStream(`./env/${env}`)
    .pipe(fs.createWriteStream('.env', {'flags': 'a'}));
})

console.log('Finished setup')

require('dotenv').config()
