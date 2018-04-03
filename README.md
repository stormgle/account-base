# account-base
@stormgle

## Introduction
`account-base` is a collection of micro-services aim to manage user accounts. It is based on nodejs and express. Each service can be deploy as an REST API so that it is easy to scale in production or integrate with serverless platforms such as Amazon Lambda.


## Run example demo

If you want to explore the services, run the example demo provided with this package.

### Clone package from GitHub

`git clone https://github.com/stormgle/account-base`

### Run example demo

`npm run example`

It will run setup script to download AWS DynamoDB Local and then start the example server at port 3000. The example server includes all provided APIs.

Open a ternimal and make a request to example server, using `curl` for example.

#### Signup a new account

`curl -H "Content-Type: application/json" -X POST -d '{"username":"tester@test-team.com","password":"123456"}' http://localhost:3000/auth/signup`

#### Login 
`curl -H "Content-Type: application/json" -X POST -d '{"username":"tester@test-team.com","password":"123456"}' http://localhost:3000/auth/login`

For the complete list of the API, refer section [TBD]

## Use the package in your project

### Install packages

`npm install --save @stormgle/account-base`

Since the user-service uses an abstraction layer `(userdb-api)` for accessing database, We need to install a database driver. Here we will select dynamodb driver.

`npm install --save @stormgle/userdb-dynamodb`

### Setup environment for local development

If you use AWS DynamoDB Web Service. You only need to configure your `aws credential` provided by AWS.

If you want to use AWS DynamoDB Local for development, you need to download the [downloadable version of DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html) and extract it into your workspace (under `./localdb` for example). You still need to configure `aws credential` for accessing DynamoDB programmatically. Simply setup these two keys in your environment variable:

```
AWS_ACCESS_KEY_ID = whatever_you_want_it_is_not_important

AWS_SECRET_ACCESS_KEY = whatever_you_want_it_is_not_important
```
To start DynamoDB on your computer at port `3001`, assume that you have extracted dynamodb into `./localdb`

`cd localdb && java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -port 3001 -sharedDb` 

we provided a npm script that wrapper above command:

`npm run start:db`

### Use the API in your own server

You can create a server that implement selected APIs. For example, we will create `server.js` that implement both `auth/signup` and `auth/login`

`server.js`

```javascript
"use strict"

/* Define Host and Port for server and database */
const SERVER_HOST = 'localhost';
const SERVER_PORT = 3000;

const DB_HOST = 'localhost';
const DB_PORT = 3001;

/* Import user-services helper and database driver */
const app = require('@stormgle/user-services');
const dynamodb = require('@stormgle/userdb-dynamodb')

/* configure the driver */
const dbDriver = dynamodb({ 
  region : 'us-west-2', 
  endpoint : `${DB_HOST}:${DB_PORT}`
});

app
  .useDbDriver(dbDriver)

/* create function from the APIs, it will add the api to the express route */
[
  'post/auth/signup',
  'post/auth/login',
]
.forEach(func => {
  const { method, uri, includePath } = app.parseApi(func);
  app.createFunction(method, uri, require(`@stormgle/account-base/api/${includePath}`))
})  


/* start the server */
const httpServer = require('http').createServer(app);
httpServer.listen(SERVER_PORT)
console.log(`# Server (signup & login) is running at ${SERVER_HOST}:${SERVER_PORT}\n`);

```

start DynamoDB on your computer first, then run the server on another terminal:

`npm run start:db`

`node server.js`