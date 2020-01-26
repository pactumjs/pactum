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
    * [HTTP Methods](#http-methods)


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

[Table of contents](#table-of-contents)

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

[Table of contents](#table-of-contents)

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