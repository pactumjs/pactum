# pactum

## Introduction
pactum is a REST API Testing Tool that combines the implementation of consumer driven contract library [Pact](https://docs.pact.io) for Javascript.

## Installation

```
npm install --save-dev pactum
npm install --save-dev mocha
```

## Table of contents

* [Introduction](#introduction)
* [Installation](#installation)
* [Table of contents](#table-of-contents)
* [Usage](#usage)
* [Getting Started](#getting-started)
  * [Basics](#basics)
  * [HTTP Request](#http-request)
* [Component Testing](#component-testing)
* [Component Testing with Mock Server](#component-testing-with-mock-server)
  * [Mock Interaction](#mock-interaction)
* [Contract Testing with Mock Server](#contract-testing-with-mock-server)
  * [Pact Interaction](#pact-interaction)
* [Mock Server](https://github.com/ASaiAnudeep/pactum/tree/master/docs/mock-server.md "Mock Server")

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

Lets assume you have an order-service which is a RESTFull API service running on port 3000.
Here if the order-service has external dependencies, they are mocked using different library.

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

Lets assume you have an order-service which is a RESTFull API service running on port 3000. Consider if order-service depends on a currency-service to fetch the prices.

Start the order-service & overwrite the endpoint of currency-service to http://localhost:9393

```javascript
const pactum = require('pactum');

before(async () => {
  // starts the mock service on port 9393 (port number can be modified)
  await pactum.mock.start();
});

it('should fetch order details', async () => {
  await pactum
    // here we are training the mock server to act as currency-service
    // if the order-service fails to make a call to this endpoint then
    // the test will fail with - Interaction Not Exercised
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
    .get('http://localhost:3000/api/orders/123')
    .expectStatus(200)
    .expectJson({
      orderId: '123',
      price: '3030',
      currency: 'INR'
    })
    .toss();
});

after(async () => {
  // stops the mock service on port 9393 (port number can be modified)
  await pactum.mock.stop();
});
```

If the order-service interacts with multiple services, we can add multiple mock interactions.

```javascript
const pactum = require('pactum');

before(async () => {
  await pactum.mock.start();
});

it('should fetch order details', async () => {
  await pactum
    // if the order-service fails to make a call to this endpoint then
    // the test will fail with - Interaction Not Exercised
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
    // if the order-service fails to make a call to this endpoint then
    // the test will fail with - Interaction Not Exercised
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
    .get('http://localhost:3000/api/orders/123')
    .expectStatus(200)
    .expectJson({
      orderId: '123',
      price: '3030',
      currency: 'INR'
    })
    .toss();
});

after(async () => {
  await pactum.mock.stop();
});
```

The scope of each interaction added through `pactum.addMockInteraction()` will be restricted to current spec (`it` block)
To add mock interactions that will be consumed in all the specs use - `pactum.mock.addDefaultMockInteraction()`

```javascript
const pactum = require('pactum');

before(async () => {
  await pactum.mock.start();

  // adds a default mock interaction
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
    .get('http://localhost:3000/api/orders/123')
    .expectStatus(200)
    .expectJson({
      orderId: '123',
      price: '3030',
      currency: 'INR'
    })
    .toss();
});

it('should fetch order details for id 124', async () => {
  await pactum
    .get('http://localhost:3000/api/orders/124')
    .expectStatus(200)
    .expectJson({
      orderId: '124',
      price: '5643',
      currency: 'INR'
    })
    .toss();
});

after(async () => {
  // removes all default interactions
  pactum.mock.clearDefaultInteractions();
  await pactum.mock.stop();
});
```

[^ TOC](#table-of-contents)

### Mock Interaction

Methods to add a mock interaction:

* `pactum.addMockInteraction()`
* `pactum.mock.addDefaultMockInteraction()`

| Property                | Type    | Required | Description                |
| ----------------------- | ------- | -------- | -------------------------- |
| id                      | string  | optional | id of the interaction      |
| consumer                | string  | optional | name of the consumer       |
| provider                | string  | optional | name of the provider       |
| state                   | string  | optional | state of the provider      |
| uponReceiving           | string  | optional | description of the request |
| withRequest             | object  | required | request details            |
| withRequest.method      | string  | required | HTTP method                |
| withRequest.path        | string  | required | api path                   |
| withRequest.headers     | object  | optional | request headers            |
| withRequest.query       | object  | optional | query parameters           |
| withRequest.body        | any     | optional | request body               |
| withRequest.ignoreQuery | boolean | optional | ignore request query       |
| withRequest.ignoreBody  | boolean | optional | ignore request body        |
| willRespondWith         | object  | required | response details           |
| willRespondWith.status  | number  | required | response status code       |
| willRespondWith.headers | object  | optional | response headers           |
| willRespondWith.body    | any     | required | response body              |

## Contract Testing with Mock Server

Contract testing is a technique for testing an integration point by checking each application in isolation to ensure the messages it sends or receives conform to a shared understanding that is documented in a **contract**.

In a single spec we can use multiple mock interactions & multiple pact interactions.

```javascript
const pactum = require('pactum');

before(async () => {
  await pactum.mock.start();
});

it('should fetch order details', async () => {
  await pactum
    // here we are training the mock server to act as currency-service
    // if the order-service fails to make a call to this endpoint then
    // the test will fail with - Interaction Not Exercised
    // after the execution of this spec, the pact interaction will be removed
    .addPactInteraction({
      consumer: 'order-service',
      provider: 'currency-service',
      state: 'there is INR currency',
      uponReceiving: 'a request for INR currency',
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
    .get('http://localhost:3000/api/orders/123')
    .expectStatus(200)
    .expectJson({
      orderId: '123',
      price: '3030',
      currency: 'INR'
    })
    .toss();
});

after(async () => {
  await pactum.mock.stop();
});
```

[^ TOC](#table-of-contents)

### Pact Interaction

Methods to add a pact interaction:

* `pactum.addPactInteraction()`
* `pactum.mock.addDefaultPactInteraction()`

| Property                | Type    | Required | Description                |
| ----------------------- | ------- | -------- | -------------------------- |
| id                      | string  | optional | id of the interaction      |
| consumer                | string  | required | name of the consumer       |
| provider                | string  | required | name of the provider       |
| state                   | string  | required | state of the provider      |
| uponReceiving           | string  | required | description of the request |
| withRequest             | object  | required | request details            |
| withRequest.method      | string  | required | HTTP method                |
| withRequest.path        | string  | required | api path                   |
| withRequest.headers     | object  | optional | request headers            |
| withRequest.query       | object  | optional | query parameters           |
| withRequest.body        | any     | optional | request body               |
| willRespondWith         | object  | required | response details           |
| willRespondWith.status  | number  | required | response status code       |
| willRespondWith.headers | object  | optional | response headers           |
| willRespondWith.body    | any     | required | response body              |

[^ TOC](#table-of-contents)
