# pactum

![Build](https://github.com/ASaiAnudeep/pactum/workflows/Build/badge.svg?branch=master)
![Coverage](https://img.shields.io/codeclimate/coverage/ASaiAnudeep/pactum)
![Downloads](https://img.shields.io/npm/dt/pactum)
![Size](https://img.shields.io/bundlephobia/minzip/pactum)
![Platform](https://img.shields.io/node/v/pactum)

**pactum** is a REST API Testing Tool used to write e2e, integration, contract & component (*or service level*) tests. It comes with a powerful *mock server* which can control the state of external dependencies & combines the implementation of a consumer-driven contract library [Pact](https://docs.pact.io) for JavaScript.

##### Why pactum?

* Lightweight.
* Clear & Comprehensive Testing Style.
* Works with **cucumber**, **mocha**, **jest**.
* Elegant Data Management.
* Customizable Assertions & Retry Mechanisms.
* Powerful Mock Server.
* Ideal for *component*, *contract* & *e2e* testing of APIs.

## Documentation

This readme offers an introduction to the library. For more information visit the following links.

* [API Testing](https://github.com/ASaiAnudeep/pactum/wiki/API-Testing)
* [Integration Testing](https://github.com/ASaiAnudeep/pactum/wiki/Integration-Testing)
* [E2E Testing](https://github.com/ASaiAnudeep/pactum/wiki/E2E-Testing)
* [Data Management](https://github.com/ASaiAnudeep/pactum/wiki/Data-Management)
* [Reporting](https://github.com/ASaiAnudeep/pactum/wiki/Reporting)
* [Mock Server](https://github.com/ASaiAnudeep/pactum/wiki/Mock-Server)
* [Component Testing](https://github.com/ASaiAnudeep/pactum/wiki/Component-Testing)
* [Contract Testing](https://github.com/ASaiAnudeep/pactum/wiki/Contract-Testing)
  * [Consumer Testing](https://github.com/ASaiAnudeep/pactum/wiki/Consumer-Testing)
  * [Provider Verification](https://github.com/ASaiAnudeep/pactum/wiki/Provider-Verification)

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

Tests in **pactum** are clear and comprehensive. It uses numerous descriptive methods to build your requests and expectations. 

### Simple Test Cases

#### Using Mocha

Running simple api test expectations.

```javascript
const pactum = require('pactum');

it('should be a teapot', async () => {
  await pactum.spec()
    .get('http://httpbin.org/status/418')
    .expectStatus(418);
});

it('should save a new user', async () => {
  await pactum.spec()
    .post('https://jsonplaceholder.typicode.com/users')
    .withHeaders('Authorization', 'Basic xxxx')
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

#### Using Cucumber

See [pactum-cucumber-boilerplate](https://github.com/ASaiAnudeep/pactum-cucumber-boilerplate) for more details on pactum & cucumber integration.

```javascript
// steps.js
const pactum = require('pactum');
const { Given, When, Then, Before } = require('cucumber');

let spec = pactum.spec();

Before(() => { spec = pactum.spec(); });

Given('I make a GET request to {string}', function (url) {
  spec.get(url);
});

When('I receive a response', async function () {
  await spec.toss();
});

Then('response should have a status {int}', async function (code) {
  spec.response().should.have.status(code);
});
```

```gherkin
Scenario: Check TeaPot
  Given I make a GET request to "http://httpbin.org/status/418"
  When I receive a response
  Then response should have a status 200
```

### Complex HTTP Assertions

It allows verification of returned status codes, headers, body, json objects, json schemas & response times.

Running complex test expectations.

```javascript
it('should have a user with id', () => {
  return pactum.spec()
    .get('/api/users/1')
    .expectStatus(201)
    .expectHeaderContains('content-type', 'application/json')
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
    .expectJsonLikeAt('[0].address[*].city', ['Boston', 'NewYork'])
    .expectResponseTime(100);
});
```

It also allows us to break assertions into multiple steps that makes our expectations much more clearer.

```javascript
const pactum = require('pactum');

describe('Chai Like Assertions', () => {

  let spec = pactum.spec();
  let response;

  it('given a user is requested', () => {
    spec.get('http://localhost:9393/api/users/snow');
  });

  it('should return a response', async () => {
    response = await spec.toss();
  });

  it('should return a status 200', () => {
    spec.response().to.have.status(200);
  });

  it('should return a valid user', async () => {
    spec.response().to.have.json({ name: 'snow'});
  });

});
```
 
Learn more about building requests & validating responses with **pactum** at [API Testing](https://github.com/ASaiAnudeep/pactum/wiki/API-Testing)

## Integration Testing

Integration Testing is defined as a type of testing where software modules or components are logically integrated & tested.

API Integration Testing has many aspects but usually involves passing data between tests or waiting for some action to be reflected in the system.

### Nested Dependent HTTP Calls

```javascript
const pactum = require('pactum');

it('should return all posts and first post should have comments', async () => {
  const postID = await pactum.spec()
    .get('http://jsonplaceholder.typicode.com/posts')
    .expectStatus(200)
    .returns('[0].id');
  await pactum.spec()
    .get(`http://jsonplaceholder.typicode.com/posts/${postID}/comments`)
    .expectStatus(200);
});
```

```javascript
it('create new user', async () => {
  await pactum.spec()
    .post('/api/users')
    .withJson(/* user details */)
    .expectStatus(200)
    .stores('UserID', 'id'); // if response body = { id: 'C001019' }
});

it('validate new user details', async () => {
  await pactum.spec()
    .get('/api/users')
    .withQueryParams('id', '@DATA:STR::UserId@')
    .expectStatus(200);
});
```

### Retry Mechanism

```javascript
await pactum.spec()
  .get('/some/async/operation')
  .retry({
    count: 2,
    delay: 2000,
    strategy: ({res}) => { return res.statusCode === 202 }
  })
  .expectStatus(200);
```

Learn more about these features at [Integration Testing](https://github.com/ASaiAnudeep/pactum/wiki/Integration-Testing)

## e2e Testing

End-To-End testing is a software testing method that validates entire software from starting to end along with its integration with external interfaces.

Pactum allows to

* Share Context
* Set Up & Tear Down
* Reuse Specs

```javascript
const pactum = require('pactum');

describe('user should be able to create an order', () => {

  const test = pactum.e2e('AddNewOrder');

  it('create an order', async () => {
    await test
      .step('CreateOrder') // unique name for the step
      .spec('post order') // spec to run
      .clean('delete order'); // clean up to run at the end
  });

  it('update the created order', async () => {
    await test
      .step('UpdateOrder') // unique name for the step
      .spec('update order'); // spec to run
  });

  it('get created order', async () => {
    await test
      .step('GetOrder') // unique name for the step
      .spec('get order'); // spec to run
  });

  it('clean up', async () => {
    await test.cleanup(); // runs all registered clean up specs in LIFO order
  });

});
```

Learn more about these features at [E2E Testing](https://github.com/ASaiAnudeep/pactum/wiki/E2E-Testing)


## Mock Server

Mock Server allows you to mock any server or service via HTTP or HTTPS, such as a REST endpoint. Simply it is a simulator for HTTP-based APIs.

**pactum** can act as a standalone *mock server* or as a *service virtualization* tool. It comes with a **powerful request & response matching** and out of the box **Data Management**.

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

pactum.mock.start(3000);
```

Learn more about **pactum** as a *mock server* at [Mock Server](https://github.com/ASaiAnudeep/pactum/wiki/Mock-Server)


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
  return pactum.spec()
    // adds interaction to mock server & removes it after the spec
    .useMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/api/address/4'
      },
      willRespondWith: {
        status: 200,
        body: {
          city: 'WinterFell',
          country: 'The North'
        }
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
  await pactum.spec()
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



# Notes

Inspired from [frisby](https://docs.frisbyjs.com/) testing style & [pact](https://docs.pact.io) interactions.

----------------------------------------------------------------------------------------------------------------

<a href="https://github.com/ASaiAnudeep/pactum/wiki/API-Testing" >
  <img src="https://img.shields.io/badge/NEXT-API%20Testing-blue" alt="API Testing" align="right" style="display: inline;" />
</a>
