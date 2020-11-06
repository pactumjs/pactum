# Data Management

Data Management is one of the most powerful features of **pactum**. It saves time by allowing us to reuse common data.

## Introduction

As the functionality of the application grows, the scope of the testing grows with it. At one point, managing data becomes complex.

Assume you have numerous test cases around adding a new user to your system. To add a new user you post the following JSON to `/api/users` endpoint.

```json
{
  "FirstName": "Jon",
  "LastName": "Snow",
  "Age": 26,
  "House": "Castle Black"
}
```

Now let's assume, your application no longer accepts the above JSON. It needs a new field `Gender` in the JSON. It will be tedious to update all your existing test cases to add the new field.

```json
{
  "FirstName": "Jon",
  "LastName": "Snow",
  "Age": 26,
  "Gender": "male",
  "House": "Castle Black"
}
```

To solve these kind of problems, **pactum** comes with a concept of *Data Templates* & *Data References* to manage your test data. It helps us to re-use data across tests.

## Data Template

A Data Template is a standard format for a particular resource. Once a template is defined, it can be used across all the tests to perform a request.

Use `stash.addDataTemplate` to add a data template. To use the template in the tests, use `@DATA:TEMPLATE@` as key & the name of the template as value.

<!-- tabs:start -->

#### ** base.spec.js **

```js
const pactum = require('pactum');
const stash = pactum.stash;

before(() => {
  stash.addDataTemplate({
    'User:New': {
      "FirstName": "Jon",
      "LastName": "Snow",
      "Age": 26,
      "Gender": "male",
      "House": "Castle Black"
    }
  });
});
```

#### ** users.spec.js **

```javascript
const pactum = require('pactum');

it('adds a new user', async () => {
  await pactum.spec()
    .post('/api/users')
    .withJson({
      '@DATA:TEMPLATE@': 'User:New'
    })
    .expectStatus(200);
    /*
      The value of the template will be posted to /api/users
      {
        "FirstName": "Jon",
        "LastName": "Snow",
        "Age": 26,
        "Gender": "male",
        "House": "Castle Black"
      }
    */
});
```

<!-- tabs:end -->

The exact resource is not going to be used across every test. Every test might need specific values. This library supports the overriding of specific values & extending the data template. This allows tests to be customized as much as you'd like when using templates.

```javascript
it('should not add a user with negative age', async () => {
  await pactum.spec()
    .post('/api/users')
    .withJson({
      '@DATA:TEMPLATE@': 'User:New',
      '@OVERRIDES@': {
        'Age': -1,
        'House': 'WinterFell'
      }
    })
    .expectStatus(400);
    /*
      The value of the template with overridden values will be posted to /api/users
      {
        "FirstName": "Jon",
        "LastName": "Snow",
        "Age": -1,
        "Gender": "male",
        "House": "WinterFell"
      }
    */
});
```

!> Templates can also reference other templates. *Be cautious not to create circular dependencies*

<!-- tabs:start -->

#### ** base.spec.js **

```js
const pactum = require('pactum');
const stash = pactum.stash;

before(() => {
  stash.addDataTemplate({
    'User:New': {
      "FirstName": "Jon",
      "LastName": "Snow",
      "Age": 26,
      "Gender": "male",
      "House": "Castle Black"
    },
    'User:New:WithEmptyAddress': {
      '@DATA:TEMPLATE@': 'User:New',
      '@OVERRIDES@': {
        'Address': []
      }
    },
    'User:New:WithAddress': {
      '@DATA:TEMPLATE@': 'User:New',
      '@OVERRIDES@': {
        'Address': [
          {
            '@DATA:TEMPLATE@': 'Address:New'
          }
        ]
      }
    },
    'Address:New': {
      'Street': 'Kings Road',
      'Country': 'WestRos'
    }
  });
});
```

#### ** users.spec.js **

```js
const pactum = require('pactum');

it('should add a user with address', async () => {
  await pactum.spec()
    .post('/api/users')
    .withJson({
      '@DATA:TEMPLATE@': 'User:WithAddress',
      '@OVERRIDES@': {
        'Age': 36,
        'Address': [
          {
            'Country': 'Beyond The Wall',
            'Zip': 524004
          }
        ]
      }
    })
    .expectStatus(400);
    /*
      The value of the template with overridden values will be posted to /api/users
      {
        "FirstName": "Jon",
        "LastName": "Snow",
        "Age": 36,
        "Gender": "male",
        "House": "WinterFell",
        "Address": [
          {
            'Street': 'Kings Road',
            'Country': 'Beyond The Wall',
            'Zip': 524004       
          }
        ]
      }
    */
});
```

<!-- tabs:end -->

## Data References

### Data Map

A Data Map is a collection of data that can be referenced in data templates or tests. The major differences between a data template & a data map are

* When a data template is used, the current object will be replaced.
* When a data map is used, the current object's property value will be replaced.

Use `stash.addDataMap` to add a data map. To use the map in the tests or in the template, use `$M{<json-query>}` as the value.

```javascript
const pactum = require('pactum');
const stash = pactum.stash;

before(() => {
  stash.addDataMap({
    'User': {
      'FirstName': 'Jon',
      'LastName': 'Snow',
      'Country': 'North'
    }
  });
  stash.addDataTemplate({
    'User:New': {
      "FirstName": "$M{User.FirstName}",
      "LastName": "$M{User.LastName}",
      "FullName": "$M{User.FirstName} $M{User.LastName}",
      "Age": 26,
      "Gender": "male",
      "House": "Castle Black"
    }
  });
});

/*
  The template `User:New` will be 
  {
    "FirstName": "Jon",
    "LastName": "Snow",
    "Age": 26,
    "Gender": "male",
    "House": "Castle Black"
  }
*/
```

!> It's perfectly legal to refer other data maps from a data map. *Be cautious not to create circular dependencies*

```javascript
const pactum = require('pactum');
const stash = pactum.stash;

before(() => {
  stash.addDataMap({
    'User': {
      'Default': {
        'FirstName': '$M{User.FirstNames[0]}',
        'LastName': '$M{User.LastNames[0]}',
        'Country': 'North'
      },
      'FirstNames': [ 'Jon', 'Ned', 'Ary' ],
      'LastNames': [ 'Stark', 'Sand', 'Snow' ]
    }
  });
});
```

### Data Function

Data Functions can ease up your life when working with dynamic values. A Data Function is a custom data handler function that returns some sort of data that can be referenced later.

Use `handler.addDataFunHandler` to add a custom data function handler. To use the data function in the tests or in the template, use `$F{<handler-name>}`.

```javascript
const pactum = require('pactum');
const handler = pactum.handler;

handler.addDataFunHandler('GetTimeStamp', () => {
  return Date.now();
});
handler.addDataFunHandler('GetAuthToken', () => {
  return 'Basic some-token';
});

await pactum.spec()
  .post('/api/order')
  .withHeaders('Authorization', '$F{GetAuthToken}')
  .withJson({
    'Item': 'Sword',
    'CreatedAt': '$F{GetTimeStamp}'
  });
```

Data functions also accepts custom data as arguments in the form of array. To pass data use comma separated values after handler name `$F{<handler-name>:<arg1>,<arg2>}`.

```javascript
handler.addDataFunHandler('GetFormattedDate', (ctx) => {
  const fmt = ctx.args[0];
  return moment.format(fmt);
});

handler.addDataFunHandler('GetSum', (ctx) => {
  const a = parseInt(ctx.args[0]);
  const b = parseInt(ctx.args[1]);
  return a + b;
});

await pactum.spec()
  .post('/api/order')
  .withJson({
    'Item': 'Sword',
    'CreatedAt': '$F{GetFormattedDate:dddd}',
    'Qty': '$F{GetSum:5,10}'
  });
```

### Data Store

A data store is a reference of custom response data that is received while running API tests. This comes in handy while running integration or e2e API testing to pass data between tests.

See [Integration Testing](#integration-testing) for more information.

## Loading Data

You can load *Data Templates* & *Data Maps* directly from file system using `loadData` function. You can either group your templates & maps inside *templates* & *maps* folders or place them in the root dir by adding suffix *.template* or *.map* to the json files.

```
- data/
  - maps/
    - User.json
  - templates/
    - Address.json
  - Bank.template.json
  - Army.map.json
```

```javascript
stash.loadData(); // by default it looks for a directory `./data`
// or
stash.loadData('/path/to/data/folder');
```

