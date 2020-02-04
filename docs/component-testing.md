# Component Testing

Component testing is defined as a software testing type, in which the testing is performed on each individual component separately without integrating with other components.

## Table of contents

* [Getting Started](#getting-started)
* [API](#api)
  * [HTTP Requests](#http-requests)
  * [HTTP Methods](#http-methods)
  * [HTTP Expectations](#http-expectations)
  * [Request Settings](#request-settings)

## Getting Started

### Simple Test

Lets assume you have an order-service which is a RESTFull API service running on port 3000.
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

Sets the base url for all the HTTP requests.

```javascript
pactum.request.setBaseUrl('http://localhost:3000');
pactum.get('/api/projects');
// Request will be sent to http://localhost:3000/api/projects
```

### setDefaultTimeout
Type: `Function`<br>

Sets the default timeout for all the HTTP requests.
Default value is 3000ms

```javascript
// sets default timeout to 5000ms
pactum.request.setDefaultTimeout(5000);
```

### setDefaultHeader
Type: `Function`<br>

Sets default headers for all the HTTP requests. Default header will be overridden if provided at spec level.

```javascript
pactum.request.setDefaultHeader('Authorization', 'Basic xxxxx');
pactum.request.setDefaultHeader('content-type', 'application/json');
```
