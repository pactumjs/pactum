# API Testing (REST)

API Testing in general can greatly improve the efficiency of our testing strategy helping us to deliver software faster than ever. It has many aspects but generally consists of making a request & validating the response. 

* It can be performed at different levels of software development life cycle.
* It can be performed independent of the language used to develop the application. (*java based applications API can be tested in other programming languages*)
* In market there are numerous tools available that allows us to test our APIs for different test types.

Instead of using different tools for each test type, **pactum** comes with all the popular features in a single bundle.

So the question is **Why pactum? & What makes pactum fun & easy?**

* Ability to control the behavior of external services with a powerful mock server. (*once you are familiar with api-testing using pactum make sure to read about component testing using pactum*)
* Extremely lightweight.
* Quick & easy to send requests & validate responses.
* Not tied with any of the test runners. We are allowed to choose the test runner like **mocha**, **cucumber**, **jest** or any other that supports promises. TODO - Examples
* Ideal for *component testing*, *contract testing* & *e2e testing*.

Lets get started with API Testing.

## Table of contents

* [Getting Started](#getting-started)
* [API](#api)
  * [HTTP Requests](#http-requests)
  * [HTTP Methods](#http-methods)
  * [HTTP Expectations](#http-expectations)
  * [Request Settings](#request-settings)
* [Examples](#examples)


## Getting Started

To get started we need to have NodeJS (>=8) installed in our system.

```shell
# create a new folder (optional)
mkdir pactum-api-testing
cd pactum-api-testing

# initialize (optional)
npm init -y

# install pactum as a dev dependency
npm install --save-dev pactum

# install a test runner to run pactum tests
# mocha / jest / cucumber
npm install mocha -g

# Create a js file
touch http.test.js
```

Copy the below code

```javascript
const pactum = require('pactum');

it('should be a teapot', async () => {
  await pactum
    .get('http://httpbin.org/status/418')
    .expectStatus(418);
});
```

Running the test

```shell
# mocha is a test framework to execute test cases
mocha http.test.js
```

## API

Tests in **pactum** are clear and comprehensive. It uses numerous descriptive methods to build your requests and expectations.

### Request Making

The request method indicates the method to be performed on the resource identified by the given Request-URI.

```javascript
await pactum.get('http://httpbin.org/status/200');
await pactum.post('http://httpbin.org/status/200');
await pactum.put('http://httpbin.org/status/200');
await pactum.patch('http://httpbin.org/status/200');
await pactum.del('http://httpbin.org/status/200');
await pactum.head('http://httpbin.org/status/200');
```

To pass additional parameters to the request, we can chain or use the following methods individually to build our request.

| Method                    | Description                               |
| ------------------------- | ----------------------------------------- |
| `withQueryParam`          | single query parameter                    |
| `withQueryParams`         | multiple query parameters                 |
| `withHeader`              | single request headers                    |
| `withHeaders`             | multiple request headers                  |
| `withBody`                | request body                              |
| `withJson`                | request json object                       |
| `withGraphQLQuery`        | graphQL query                             |
| `withGraphQLVariables`    | graphQL variables                         |
| `withForm`                | object to send as form data               |
| `withMultiPartFormData`   | object to send as multi part form data    |
| `withRequestTimeout`      | sets request timeout                      |
| `__setLogLevel`           | sets log level for troubleshooting        |

#### Query Params

Use `withQueryParam` or `withQueryParams` methods to pass query parameters to the request. We are allowed to call the `query-param` methods multiple times fo the same request.

```javascript
it('get comments for post id 1', async () => {
  await pactum
    .get('https://jsonplaceholder.typicode.com/comments')
    .withQueryParam('postId', 1)
    .expectStatus(200);
});
```

```javascript
it('get random male user from Australia', async () => {
  await pactum
    .get('https://randomuser.me/api')
    .withQueryParam('gender', 'male')
    .withQueryParam('country', 'AUS')
    .expectStatus(200);
});
```

```javascript
it('get random female user from India', async () => {
  await pactum
    .get('https://randomuser.me/api')
    .withQueryParams({
      'gender': 'female',
      'country': 'IND'
    })
    .expectStatus(200);
});
```

#### Headers

Use `withHeader` or `withHeaders` methods to pass headers to the request. We are allowed to call the `header` methods multiple times fo the same request.

```javascript
it('get all comments', async () => {
  await pactum
    .get('https://jsonplaceholder.typicode.com/comments')
    .withHeader('Authorization', 'Basic abc')
    .withHeader('Accept', '*')
    .withHeaders({
      'Content-Type': 'application/json'
    })
    .expectStatus(200);
});
```

#### Body (JSON)

Use `withBody` or `withJson` methods to pass body to the request.

```javascript
it('post body', async () => {
  await pactum
    .post('https://jsonplaceholder.typicode.com/posts')
    .withBody('{ "title": "foo", "content": "bar"}')
    .expectStatus(201);
});
```

```javascript
it('post json object', async () => {
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
```

#### Form Data

Use `withForm` or `withMultiPartFormData` to pass form data to the request.

##### withForm

* Under the hood, pactum uses `phin.form`
* `content-type` header will be auto updated to `application/x-www-form-urlencoded`

```javascript 
it('post with form', async () => {
  await pactum
    .post('https://httpbin.org/forms/posts')
    .withForm({
      title: 'foo',
      body: 'bar',
      userId: 1
    })
    .expectStatus(201)
    .toss();
});
```

##### withMultiPartFormData

* Under the hood it uses [form-data](https://www.npmjs.com/package/form-data)
* `content-type` header will be auto updated to `multipart/form-data`

```javascript
it('post with multipart form data', async () => {
  await pactum
    .post('https://httpbin.org/forms/posts')
    .withMultiPartFormData('file', fs.readFileSync('a.txt'), { contentType: 'application/js', filename: 'a.txt' })
    .expectStatus(201)
    .toss();
});
```

We can also directly use the form-data object.

```javascript
const form = new pactum.request.FormData();
form.append(/* form data */);
it('post with multipart form data', async () => {
  await pactum
    .post('https://httpbin.org/forms/posts')
    .withMultiPartFormData(form)
    .expectStatus(201)
    .toss();
});
```

#### GraphQL

Use `withGraphQLQuery` or `withGraphQLVariables` to pass form graphql data to the request. *Works for only POST requests.*

```javascript
it('post graphql query & variables', async () => {
  await pactum
    .post('https://jsonplaceholder.typicode.com/posts')
    .withGraphQLQuery(
      `
        query HeroNameAndFriends($episode: Episode) {
          hero(episode: $episode) {
            name
            friends {
              name
            }
          }
        }
      `
    )
    .withGraphQLVariables({
      "episode": "JEDI"
    })
    .expectStatus(201)
    .toss();
});
```

#### RequestTimeout

By default pactum request will timeout after 3000 ms. To increase the timeout for the current request use `withRequestTimeout` method. **Make Sure To Increase The Test Runners Timeout As Well**


```javascript
it('some action that will take more time to complete', async () => {
  // increase mocha timeout here
  await pactum
    .post('https://jsonplaceholder.typicode.com/posts')
    .withJson({
      title: 'foo',
      body: 'bar',
      userId: 1
    })
    .withRequestTimeout(5000)
    .expectStatus(201)
    .toss();
});
```



### Response Assertions


TODO - Request Making

TODO - Request Settings

TODO - Response Assertion

TODO - Returns

TODO - Retry

TODO - Data Management

TODO - State Handlers