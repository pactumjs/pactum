# pactum

![Build](https://github.com/ASaiAnudeep/pactum/workflows/Build/badge.svg?branch=master)
![Coverage](https://img.shields.io/codeclimate/coverage/ASaiAnudeep/pactum)
![Downloads](https://img.shields.io/npm/dt/pactum)
![Size](https://img.shields.io/bundlephobia/minzip/pactum)
![Platform](https://img.shields.io/node/v/pactum)

**pactum** is a REST API Testing Tool used for e2e testing, integration testing, component testing & contract testing of API endpoints. It comes with a *mock server* & combines the implementation of a consumer-driven contract library [Pact](https://docs.pact.io) for JavaScript.

In simple words, **pactum** helps in testing API endpoints. It comes with an HTTP server that acts as a mock server or a service virtualization tool which enables us to control the state of all external dependencies. It is *simple*, *fast*, *easy* and *fun* to use.

## Documentation

Learn more about **pactum** from following links

* [Pactum](https://github.com/ASaiAnudeep/pactum/wiki)
* [Component Testing](https://github.com/ASaiAnudeep/pactum/wiki/Component-Testing)
* [Contract Testing](https://github.com/ASaiAnudeep/pactum/wiki/Contract-Testing)
  * [Consumer Testing](https://github.com/ASaiAnudeep/pactum/wiki/Consumer-Testing)
  * [Provider Verification](https://github.com/ASaiAnudeep/pactum/wiki/Provider-Verification)
* [Interactions](https://github.com/ASaiAnudeep/pactum/wiki/Interactions)
* [Mock Server](https://github.com/ASaiAnudeep/pactum/wiki/Mock-Server)

## Installation

```shell
# install pactum as a dev dependency
npm install --save-dev pactum

# install a test framework to run pactum tests
# mocha / jest / jasmine
npm install --save-dev mocha
```

# Usage

pactum can be used for

* [Component Testing](https://github.com/ASaiAnudeep/pactum/wiki/Component-Testing)
* [Contract Testing](https://github.com/ASaiAnudeep/pactum/wiki/Contract-Testing)
* [Mock Server](https://github.com/ASaiAnudeep/pactum/wiki/Mock-Server)

## Component Testing

Component testing is defined as a software testing type, in which the testing is performed on each component separately without integrating with other components.  

### Simple Component Test Cases

Tests in **pactum** are clear and comprehensive. It uses numerous descriptive methods to build your request and expectations. Learn more about these methods at [Component Testing](https://github.com/ASaiAnudeep/pactum/wiki/Component-Testing).

Running simple component test expectations.

```javascript
const pactum = require('pactum');

it('should be a teapot', async () => {
  await pactum
    .get('http://httpbin.org/status/418')
    .expectStatus(418);
});

it('should save a new user', async () => {
  await pactum
    .post('https://jsonplaceholder.typicode.com/users')
    .withHeader('Authorization', 'Basic xxxx')
    .withJson({
      name: 'bolt',
      email: 'bolt@swift.run'
    })
    .expectStatus(200);
});
```

```shell
# mocha is a test framework to execute test cases
mocha /path/to/test
```

### Complex HTTP Assertions

**Pactum** can make numerous assertions on HTTP responses. It allows verification of returned status codes, headers, json objects, json schemas & response times. Learn more about available assertions at [Component Testing](https://github.com/ASaiAnudeep/pactum/wiki/Component-Testing)

Running complex component test expectations.

```javascript
const pactum = require('pactum');

it('should have a user with id', () => {
  return pactum
    .get('https://jsonplaceholder.typicode.com/users/1')
    .expectStatus(201)
    .expectHeaderContains('content-type', 'application/json')
    // performs deep equal
    .expectJson([
      {
        "id": 1,
        "name": "Bolt",
        "createdAt": "2020-08-19T14:26:44.169Z",
        "address": [
          {
            "city": "Boston",
            "zip": "523004"
          },
          {
            "city": "NewYork",
            "zip": "690323"
          }
        ]
      }
    ])
    // performs partial deep equal
    .expectJsonLike([
      {
        "id": /\d+/,
        "name": "Bolt",
        "address": [
          {
            "city": "NewYork"
          }
        ]
      }
    ])
    .expectJsonSchema({
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'number'
          }
        }
      }
    })
    .expectJsonQuery('[0].name', 'Bolt')
    .expectJsonQueryLike('[0].address[*].city', ['Boston', 'NewYork'])
    .expectResponseTime(100);
});
```

It also allows us to add custom expect handlers that are ideal to make assertions that are specific to your case. You can bring your own assertion library or take advantage of popular assertion libraries like [chai](https://www.npmjs.com/package/chai)

```javascript
const pactum = require('pactum');

pactum.handler.addExpectHandler('isNewPost', (req, res) => { /* Custom Assertion Code */})

it('should add a new post', () => {
  return pactum
    .post('https://jsonplaceholder.typicode.com/posts')
    .withJson({
      title: 'foo',
      body: 'bar',
      userId: 1
    })
    .expectStatus(201)
    .expect('isNewPost')
    .expect((req, res) => { /* Custom Assertion Code */ });
});
```

### Nested Dependent HTTP Calls

API testing is naturally asynchronous, which can make tests complex when these tests need to be chained. **Pactum** allows us to return custom data from the response that can be passed to next tests using [json-query](https://www.npmjs.com/package/json-query) or custom functions.

```javascript
const pactum = require('pactum');
const expect = require('chai').expect;

it('should return all posts and first post should have comments', async () => {
  const postID = await pactum
    .get('http://jsonplaceholder.typicode.com/posts')
    .expectStatus(200)
    .returns('[0].id');
  const response = await pactum
    .get(`http://jsonplaceholder.typicode.com/posts/${postID}/comments`)
    .expectStatus(200);
  const comments = response.json;
  expect(comments).deep.equals([]);
});

pactum.handler.addReturnHandler('GetFirstPostId', (req, res) => { return res.json[0].id; });

it('return multiple data', async () => {
  const ids = await pactum
    .get('http://jsonplaceholder.typicode.com/posts')
    .expectStatus(200)
    .returns('GetFirstPostId')
    .returns((req, res) => { return res.json[1].id; });
  await pactum
    .get(`http://jsonplaceholder.typicode.com/posts/${ids[0]}/comments`)
    .expectStatus(200);
  await pactum
    .get(`http://jsonplaceholder.typicode.com/posts/${ids[1]}/comments`)
    .expectStatus(200);
});
```

### State Handlers

State handlers helps us to set up data or getting the application into specific state. **pactum** run these state handlers before making a request.

```javascript
const pactum = require('pactum');
const handler = require('pactum/handler');
const db = require('path/to/db');

handler.addStateHandler('there are no users', async (ctx) => { 
  await db.clearUsers();
});

it('should get an user', async () => {
  await pactum
    .setState('there are no users')
    .get('/api/users')
    .expectJson([]);
});


handler.addStateHandler('there is a user in the system', async (ctx) => { 
  await db.addUser(ctx.data);
});

it('should get an user', async () => {
  await pactum
    .setState('there is a user in the system', { name: 'snow' })
    .get('/api/users')
    .expectStatus(200);
});
```

### Retry Mechanism

**pactum** also allows us to add custom retry handlers that are ideal to wait for specific conditions to happen before attempting to make assertions on the response.  

```javascript
const pactum = require('pactum');

it('should get the newly added post', async () => {
  await pactum
    .get('https://jsonplaceholder.typicode.com/posts/12')
    .retry({
      count: 2,
      delay: 2000,
      strategy: (req, res) => { return res.statusCode === 202 }
    })
    .expectStatus(200);
});

pactum.handler.addRetryHandler('waitForPost', (req, res) => { /* Custom Retry Strategy Code */});

it('should get the newly added post', async () => {
  await pactum
    .get('https://jsonplaceholder.typicode.com/posts/12')
    .retry({
      strategy: 'waitForPost' // Default Count: 3 & Delay: 1000 milliseconds
    })
    .expectStatus(200);
});
```

### Mocking External Services (Dependencies)

During component testing, the service under test might be talking to other external services. Instead of talking to real external services, it will be communicating with a mock server.

**Pactum** comes with a mock server where you will able to control the behavior of each external service. Interactions are a way to instruct the mock server to simulate the behavior of external services. Learn more about interactions at [Interactions](https://github.com/ASaiAnudeep/pactum/wiki/Interactions).

Running a component test expectation with mocking an external dependency.

```javascript
const pactum = require('pactum');

before(() => {
  // starts a mock server on port 3000
  return pactum.mock.start(3000);
});

it('should get jon snow details', () => {
  return pactum
    // adds interaction to mock server
    .addInteraction({
      get: '/api/address/4',
      return: {
        city: 'WinterFell',
        country: 'The North'
      }
    })
    .get('http://localhost:3333/users/4')
    .expectStatus(200)
    .expectJson({
      id: 4,
      name: 'Jon Snow',
      address: {
        city: 'WinterFell',
        country: 'The North'
      }
    });
});

after(() => {
  return pactum.mock.stop();
});
```

Learn more about component testing with **pactum** at [Component Testing](https://github.com/ASaiAnudeep/pactum/wiki/Component-Testing)

## Contract Testing

Contract Testing is a technique for testing interactions between applications (often called as services) that communicate with each other, to ensure the messages they send or receive conform to a shared understanding that is documented in a **contract**.

Learn more about contract testing at [pact.io](https://docs.pact.io)

Learn more about contract testing with **pactum** at [Contract Testing](https://github.com/ASaiAnudeep/pactum/wiki/Contract-Testing)

[![Contract Testing](https://img.youtube.com/vi/-6x6XBDf9sQ/0.jpg)](https://www.youtube.com/watch?v=-6x6XBDf9sQ)

Contract Testing has two steps

1. Defining Consumer Expectations (**Consumer Testing**)
2. Verifying Expectations on Provider (**Provider Verification**)

### Consumer Testing

Running a consumer test with the help of a *mock server* & a single pact interaction. 
If the pact interaction is not exercised, the test will fail.

```javascript
const pactum = require('pactum');

before(async () => {
  await pactum.mock.start();
});

it('GET - one interaction', async () => {
  await pactum
    .addPactInteraction({
      provider: 'projects-service',
      state: 'when there is a project with id 1',
      uponReceiving: 'a request for project 1',
      withRequest: {
        method: 'GET',
        path: '/api/projects/1'
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    })
    .get('http://localhost:9393/api/projects/1')
    .expectStatus(200)
    .expectJsonLike({
      id: 1,
      name: 'fake'
    });
});

after(async () => {
  await pactum.mock.stop();
});
```
Learn more about **pactum** as a consumer tester at [Consumer Testing](https://github.com/ASaiAnudeep/pactum/wiki/Consumer-Testing)

### Provider Verification

Running a provider verification test with the help of a [pact broker](https://github.com/pact-foundation/pact_broker). 

```javascript
await pactum.provider.validate({
  pactBrokerUrl: 'http://pact-broker:9393',
  providerBaseUrl: 'http://user-service:3000',
  provider: 'user-service',
  providerVersion: '1.2.3'
});
```

Learn more about **pactum** as a provider verifier at [Provider Verification](https://github.com/ASaiAnudeep/pactum/wiki/Provider-Verification)

## Mock Server

Mock Server allows you to mock any server or service via HTTP or HTTPS, such as a REST endpoint. Simply it is a simulator for HTTP-based APIs.

**pactum** can act as a standalone *mock server* or as a *service virtualization* tool. It comes with a powerful request & response matching.

Running **pactum** as a standalone *mock server*.

```javascript
const pactum = require('pactum');
const { regex } = pactum.matchers;

pactum.mock.addMockInteraction({
  withRequest: {
    method: 'GET',
    path: '/api/projects',
    query: {
      date: regex(/^\d{4}-\d{2}-\d{2}$/)
    }
  },
  willRespondWith: {
    status: 200,
    headers: {
      'content-type': 'application/json'
    },
    body: {
      id: 1,
      name: 'fake'
    }
  }
});

pactum.mock.addInteractions([
  {
    get: '/api/user/1'
    return: {
      name: 'stark'
    }
  },
  {
    get: '/api/user/2'
    status: 404
  }
]);

pactum.mock.start(3000);
```

Learn more about **pactum** as a *mock server* at [Mock Server](https://github.com/ASaiAnudeep/pactum/wiki/Mock-Server)

# Notes

Inspired from [frisby](https://docs.frisbyjs.com/) testing style & [pact](https://docs.pact.io) interactions.

----------------------------------------------------------------------------------------------------------------

<a href="https://github.com/ASaiAnudeep/pactum/wiki/Component-Testing" >
  <img src="https://img.shields.io/badge/NEXT-Component%20Testing-blue" alt="Component Testing" align="right" style="display: inline;" />
</a>
