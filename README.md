# pactum

![Build](https://github.com/ASaiAnudeep/pactum/workflows/Build/badge.svg?branch=master)
![Coverage](https://img.shields.io/codeclimate/coverage/ASaiAnudeep/pactum)
![Downloads](https://img.shields.io/npm/dt/pactum)
![Size](https://img.shields.io/bundlephobia/minzip/pactum)
![Platform](https://img.shields.io/node/v/pactum)

**pactum** is a REST API Testing Tool used to write e2e, integration, contract & component or service level tests. It comes with a powerful *mock server* which can control the state of external dependencies & combines the implementation of a consumer-driven contract library [Pact](https://docs.pact.io) for JavaScript.

This library is used with test runners like **cucumber**, **mocha** or **jest**. It is *simple*, *fast*, *easy* and *fun* to use.

## Documentation

This readme offers an introduction to the library. For more information visit the following links.

* [API Testing](https://github.com/ASaiAnudeep/pactum/wiki)
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

# install a test runner to run pactum tests
# mocha / jest / cucumber
npm install --save-dev mocha
```

# Usage

**pactum** can be used for all levels of testing in a test pyramid. It can also act as an standalone mock server to generate contracts for consumer driven contract testing.

## API Testing

Tests in **pactum** are clear and comprehensive. It uses numerous descriptive methods to build your requests and expectations. Learn more about these methods at [API Testing](https://github.com/ASaiAnudeep/pactum/wiki/API-Testing).

### Simple Test Cases

Running simple api test expectations.

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

It allows verification of returned status codes, headers, body, json objects, json schemas & response times. Learn more about available assertions at [API Testing](https://github.com/ASaiAnudeep/pactum/wiki/API-Testing)

Running complex component test expectations.

```javascript
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
    .expectJsonQueryLike('[0].address[*].city', ['Boston', 'NewYork'])
    .expectResponseTime(100);
});
```

It also allows us to make assertions in a more descriptive way.

```javascript
const pactum = require('../../src/index');
const expect = pactum.expect;

describe('Chai Like Assertions', () => {

  let request = pactum.spec();
  let response;

  it('given a user is requested', () => {
    request.get('http://localhost:9393/api/users/snow');
  });

  it('should return a response', async () => {
    response = await request.toss();
  });

  it('should return a status 200', () => {
    expect(response).to.have.status(200);
  });

  it('should return a valid user', async () => {
    expect(response).to.have.json({ name: 'snow'});
  });

});
```

We can add custom expect handlers that are ideal to make assertions that are specific to our use case. We can take advantage of popular assertion libraries like [chai](https://www.npmjs.com/package/chai)

```javascript
await pactum
  .post('https://jsonplaceholder.typicode.com/posts')
  .withJson({
    title: 'foo',
    body: 'bar',
    userId: 1
  })
  .expectStatus(201)
  .expect(({res}) => { /* Custom Assertion Code */ });
```

### Nested Dependent HTTP Calls

API testing is naturally asynchronous, which can make tests complex when these tests need to be chained. **Pactum** allows us to return custom data from the response that can be passed to next tests using [json-query](https://www.npmjs.com/package/json-query) or custom handler functions. Learn more about it at [API Testing](https://github.com/ASaiAnudeep/pactum/wiki/API-Testing)

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
```

### Retry Mechanism

Some API operations will take time & for such scenarios **pactum** allows us to add custom retry handlers that will wait for specific conditions to happen before attempting to make assertions on the response.  

```javascript
await pactum
  .get('https://jsonplaceholder.typicode.com/posts/12')
  .retry({
    count: 2,
    delay: 2000,
    strategy: ({res}) => { return res.statusCode === 202 }
  })
  .expectStatus(200);
```

### Data Management

Data management is made easy with this library by using the concept of *Data Templates* & *Data Maps*. Learn more about data management with **pactum** at [API Testing](https://github.com/ASaiAnudeep/pactum/wiki/API-Testing)

```javascript
const stash = pactum.stash;

stash.loadDataTemplate({
  'User.New': {
    FirstName: 'Jon',
    LastName: 'Snow'
  }      
});

await pactum
  .post('/api/users')
  // json will be replaced with above template & overrides last name
  .withJson({
    '@DATA:TEMPLATE@': 'User.New',
    '@OVERRIDES@': {
      'LastName': 'Dragon'
    }
  });
```

Learn more about api testing with **pactum** at [API Testing](https://github.com/ASaiAnudeep/pactum/wiki/API-Testing)

## Component Testing

Component testing is defined as a software testing type, in which the testing is performed on each component separately without integrating with other components. So the service under test might be talking to a mock server, instead of talking to real external services.

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
    // adds interaction to mock server & removes it after the spec
    .useInteraction({
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
const mock = pactum.mock;
const consumer = pactum.consumer;

before(async () => {
  consumer.setConsumerName('consumer-service');
  await mock.start();
});

it('GET - one interaction', async () => {
  await pactum
    .usePactInteraction({
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
  await mock.stop();
  await consumer.publish(/* publish options */);
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
