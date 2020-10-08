# Integration Testing

Integration Testing is defined as a type of testing where software modules or components are logically integrated & tested.

When it comes to API Integration Testing, essentially it involves testing how multiple APIs work together. These tests doesn't necessarily build business workflows but tests integration points between single or multiple API endpoints.

This document explains the features that are offered by **pactum** to support integration testing.

*Note: All the features of `pactum.spec()` can be applied for any type of testing. This documentation segregates the features of this library in a place where it makes more sense.*

## Table of contents

* [Getting Started](#getting-started)
* [API](#api)
  * [Nested Dependent HTTP Calls](#nested-dependent-http-calls)
  * [Retry Mechanism](#retry-mechanism)

## Getting Started

Before getting started please learn more about [API Testing](https://github.com/ASaiAnudeep/pactum/wiki/API-Testing) with pactum.

## API

### Nested Dependent HTTP Calls

API testing is naturally asynchronous, which can make tests complex when these tests need to be chained. **Pactum** allows us to return custom data from the response that can be passed to the next tests using [json-query](https://www.npmjs.com/package/json-query) expressions or custom handler functions.

You can pass data between tests by using either `returns` or `stores` methods.

#### returns 

Use `returns` method to return custom response from the received response JSON.

##### json-query

`returns` method accepts a json-query expression as the first argument.

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

Use multiple `returns` to return an array of custom responses from the received JSON.

```javascript
const pactum = require('pactum');

it('first & second posts should have comments', async () => {
  const ids = await pactum.spec()
    .get('http://jsonplaceholder.typicode.com/posts')
    .expectStatus(200)
    .returns('[0].id')
    .returns('[1].id');
  await pactum.spec()
    .get(`http://jsonplaceholder.typicode.com/posts/${ids[0]}/comments`)
    .expectStatus(200);
  await pactum.spec()
    .get(`http://jsonplaceholder.typicode.com/posts/${ids[1]}/comments`)
    .expectStatus(200);
});
```

##### AdHoc Handler

We can also use a custom handler function to return data. A *context* object is passed to the handler function which contains *req* (request) & *res* (response) objects. 

```javascript
const pactum = require('pactum');

it('should return all posts and first post should have comments', async () => {
  const postID = await pactum.spec()
    .get('http://jsonplaceholder.typicode.com/posts')
    .expectStatus(200)
    .returns((ctx) => { return ctx.res.json[0].id });
  await pactum.spec()
    .get(`http://jsonplaceholder.typicode.com/posts/${postID}/comments`)
    .expectStatus(200);
});
```

##### Common Handler

We can also use a custom common handler function to return data & use it across tests. It accepts two arguments.

* *Fist Argument*: Name of the handler function used to refer it later in specs.
* *Second Argument*: A function that receives context object with request & response details. The returned value will be the output of `await pactum.spec()`. The function should be synchronous.

```javascript
const pactum = require('pactum');
const handler = pactum.handler;

before(() => {
  handler.addReturnHandler('first post id', (ctx) => {
    const res = ctx.res;
    return res.json[0].id;
  });
});

it('should return all posts and first post should have comments', async () => {
  const postID = await pactum.spec()
    .get('http://jsonplaceholder.typicode.com/posts')
    .expectStatus(200)
    .returns('first post id');
  await pactum.spec()
    .get(`http://jsonplaceholder.typicode.com/posts/${postID}/comments`)
    .expectStatus(200);
});
```

**Note**: *While evaluating the string passed to the returns function, this library sees if there is a handler function with the name. If not found it will execute the json-query.*

#### stores

Use `stores` method to save response data under *data management* which can be referenced later in specs. This method accepts two arguments.

* *FirstArgument*: Name used to refer it later in specs.
* *SecondArgument*: **json-query** that will fetch custom response data & save it against the name.


```javascript
await pactum.spec()
  .get('http://jsonplaceholder.typicode.com/posts')
  .stores('FirstPost', '[0]')
  .stores('SecondPost', '[1]')
  .stores('AllPosts', '.');

/*

Lets say the response is
  [
    {
      id: 1,
      user: 'jon'
    },
    {
      id: 2,
      user: 'snow'
    }
  ]

  FirstPost - will contain the first item in the response JSON
    {
      id: 1,
      user: 'jon'
    }

  SecondPost - will contain the second item in the response JSON
    {
      id: 2,
      user: 'snow'
    }
  
  AllPosts - will have the entire JSON response.
*/
```

To later refer the stored value, you need to use `@DATA:STR::<name>@` or `@DATA:STR::<name><json-query>@` as a place holder in the requests.

```javascript
// It will make a GET request to http://jsonplaceholder.typicode.com/posts/1
await pactum.spec()
  .get('http://jsonplaceholder.typicode.com/posts/@DATA:STR::FirstPost.id@')
  .withJson({
    id: '@DATA:STR::FirstPost.id@'
    title: 'new title'
  });
});

/* 
  It will make a POST request to http://jsonplaceholder.typicode.com/posts
  with body 
  {
    data: {
      id: 2,
      user: 'snow'
    }     
  }
*/
await pactum.spec()
  .post('http://jsonplaceholder.typicode.com/posts')
  .withJson({
    data: '@DATA:STR::SecondPost@'
  });
});
```


### Retry Mechanism

Not all APIs perform simple CRUD operations. Some operations take time & for such scenarios **pactum** allows us to add custom retry handlers that will wait for specific conditions to happen before attempting to make assertions on the response. (*Make sure to update test runners default timeout*) 

Use `retry` to specify your retry strategy. It accepts options object as an argument. If the strategy function returns true, it will perform the request again.

##### retryOptions

| Property  | Type       | Description                                |
| --------- | ---------- | ------------------------------------------ |
| count     | `number`   | number of times to retry - defaults to 3   |
| delay     | `number`   | delay between retries - defaults to 1000ms |
| strategy  | `function` | retry strategy function - returns boolean  |
| strategy  | `string`   | retry strategy handler name                | 

#### AdHoc Handler

We can use a custom handler function to return a boolean. A *context* object is passed to the handler function which contains *req* (request) & *res* (response) objects. 

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

#### Common Handler

We can also use a custom common handler function to return data & use it at different places.

```javascript
const pactum = require('pactum');
const handler = pactum.handler;

before(() => {
  handler.addRetryHandler('on 404', (ctx) => {
    const res = ctx.res;
    if (res.statusCode === 404) {
      return true;
    } else {
      return false
    }
  });
});

it('should get posts', async () => {
  await pactum.spec()
    .get('http://jsonplaceholder.typicode.com/posts')
    .retry({
      strategy: 'on 404'
    })
    .expectStatus(200);
});
```

## Next

----------------------------------------------------------------------------------------------------------------

<a href="https://github.com/ASaiAnudeep/pactum/wiki/API-Testing" >
  <img src="https://img.shields.io/badge/PREV-API%20Testing-orange" alt="API Testing" align="left" style="display: inline;" />
</a>
<a href="https://github.com/ASaiAnudeep/pactum/wiki/Data-Management" >
  <img src="https://img.shields.io/badge/NEXT-Data%20Management-blue" alt="Data Management" align="right" style="display: inline;" />
</a>