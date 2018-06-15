# account-base
@stormgle

## Introduction
`account-base` is a service based on nodejs and express aimed to support user accounts management. It adopted *token-based authentication* as its core. The package exports a REST api singleton so that it can be easily integrated with serverless platforms such as Amazon Lambda.

## Prequisition

Docker is required to run the local database in the example. 

## Run example demo

If you want to explore the service, run the example demo provided with this package.

### Clone package from GitHub

`git clone https://github.com/stormgle/account-base`

### Install all dependencies

`npm install`

### Run example demo

`npm run example`

It will setup environment variables. Run docker and install the necessary image if not installed yet. Then, it starts the local database service from docker, create USERS Collection and add three initial documents for Super-Admin, Admin and Tester users. Eventually, it starts the API Server at port `3100`.

After the server is started and running. Open a ternimal and make a request to the example server, using `curl` for example.

#### Signup a new account

`curl -H "Content-Type: application/json" -X POST -d '{"username":"tester@test-team.com","password":"123456"}' http://localhost:3100/auth/signup`

#### Login 
`curl -H "Content-Type: application/json" -X POST -d '{"username":"tester@test-team.com","password":"123456"}' http://localhost:3100/auth/login`

For the complete list of the API, refer section [TBD]

## Use the package in your project

### Install packages

`npm install --save @stormgle/account-base`

To loose coupling the database with the api. I've used `database-abstractor`. At the time you create and use the api, you need to install a database driver. Here I will install the dynamodb driver for example .

`npm install --save @stormgle/userdb-dynamodb-driver`

Curently, I only designed the dynamodb driver packages. More drivers will be supported in future.

If you want to change `PORT` number of the example server, edit the `PORT_LOCAL_TEST` in `./env/.env.test` file.

### Setup environment

I use `dotenv` to supply the environment variables during development. `./env/.keys` stores the secret keys for token generation as well as validation. `./env/.env.test` stores environment variables to support unit testing and local example server. Running `npm run env` will concatenate those two files into `.env` file.

It is recommended that you setup the environment variables natively. However, if you're interesting in using `dotenv` *(since it's perfectly fine in production)*, remember do NOT commit your changes in `.env.test` and `.keys` to a public repository like github as they are store sensitive information about your system.

The following enviroment variables are required when production:

```
AUTH_KEY_ACCOUNT=/* this is secret key for user service - role user */
AUTH_KEY_ADMIN=/* this is secret key for user service - role admin */
AUTH_KEY_SUPER=/* this is secret key for user service - role super admin */

DELIGATE_KEY_FORGOT_PASSWORD=/* this is secret key use when user forgot password */

POLICY_SUPER="super admin account"
POLICY_ADMIN="admin"
POLICY_USER="account"

PWD_PREFIX=prefix-to-password
PWD_SUFFIX=suffix-to-password
```

If you use AWS DynamoDB Web Service. You also need to configure your `aws credential` provided by AWS.

```
AWS_ACCESS_KEY_ID=provide_by_aws_or_whatever_you_want_if_work_local

AWS_SECRET_ACCESS_KEY=provide_by_aws_or_whatever_you_want_if_work_local
```

### Create API Server

Require the api in your server

```javascript
const api = require('account-base')
```
You also need to let the api know which database driver is used.

```javascript
const DatabaseAbstractor = require("database-abstractor")
const userdb = new DatabaseAbstractor();

const dynamodb = require('@stormgle/userdb-dynamodb-driver')

userdb.use(dynamodb({ 
  region : 'us-west-2', 
  endpoint : `${process.env.DB_HOST}:${process.env.DB_PORT}`
}));

api.useDatabase({ userdb });
```

Then we create API functions using `generateFunctions `. Some functions accept options to let you have flexibitity to configure them. In this example, we create API functions with options for `POST /auth/forgot_password`. `POST /auth/reset_password` and `GET auth/0/form`.

```javascript
const PORT = process.env.PORT_LOCAL_TEST || 3100;

const forgotPassword = {
  onSuccess: (token) => console.log(token.token),
  onFailure: (err) => console.log(err)
};

const form = {
  title: 'Auth-0', 
  body:'Hello from Auth-0 / ',
  endPoint: `http://localhost:${PORT}/auth/reset_password`,
  redirect: {
    success: `http://localhost:${PORT}/`
  }
};

const reset = {
  title: 'Auth-0', 
  service: 'Example',
  redirect: `http://localhost:${PORT}/`
}

api.createFunctions({forgotPassword, form, reset})
```

`createFunction` return an express route that you can use in your server

```javascript
const express = require('express')
const cors = require('cors')

const app = express();

app
  .use(cors())
  .use('/', api)

const httpServer = require('http').createServer(app);
httpServer.listen(PORT);

```

Compile all code pieces together

```javascript
"use strict"

require('dotenv').config()

const express = require('express')
const cors = require('cors')

const api = require('../api/main')

const DatabaseAbstractor = require("database-abstractor")
const userdb = new DatabaseAbstractor();

const dynamodb = require('@stormgle/userdb-dynamodb-driver')

userdb.use(dynamodb({ 
  region : 'us-west-2', 
  endpoint : `${process.env.DB_HOST}:${process.env.DB_PORT}`
}));

const PORT = process.env.PORT_LOCAL_TEST || 3100;

const forgotPassword = {
  onSuccess: (token) => console.log(token.token),
  onFailure: (err) => console.log(err)
};

const form = {
  title: 'Auth-0', 
  body:'Hello from Auth-0 / ',
  endPoint: `http://localhost:${PORT}/auth/reset_password`,
  redirect: {
    success: `http://localhost:${PORT}/`
  }
};

const reset = {
  title: 'Auth-0', 
  service: 'Example',
  redirect: `http://localhost:${PORT}/`
}

api.useDatabase({ userdb })
   .generateFunctions({forgotPassword, form, reset});

const app = express();

app
  .use(cors())
  .use('/', api)


const httpServer = require('http').createServer(app);
httpServer.listen(PORT);
```



