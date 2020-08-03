# Component Testing

Component testing is defined as a software testing type, in which the testing is performed on each component separately without integrating with other components.

These tests are all about testing the functionality of individual service. During this, your service will be talking to other external services. But instead of talking to real external services, they talk to mock versions of external services.

## Table of contents

* [Getting Started](#getting-started)
* [API](#api)
  * [HTTP Requests](#http-requests)
  * [HTTP Methods](#http-methods)
  * [HTTP Expectations](#http-expectations)
  * [Request Settings](#request-settings)
* [Examples](#examples)

## Getting Started

### Simple Test

Let's assume you have an order-service which is a REST API service running on port 3000.
Assuming all the external dependencies of the **order-service** are mocked.

The below code will run an expectation on **order-service**.

```javascript
// imports pactum library
const pactum = require('pactum');

// this is a test step in mocha
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

## API

### HTTP Requests

HTTP requests are messages sent by the client to initiate an action on the server.

#### pactum

| Method                              | Description                               |
| ----------------------------------- | ----------------------------------------- |
| `get('url')`                        | HTTP method                               |
| `withQuery('postId', '1')`          | set of parameters attached to the url     |
| `withQueryParams({'postId': '1'})`  | set of parameters attached to the url     |
| `withHeaders({})`                   | request headers                           |
| `withBody('Hello')`                 | request body                              |
| `withJson({id: 1})`                 | request json object                       |
| `withGraphQLQuery('{ hero }')`      | graphQL query                             |
| `withGraphQLVariables({})`          | graphQL variables                         |
| `withForm({})`                      | object to send as form data               |
| `withMultiPartFormData('','', {})`  | object to send as multi part form data    |
| `__setLogLevel('DEBUG')`            | sets log level for troubleshooting        |
| `__setRequestTimeout(2000)`         | sets request timeout                      |

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

### HTTP Methods

The request method indicates the method to be performed on the resource identified by the given Request-URI.

#### pactum

| Method   | Description                                | Usage                                 |
| -------- | ------------------------------------------ | ------------------------------------- |
| `get`    | performs a GET request on the resource     | `await pactum.get('url').toss()`      |
| `post`   | performs a POST request on the resource    | `await pactum.post('url').toss()`     |
| `put`    | performs a PUT request on the resource     | `await pactum.put('url').toss()`      |
| `delete` | performs a DELETE request on the resource  | `await pactum.delete('url').toss()`   |
| `patch`  | performs a PATCH request on the resource   | `await pactum.patch('url').toss()`    |
| `head`   | performs a HEAD request on the resource    | `await pactum.head('url').toss()`     |

```javascript
// performs a delete request
it('DELETE', async () => {
  await pactum
    .delete('https://jsonplaceholder.typicode.com/posts/1')
    .expectStatus(200)
    .toss();
});
```

### HTTP Expectations

Expectations help to assert the response received from the server.

#### pactum

| Method                                  | Description                                                      |
| --------------------------------------- | ---------------------------------------------------------------- |
| `expect('customHandler')`               | runs custom expect handler                                       |
| `expectStatus(201)`                     | check HTTP status                                                |
| `expectHeader('key', 'value')`          | check HTTP header key + value (RegExp)                           |
| `expectHeaderContains('key', 'value')`  | check HTTP header key contains partial value (RegExp)            |
| `expectBody('value')`                   | check exact match of body                                        |
| `expectBodyContains('value')`           | check body contains the value (RegExp)                           |
| `expectJson({json})`                    | check exact match of json                                        |
| `expectJsonLike({json})`                | check json contains partial value (RegExp)                       |
| `expectJsonSchema({schema})`            | validate [json-schema](https://json-schema.org/learn/)           |
| `expectJsonQuery('path', 'value')`      | validate [json-query](https://www.npmjs.com/package/json-query)  |
| `expectResponseTime(10)`                | check if request completes within a specified duration (ms)      |

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

### Request Settings

Default options are configured for all the requests

### pactum.request

### setBaseUrl
Type: `Function`<br>

Sets the base URL for all the HTTP requests.

```javascript
pactum.request.setBaseUrl('http://localhost:3000');
pactum.get('/api/projects');
// Request will be sent to http://localhost:3000/api/projects
```

### setDefaultTimeout
Type: `Function`<br>

Sets the default timeout for all the HTTP requests.
The default value is 3000ms

```javascript
// sets default timeout to 5000ms
pactum.request.setDefaultTimeout(5000);
```

### setDefaultHeader
Type: `Function`<br>

Sets default headers for all the HTTP requests. The default header will be overridden if provided at the spec level.

```javascript
pactum.request.setDefaultHeader('Authorization', 'Basic xxxxx');
pactum.request.setDefaultHeader('content-type', 'application/json');
```

----------------------------------------------------------------------------------------------------------------

<a href="https://github.com/ASaiAnudeep/pactum/wiki" >
  <img src="https://img.shields.io/badge/PREV-Home-orange" alt="Home" align="left" style="display: inline;" />
</a>
<a href="https://github.com/ASaiAnudeep/pactum/wiki/Contract-Testing" >
  <img src="https://img.shields.io/badge/NEXT-Contract%20Testing-blue" alt="Contract Testing" align="right" style="display: inline;" />
</a>

<br>

----------------------------------------------------------------------------------------------------------------


# Examples

Refer the below examples to get started with component testing.

## Simple Component Tests

```javascript
const pactum = require('pactum');

describe('JSON Placeholder', () => {

  it('GET', async () => {
    await pactum
      .get('https://jsonplaceholder.typicode.com/posts/1')
      .expectStatus(200)
      .expectHeader('content-type', 'application/json; charset=utf-8')
      .expectHeader('connection', /\w+/)
      .expectJsonLike({
        userId: 1,
        id: 1
      })
      .expectJsonSchema({
        "properties": {
          "userId": {
            "type": "number"
          }
        },
        "required": ["userId", "id"]
      })
      .toss();
  });

  it('GET - with query', async () => {
    await pactum
      .get('https://jsonplaceholder.typicode.com/comments')
      .withQuery('postId', 1)
      .expectStatus(200)
      .expectHeaderContains('content-type', 'application/json')
      .expectJsonLike([
        {
          postId: 1,
          id: 1,
          name: /\w+/
        }
      ])
      .toss();
  });

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

  it('PUT', async () => {
    await pactum
      .put('https://jsonplaceholder.typicode.com/posts/1')
      .withJson({
        id: 1,
        title: 'foo',
        body: 'bar',
        userId: 1
      })
      .expectStatus(200)
      .toss();
  });

})
```

## Component Tests With Mock Server

During component testing, your service will be running in a controlled environment. Instead of talking to external services, it will be communicating with a mock server.

**pactum** comes with a mock server where you will able to control the behavior of each external service. *Interactions* are a way to instruct the mock server to simulate the behavior of external services. 

Multiple interactions can be added to the mock server before the execution of a test case through `addMockInteraction` or `addPactInteraction` methods. If these interactions are not exercised then the test case will fail. If an unexpected request is received by the mock server, it will respond with *404* - *Interaction Not Found*. All interactions added at the test case level will be removed after its execution. Use the `__setLogLevel('DEBUG')` method to see the logs from the mock server for troubleshooting purposes.

Learn more about interactions at [Interactions](https://github.com/ASaiAnudeep/pactum/wiki/Interactions)

```javascript
const pactum = require('pactum');

describe('Mock', () => {

  before(async () => {
    await pactum.mock.start();
  });

  it('GET - one interaction - with one query', async () => {
    await pactum
      // this mock interaction will removed after the execution of current spec.
      .addMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/projects/1',
          query: {
            name: 'fake'
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
      })
      .get('http://localhost:9393/api/projects/1')
      .withQuery('name', 'fake')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  it('GET - multiple interactions', async () => {
    await pactum
      .addMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/projects/1'
        },
        willRespondWith: {
          status: 200,
          body: {
            id: 1
          }
        }
      })
      .addMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/projects/2'
        },
        willRespondWith: {
          status: 200,
          body: {
            id: 2
          }
        }
      })
      .get('http://localhost:9393/api/projects')
      .withQuery('name', 'fake')
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

});
```


----------------------------------------------------------------------------------------------------------------

<a href="https://github.com/ASaiAnudeep/pactum/wiki" >
  <img src="https://img.shields.io/badge/PREV-Home-orange" alt="Home" align="left" style="display: inline;" />
</a>
<a href="https://github.com/ASaiAnudeep/pactum/wiki/Contract-Testing" >
  <img src="https://img.shields.io/badge/NEXT-Contract%20Testing-blue" alt="Contract Testing" align="right" style="display: inline;" />
</a>
