# API Testing (REST)

API Testing in general can greatly improve the efficiency of our testing strategy helping us to deliver software faster than ever. It has many aspects but generally consists of making a request & validating the response. 

* It can be performed at different levels of software development life cycle.
* It can be performed independent of the language used to develop the application. (*java based applications API can be tested in other programming languages*)
* In market there are numerous tools available that allows us to test our APIs for different test types.

Instead of using different tools for each test type, **pactum** comes with all the popular features in a single bundle.

So the question is **Why pactum? & What makes pactum fun & easy?**

* Extremely lightweight.
* Quick & easy to send requests & validate responses.
* Not tied with any of the test runners. You are allowed to choose the test runner like **mocha**, **cucumber**, **jest** or any other that supports promises.
* Ideal for *component testing*, *contract testing* & *e2e testing*.
* Ability to control the behavior of external services with a powerful mock server. (*once you are familiar with api-testing using pactum make sure to read about component testing using pactum*)

Lets get started with API Testing.

## Table of contents

* [Getting Started](#getting-started)
* [API](#api)
  * [Request Making](#request-making)
  * [Response Validation](#response-validation)


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

Tests can be written in two styles

* Chaining the request & expectations
* Breaking the request & expectations (BDD Style)

#### Chaining

We can build the request & expectations by chaining the descriptive methods offered by this library.

```javascript
it('should have a user with name bolt', () => {
  return pactum
    .get('http://localhost:9393/api/users')
    .withQueryParam('name', 'bolt')
    .expectStatus(200)
    .expectJson({
      "id": 1,
      "name": "bolt",
      "createdAt": "2020-08-19T14:26:44.169Z"
    })
    .expectJsonSchema({
      type: 'object',
      properties: {
        id: {
          type: 'number'
        }
      }
    })
    .expectResponseTime(100);
});
```

#### Breaking

When you want to make your tests much more clearer, you can break your spec into multiple steps. This will come into handy when integrating **pactum** with **cucumber**.

Use `pactum.spec()` to get an instance of the spec. With **spec** you can build your request & expectations in multiple steps.

Once the request is built, perform the request by calling `.toss()` method and wait for the promise to resolve. 

**Assertions should be maid after the request is performed & resolved**.

Assertions can be maid either by using `pactum.expect` or `spec.response()`.

```javascript
const pactum = require('pactum');
const expect = pactum.expect;

describe('should have a user with name bolt', () => {

  let spec = pactum.spec();
  let response;

  it('given a user is requested', () => {
    spec.get('http://localhost:9393/api/users');
  });

  it('with name bolt', () => {
    spec.withQueryParam('name', 'bolt');
  });

  it('should return a response', async () => {
    response = await spec.toss();
  });

  it('should return a status 200', () => {
    expect(response).to.have.status(200);
  });

  it('should return a valid user', async () => {
    spec.response().to.have.jsonLike({ name: 'snow'});
  });

  it('should return a valid user schema', async () => {
    expect(response).to.have.jsonSchema({ type: 'object'});
  });

  it('should return response within 100 milliseconds', async () => {
    spec.response().to.have.responseTimeLessThan(100);
  });

});
```

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
it('get random male user from India', async () => {
  await pactum
    .get('https://randomuser.me/api')
    .withQueryParam('gender', 'male')
    .withQueryParams({
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



### Response Validation

Expectations help to assert the response received from the server.

| Method                  | Description                             |
| ----------------------- | --------------------------------------- |
| `expect`                | runs custom expect handler              |
| `expectStatus`          | check HTTP status                       |
| `expectHeader`          | check HTTP header key + value           |
| `expectHeaderContains`  | check HTTP header key + partial value   |
| `expectBody`            | check exact match of body               |
| `expectBodyContains`    | check body contains the value           |
| `expectJson`            | check exact match of json               |
| `expectJsonLike`        | check loose match of json               |
| `expectJsonSchema`      | check json schema                       |
| `expectJsonQuery`       | check json using **json-query**         |
| `expectJsonQueryLike`   | check json like using **json-query**    |
| `expectResponseTime`    | check response time                     |

#### Status & Headers & Response Time

Expecting Status Code & Headers from the response.

```javascript
const expect = pactum.expect;

it('get post with id 1', async () => {
  const response = await pactum
    .get('https://jsonplaceholder.typicode.com/posts/1')
    .expectStatus(200)
    .expectHeader('content-type', 'application/json; charset=utf-8')
    .expectHeader('connection', /\w+/)
    .expectHeaderContains('content-type', 'application/json');

  expect(response).to.have.status(200);
  expect(response).to.have.header('connection', 'close');
});
```

##### expectResponseTime

Checks if the request is completed within a specified duration (ms).

#### JSON

Most REST APIs will return a JSON response. This library has few methods to validate a JSON response in many aspects.

##### expectJson

Performs deep equal.

```javascript
it('get post with id 1', async () => {
  const response = await pactum
    .get('https://jsonplaceholder.typicode.com/posts/1')
    .expectStatus(200)
    .expectJson({
      "userId": 1,
      "id": 1,
      "title": "some title",
      "body": "some body"
    });
});
```

##### expectJsonLike

Performs partial deep equal. 

* Allows Regular Expressions.
* Order of items in an array doesn't matter.

```javascript
it('posts should have a item with title -"some title"', async () => {
  const response = await pactum
    .get('https://jsonplaceholder.typicode.com/posts')
    .expectStatus(200)
    .expectJsonLike([
      {
        "userId": /\d+/,
        "title": "some title"
      }
    ]);
});
```

##### expectJsonQuery

Allows validation of specific part in a JSON. See [json-query](https://www.npmjs.com/package/json-query) for more usage details.

* Performs deep equal or strict equal.
* Order of items in an array matters.

```javascript
it('get people', async () => {
  const response = await pactum
    .get('https://some-api/people')
    .expectStatus(200)
    .expectJson({
      people: [
        { name: 'Matt', country: 'NZ' },
        { name: 'Pete', country: 'AU' },
        { name: 'Mike', country: 'NZ' }
      ]
    })
    .expectJsonQuery('people[country=NZ].name', 'Matt')
    .expectJsonQuery('people[*].name', ['Matt', 'Pete', 'Mike']);
});
```

##### expectJsonQueryLike

Allows validation of specific part in a JSON. See [json-query](https://www.npmjs.com/package/json-query) for more usage details.

* Performs partial deep equal.
* Order of items in an array doesn't matter.

```javascript
it('get people', async () => {
  const response = await pactum
    .get('https://some-api/people')
    .expectStatus(200)
    .expectJson({
      people: [
        { name: 'Matt', country: 'NZ' },
        { name: 'Pete', country: 'AU' },
        { name: 'Mike', country: 'NZ' }
      ]
    })
    .expectJsonQuery('people[*].name', ['Matt', 'Pete', 'Mike']);
    .expectJsonQueryLike('people[*].name', ['Mike', 'Matt']);
});
```

##### expectJsonSchema

Allows validation of schema of a JSON. See [json-schema](https://json-schema.org/learn/) for more usage details.

```javascript
it('get people', async () => {
  const response = await pactum
    .get('https://some-api/people')
    .expectStatus(200)
    .expectJson({
      people: [
        { name: 'Matt', country: 'NZ' },
        { name: 'Pete', country: 'AU' },
        { name: 'Mike', country: 'NZ' }
      ]
    })
    .expectJsonSchema({
      properties: {
        "people": "array"
      }
    });
});
```


### Request Settings
TODO - Request Settings

TODO - Returns

TODO - Retry

TODO - Data Management

TODO - State Handlers