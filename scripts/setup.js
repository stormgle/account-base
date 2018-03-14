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

require('dotenv').config()

// download dynamo-db local
const DynamoDbLocal = require('dynamodb-local');

DynamoDbLocal.configureInstaller({
  installPath: './localdb',
  downloadUrl: 'https://s3.eu-central-1.amazonaws.com/dynamodb-local-frankfurt/dynamodb_local_latest.tar.gz'
});

DynamoDbLocal.launch(process.env.DB_PORT, null, ['shareDb'])
  .then(function() {
    console.log('DynamoDB is installed and ready to use')
    DynamoDbLocal.stop(process.env.DB_PORT);
    console.log('Setup completed')
  })

