# pactum

## Introduction
pactum is a REST API Testing Tool that combines the implementation of consumer driven contract library [Pact](https://docs.pact.io) for Javascript.

## Installation

```
npm install --save-dev pactum
npm install --save-dev mocha
```

## Usage

Running a single component test expectation.

```javascript
const pactum = require('pactum');

it('should be a teapot', async () => {
  await pactum
    .get('http://httpbin.org/status/418')
    .expectStatus(418)
    .toss();
});
```

```bash
# mocha is a test framework
mocha /path/to/test
```

Running a component test with the help of a mock server & a single mock interaction. If the mock interaction is not exercised, the test will fail.

```javascript
const pactum = require('pactum');

before(async () => {
  await pactum.mock.start();
});

it('GET - one interaction', async () => {
  await pactum
    .addMockInteraction({
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

Running a component test with the help of a mock server & a single pact interaction. If the mock interaction is not exercised, the test will fail.

```javascript
const pactum = require('pactum');

before(async () => {
  await pactum.mock.start();
});

it('GET - one interaction', async () => {
  await pactum
    .addPactInteraction({
      consumer: 'little-consumer',
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

## Table of contents

* [Introduction](#introduction)
* [Installation](#installation)
* [Usage](#usage)
* [Table of contents](#table-of-contents)
* [Getting Started](#getting-started)
  * [Basics](#basics)
  * [HTTP Request](#http-request)
* [Component Testing](#component-testing)
* [Component Testing with Mock Server](#component-testing-with-mock-server)

## Getting Started

### Basics

| Method       | Description                                  |
| ----------   | -------------------------------------------- |
| get          | performs a GET request on the resource       |
| expectStatus | expects a status code on the response        |
| toss         | executes the test case and returns a promise |

Create a javascript file named `test.js`

```javascript
// imports pactum library
const pactum = require('pactum');

// this is a test step in mocha
it('should be a teapot', async () => {
  await pactum                              // pactum returns a promise
    .get('http://httpbin.org/status/200')   // will fetch a response from the url
    .expectStatus(200)                      // sets an expectation on the response
    .toss();                                // executes the test case
});
```

Running the test with [mocha](https://mochajs.org/#getting-started)
```bash
mocha /path/to/test.js
```

[^ TOC](#table-of-contents)

### HTTP Request

HTTP requests are messages sent by the client to initiate an action on the server.

| Method                     | Description                                       |
| -------------------------- | ------------------------------------------------- |
| `get('url')`               | this is a HTTP method to be performed on resource |
| `withQuery('postId', '1')` | set of parameters attached to the url             |
| `withHeaders({})`          | request headers                                   |
| `withBody('Hello')`        | request body                                      |
| `withJson({id: 1})`        | request json object                               |

```javascript
const pactum = require('pactum');

// performs a get request with query
it('GET - with query', async () => {
  await pactum
    .get('https://jsonplaceholder.typicode.com/comments')
    .withQuery('postId', 1)
    .withQuery('id', 1)
    .expectStatus(200)
    .toss();
});

// performs a post request with JSON
it('POST', async () => {
  await pactum
    .post('https://jsonplaceholder.typicode.com/posts')
    .withJson({
      title: 'foo',
      body: 'bar',
      userId: 1
    })
    .expectStatus(201)
    .toss();
});

// performs a post request with headers & body
it('POST - with body', async () => {
  await pactum
    .post('https://jsonplaceholder.typicode.com/posts')
    .withHeaders({
      "content-type": "application/json"
    })
    .withBody({
      title: 'foo',
      body: 'bar',
      userId: 1
    })
    .expectStatus(201)
    .toss();
});
```

[^ TOC](#table-of-contents)

#### HTTP Methods

The request method indicates the method to be performed on the resource identified by the given Request-URI.

| Method   | Description                                | Usage                                 |
| -------- | ------------------------------------------ | ------------------------------------- |
| get      | performs a GET request on the resource     | `await pactum.get('url').toss()`      |
| post     | performs a POST request on the resource    | `await pactum.post('url').toss()`     |
| put      | performs a PUT request on the resource     | `await pactum.put('url').toss()`      |
| delete   | performs a DELETE request on the resource  | `await pactum.delete('url').toss()`   |
| patch    | performs a PATCH request on the resource   | `await pactum.patch('url').toss()`    |
| head     | performs a HEAD request on the resource    | `await pactum.head('url').toss()`     |

```javascript
// performs a delete request
it('DELETE', async () => {
  await pactum
    .delete('https://jsonplaceholder.typicode.com/posts/1')
    .expectStatus(200)
    .toss();
});
```

[^ TOC](#table-of-contents)

### HTTP Expectations

| Method                                  | Description                                                                 |
| --------------------------------------- | --------------------------------------------------------------------------- |
| `expectStatus(201)`                     | check HTTP status                                                           |
| `expectHeader('key', 'value')`          | check HTTP header key + value (RegExp)                                      |
| `expectHeaderContains('key', 'value')`  | check HTTP header key contains partial value (RegExp)                       |
| `expectBody('value')`                   | check exact match of body                                                   |
| `expectBodyContains('value')`           | check body contains the value (RegExp)                                      |
| `expectJson({json})`                    | check exact match of json                                                   |
| `expectJsonLike({json})`                | check json contains partial value (RegExp)                                  |
| `expectJsonSchema({schema})`            | validate [json-schema](https://json-schema.org/learn/)          |
| `expectJsonQuery('path', 'value')`      | validate [json-query](https://www.npmjs.com/package/json-query)  |
| `expectResponseTime(10)`                | check if request completes within a specified duration (ms)                 |

```javascript
const pactum = require('pactum');

it('GET', async () => {
  await pactum
    .get('https://jsonplaceholder.typicode.com/posts/1')
    .expectStatus(200)
    .expectHeader('content-type', 'application/json; charset=utf-8')
    .expectHeader('connection', /\w+/)
    .expectHeaderContains('content-type', 'application/json')
    .expectJson({
      "userId": 1,
      "id": 1,
      "title": "some title",
      "body": "some body"
    })
    .expectJsonLike({
      userId: 1,
      id: 1
    })
    .expectJsonLike({
      title: "some title",
      body: "some body"
    })
    .expectJsonSchema({
      "properties": {
        "userId": {
          "type": "number"
        }
      },
      "required": ["userId", "id"]
    })
    .expectJsonSchema({
      "properties": {
        "title": {
          "type": "string"
        }
      },
      "required": ["title", "body"]
    })
    .expectResponseTime(1000)
    .toss();
});
```

[^ TOC](#table-of-contents)

## Component Testing

Read more about testing RESTFull services [here](#http-request)

Component testing is defined as a software testing type, in which the testing is performed on each individual component separately without integrating with other components.

Lets assume you have an order-service which is a RESTFull API service running on port 3000. Here if the order-service has external dependencies, they are mocked separately.

```javascript
const pactum = require('pactum');

it('should fetch order details', async () => {
  await pactum
    // assume you have an order-service running locally on port 3000
    .get('http://localhost:3000/api/orders/123')
    // set an expectation of 200
    .expectStatus(200)
    // set an expectation on the response body
    .expectJson({
      orderId: '123',
      price: '3030',
      currency: 'INR'
    })
    // execute the test case
    .toss();
});
```

[^ TOC](#table-of-contents)

## Component Testing with Mock Server

Read more about component testing [here](#component-testing)

Lets assume you have an order-service which is a RESTFull API service running on port 3000. Consider if order-service depends on a currency-service to fetch the prices. If you make a call to fetch the order details, order-service internally calls the currency-service to fetch price details.

Start the order-service & overwrite the endpoint of currency-service to http://localhost:9393

```javascript
const pactum = require('pactum');

before(async () => {
  // start the mock service on port 9393 (port number can be modified)
  await pactum.mock.start();
});

it('should fetch order details', async () => {
  await pactum
    // assume order-service makes a call to currency-service with method - GET & path - http://localhost:9393/api/currency/INR
    // here we are training the mock server to act as currency-service
    // if the order-service fails to make a call to this endpoint, the test will fail with - Interaction Not Exercised
    // after the execution of this spec, the mock interaction will be removed
    .addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/api/currency/INR'
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 'INR',
          description: 'Indian Rupee'
        }
      }
    })
    // assume you have an order-service running locally on port 3000
    .get('http://localhost:3000/api/orders/123')
    // set an expectation of 200
    .expectStatus(200)
    // set an expectation on the response body
    .expectJson({
      orderId: '123',
      price: '3030',
      currency: 'INR'
    })
    // execute the test case
    .toss();
});

after(async () => {
  // stop the mock service on port 9393
  await pactum.mock.stop();
});
```

If the order-service interacts with multiple services, we can add multiple mock interactions.

```javascript
const pactum = require('pactum');

before(async () => {
  // start the mock service on port 9393 (port number can be modified)
  await pactum.mock.start();
});

it('should fetch order details', async () => {
  await pactum
    // if the order-service fails to make a call to this endpoint, the test will fail with - Interaction Not Exercised
    .addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/api/currency/INR'
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 'INR',
          description: 'Indian Rupee'
        }
      }
    })
    // if the order-service fails to make a call to this endpoint, the test will fail with - Interaction Not Exercised
    .addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/api/allocations/123'
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: [12, 13]
      }
    })
    // assume you have an order-service running locally on port 3000
    .get('http://localhost:3000/api/orders/123')
    // set an expectation of 200
    .expectStatus(200)
    // set an expectation on the response body
    .expectJson({
      orderId: '123',
      price: '3030',
      currency: 'INR'
    })
    // execute the test case
    .toss();
});

after(async () => {
  // stop the mock service on port 9393
  await pactum.mock.stop();
});
```

Each mock interaction will be removed after the completion of the current spec. To add mock interactions that will intact for all the specs use `pactum.mock.addDefaultMockInteraction({})`

```javascript
const pactum = require('pactum');

before(async () => {
  // start the mock service on port 9393 (port number can be modified)
  await pactum.mock.start();

  // add a default mock interaction
  pactum.mock.addDefaultMockInteraction({
    withRequest: {
      method: 'GET',
      path: '/api/currency/INR'
    },
    willRespondWith: {
      status: 200,
      headers: {
        'content-type': 'application/json'
      },
      body: {
        id: 'INR',
        description: 'Indian Rupee'
      }
    }
  })
});

it('should fetch order details for id 123', async () => {
  await pactum
    // assume you have an order-service running locally on port 3000
    .get('http://localhost:3000/api/orders/123')
    // set an expectation of 200
    .expectStatus(200)
    // set an expectation on the response body
    .expectJson({
      orderId: '123',
      price: '3030',
      currency: 'INR'
    })
    // execute the test case
    .toss();
});

it('should fetch order details for id 124', async () => {
  await pactum
    // assume you have an order-service running locally on port 3000
    .get('http://localhost:3000/api/orders/124')
    // set an expectation of 200
    .expectStatus(200)
    // set an expectation on the response body
    .expectJson({
      orderId: '124',
      price: '5643',
      currency: 'INR'
    })
    // execute the test case
    .toss();
});

after(async () => {
  // removes all default interactions
  pactum.mock.removeDefaultInteractions();
  
  // stop the mock service on port 9393
  await pactum.mock.stop();
});
```