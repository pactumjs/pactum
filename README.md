# pactum

![Build](https://github.com/ASaiAnudeep/pactum/workflows/Build/badge.svg?branch=master)
![Coverage](https://img.shields.io/codeclimate/coverage/ASaiAnudeep/pactum)

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

### Simple Component Test Case

Running a single component test expectation.

```javascript
const pactum = require('pactum');

it('should be a teapot', async () => {
  await pactum
    .get('http://httpbin.org/status/418')
    .expectStatus(418);
});
```

```shell
# mocha is a test framework to execute test cases
mocha /path/to/test
```

### Complex HTTP Assertions

**Pactum** can make numerous assertions on HTTP responses. It allows verification of returned status codes, headers, json objects, json schemas & response times.

Running a complex component test expectation.

```javascript
const pactum = require('pactum');

it('should add a new post', () => {
  return pactum
    .post('https://jsonplaceholder.typicode.com/posts')
    .withJson({
      title: 'foo',
      body: 'bar',
      userId: 1
    })
    .withHeaders({
      "Authorization": "Basic xxxx"
    })
    .expectStatus(201)
    .expectHeader('content-type', 'application/json; charset=utf-8')
    .expectJson({
      id: '1',
      users: [
        {
          name: 'Mike'
          country: 'IND'
        },
        {
          name: 'Mac'
          country: 'US'
        }
      ]
    })
    .expectJsonSchema({
      type: 'object',
      properties: {
        id: {
          type: 'number'
        }
      },
      required: ['id']
    })
    .expectJsonQuery('users[0].name', 'Mike')
    .expectJsonQueryLike('users[*].country', ['IND', 'US'])
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

It also allows us to add custom retry handlers that are ideal to wait for specific conditions to happen before attempting to make assertions on the response.  

```javascript
const pactum = require('pactum');

it('should get the newly added post', () => {
  return pactum
    .get('https://jsonplaceholder.typicode.com/posts/12')
    .retry({
      count: 2,
      delay: 2000,
      strategy: (req, res) => { return res.statusCode === 202 }
    })
    .expectStatus(200);
});

pactum.handler.addRetryHandler('waitForPost', (req, res) => { /* Custom Retry Strategy Code */});

it('should get the newly added post', () => {
  return pactum
    .get('https://jsonplaceholder.typicode.com/posts/12')
    .retry({
      strategy: 'waitForPost' // Default Count: 3 & Delay: 1000 milliseconds
    })
    .expectStatus(200);
});

```

### Nested Dependent HTTP Calls

API testing is naturally asynchronous, which can make tests complex when these tests need to be chained. **Pactum** allows us to return custom data from the response that can be passed to next tests using [json-query](https://www.npmjs.com/package/json-query) or custom functions.

```javascript
const pactum = require('pactum');

it('should return all posts and first post should have comments', async () => {
  const postID = await pactum
    .get('http://jsonplaceholder.typicode.com/posts')
    .expectStatus(200)
    .return('[0].id');
  await pactum
    .get(`http://jsonplaceholder.typicode.com/posts/${postID}/comments`)
    .expectStatus(200);
});

pactum.handler.addReturnHandler('GetFirstPostId', (req, res) => { return res.json[0].id; });

it('return multiple data', async () => {
  const ids = await pactum
    .get('http://jsonplaceholder.typicode.com/posts')
    .expectStatus(200)
    .return('GetFirstPostId')
    .return((req, res) => { return res.json[1].id; });
  await pactum
    .get(`http://jsonplaceholder.typicode.com/posts/${ids[0]}/comments`)
    .expectStatus(200);
  await pactum
    .get(`http://jsonplaceholder.typicode.com/posts/${ids[1]}/comments`)
    .expectStatus(200);
});
```

### Mocking External Services (Dependencies)

During component testing, the service under test might be talking to other external services. Instead of talking to real external services, it will be communicating with a mock server.

**Pactum** comes with a mock server where you will able to control the behavior of each external service. Interactions are a way to instruct the mock server to simulate the behavior of external services.

Running a component test expectation with mocking external dependency (AWS DynamoDB).

```javascript
const pactum = require('pactum');

before(() => {
  // starts a mock server on port 3000
  return pactum.mock.start(3000);
});

it('should not get non existing user', () => {
  return pactum
    // adds interaction to mock server
    .addMockInteraction({
      withRequest: {
        method: 'POST',
        path: '/',
        headers: {
          'x-amz-target': 'DynamoDB_20120810.GetItem'
        },
        body: {
          Key: { UserName: { S: 'brave' } },
          TableName: 'Users'
        }
      },
      willRespondWith: {
        status: 200,
        body: { Items: [] }
      }
    })
    .get('http://localhost:3333/users')
    .withQuery('name', 'brave')
    .expectStatus(404);
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
    })
    .toss();
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

pactum.mock.addDefaultMockInteraction({
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

# Notes

Inspired from [frisby](https://docs.frisbyjs.com/) testing style & [pact](https://docs.pact.io) interactions.

----------------------------------------------------------------------------------------------------------------

<a href="https://github.com/ASaiAnudeep/pactum/wiki/Component-Testing" >
  <img src="https://img.shields.io/badge/NEXT-Component%20Testing-blue" alt="Component Testing" align="right" style="display: inline;" />
</a>
