# API Testing (REST)

API Testing in general can greatly improve the efficiency of our testing strategy helping us to deliver software faster than ever. It has many aspects but generally consists of making a request & validating the response. 

*Note: This documentation majorly focuses on request making & response validation. Advanced features are covered in places where it makes more sense.*

## Table of contents

* [Getting Started](#getting-started)
* [API](#api)
  * [Testing Style](#testing-style)
  * [Request Making](#request-making)
    * [Query Params](#query-params)
    * [Headers](#headers)
    * [Body](#body)
    * [Form Data](#form-data)
    * [GraphQL](#graphql)
    * [Request Timeout](#request-timeout)
  * [Response Validation](#response-validation)
    * [Status & Headers & Response Time](#status-&-headers-&-response-time)
    * [JSON](#json)
      * [expectJson](#expectJson)
      * [expectJsonLike](#expectJsonLike)
      * [expectJsonSchema](#expectJsonSchema)
      * [expectJsonAt](#expectJsonAt)
      * [expectJsonLikeAt](#expectJsonLikeAt)
      * [expectJsonMatch](#expectJsonMatch)
    * [Custom Validations](#custom-validations)
  * [Request Settings](#request-settings)
* [Next](#next)

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
```

Create a JS file & copy the below code

```javascript
// test.js
const pactum = require('pactum');

it('should be a teapot', async () => {
  await pactum.spec()
    .get('http://httpbin.org/status/418')
    .expectStatus(418);
});
```

Running the test

```shell
# mocha is a test framework to execute test cases
mocha test.js
```

## API

### Testing Style

Tests in **pactum** are clear and comprehensive. It uses numerous descriptive methods to build your requests and expectations.

Tests can be written in two styles

* Chaining the request & expectations
* Breaking the request & expectations (BDD Style)

#### Chaining

We can build the request & expectations by chaining the descriptive methods offered by this library.

```javascript
it('should have a user with name bolt', () => {
  return pactum.spec()
    .get('http://localhost:9393/api/users')
    .withQueryParams('name', 'bolt')
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

When you want to make your tests much more clearer, you can break your spec into multiple steps. This will come into handy when integrating **pactum** with **cucumber**. See [pactum-cucumber-boilerplate](https://github.com/ASaiAnudeep/pactum-cucumber-boilerplate) for more details on pactum & cucumber integration.


Use `pactum.spec()` to get an instance of the spec. With **spec** you can build your request & expectations in multiple steps.

Once the request is built, perform the request by calling `.toss()` method and wait for the promise to resolve. 

**Assertions should be made after the request is performed & resolved**.

Assertions should be made by either using `pactum.expect` or `spec.response()`.

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
    spec.withQueryParams('name', 'bolt');
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
await pactum.spec().get('http://httpbin.org/status/200');
await pactum.spec().post('http://httpbin.org/status/200');
await pactum.spec().put('http://httpbin.org/status/200');
await pactum.spec().patch('http://httpbin.org/status/200');
await pactum.spec().delete('http://httpbin.org/status/200');
await pactum.spec().head('http://httpbin.org/status/200');
```

To pass additional parameters to the request, we can chain or use the following methods individually to build our request.

| Method                    | Description                               |
| ------------------------- | ----------------------------------------- |
| `withQueryParams`         | request query parameters                  |
| `withHeaders`             | request headers                           |
| `withBody`                | request body                              |
| `withJson`                | request json object                       |
| `withGraphQLQuery`        | graphQL query                             |
| `withGraphQLVariables`    | graphQL variables                         |
| `withForm`                | object to send as form data               |
| `withMultiPartFormData`   | object to send as multi part form data    |
| `withRequestTimeout`      | sets request timeout                      |
| `withCore`                | http request options                      |
| `__setLogLevel`           | sets log level for troubleshooting        |
| `toss`                    | runs the spec & returns a promise         |

#### Query Params

Use `withQueryParams` to pass query parameters to the request.

```javascript
it('get random male user from India', async () => {
  await pactum.spec()
    .get('https://randomuser.me/api')
    .withQueryParams('gender', 'male')
    .withQueryParams({
      'country': 'IND'
    })
    .expectStatus(200);
});
```

#### Headers

Use `withHeaders` to pass headers to the request.

```javascript
it('get all comments', async () => {
  await pactum.spec()
    .get('https://jsonplaceholder.typicode.com/comments')
    .withHeaders('Authorization', 'Basic abc')
    .withHeaders({
      'Content-Type': 'application/json'
    })
    .expectStatus(200);
});
```

#### Body

Use `withBody` or `withJson` methods to pass the body to the request.

```javascript
it('post body', async () => {
  await pactum.spec()
    .post('https://jsonplaceholder.typicode.com/posts')
    .withBody('{ "title": "foo", "content": "bar"}')
    .expectStatus(201);
});
```

```javascript
it('post json object', async () => {
  await pactum.spec()
    .post('https://jsonplaceholder.typicode.com/posts')
    .withJson({
      title: 'foo',
      body: 'bar',
      userId: 1
    })
    .expectStatus(201);
});
```

#### Form Data

Use `withForm` or `withMultiPartFormData` to pass form data to the request.

##### withForm

* Under the hood, pactum uses `phin.form`
* `content-type` header will be auto updated to `application/x-www-form-urlencoded`

```javascript 
it('post with form', async () => {
  await pactum.spec()
    .post('https://httpbin.org/forms/posts')
    .withForm({
      title: 'foo',
      body: 'bar',
      userId: 1
    })
    .expectStatus(201);
});
```

##### withMultiPartFormData

* Under the hood it uses [form-data](https://www.npmjs.com/package/form-data)
* `content-type` header will be auto updated to `multipart/form-data`

```javascript
it('post with multipart form data', async () => {
  await pactum.spec()
    .post('https://httpbin.org/forms/posts')
    .withMultiPartFormData('file', fs.readFileSync('a.txt'), { contentType: 'application/js', filename: 'a.txt' })
    .expectStatus(201);
});
```

We can also directly use the form-data object.

```javascript
const form = new pactum.request.FormData();
form.append(/* form data */);
it('post with multipart form data', async () => {
  await pactum.spec()
    .post('https://httpbin.org/forms/posts')
    .withMultiPartFormData(form)
    .expectStatus(201);
});
```

#### GraphQL

Use `withGraphQLQuery` or `withGraphQLVariables` to pass GraphQL data to the request. *Works for only POST requests.*

```javascript
it('post graphql query & variables', async () => {
  await pactum.spec()
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
    .expectStatus(201);
});
```

#### Request Timeout

By default, pactum's request will timeout after 3000 ms. To increase the timeout for the current request use the `withRequestTimeout` method. **Make Sure To Increase The Test Runners Timeout As Well**


```javascript
it('some action that will take more time to complete', async () => {
  // increase mocha timeout here
  await pactum.spec()
    .post('https://jsonplaceholder.typicode.com/posts')
    .withJson({
      title: 'foo',
      body: 'bar',
      userId: 1
    })
    .withRequestTimeout(5000)
    .expectStatus(201);
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
| `expectJsonAt`          | check json using **json-query**         |
| `expectJsonLike`        | check loose match of json               |
| `expectJsonLikeAt`      | check json like using **json-query**    |
| `expectJsonSchema`      | check json schema                       |
| `expectJsonSchemaAt`    | check json schema using **json-query**  |
| `expectJsonMatch`       | check json to match                     |
| `expectResponseTime`    | check response time                     |

#### Status & Headers & Response Time

Expecting Status Code & Headers from the response.

```javascript
const expect = pactum.expect;

it('get post with id 1', async () => {
  const response = await pactum.spec()
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
  const response = await pactum.spec()
    .get('https://jsonplaceholder.typicode.com/posts/1')
    .expectStatus(200)
    .expectJson({
      "userId": 1,
      "id": 1,
      "title": "some title",
      "body": "some body"
    });
  
  // Chai Style Assertions
  // pactum.expect(response).should.have.json({});
});
```

##### expectJsonAt

Allows validation of specific part in a JSON. See [json-query](https://www.npmjs.com/package/json-query) for more usage details.

* Performs deep equal or strict equal.
* Order of items in an array does matter.

```javascript
it('get people', async () => {
  const response = await pactum.spec()
    .get('https://some-api/people')
    .expectStatus(200)
    .expectJson({
      people: [
        { name: 'Matt', country: 'NZ' },
        { name: 'Pete', country: 'AU' },
        { name: 'Mike', country: 'NZ' }
      ]
    })
    .expectJsonAt('people[country=NZ].name', 'Matt')
    .expectJsonAt('people[*].name', ['Matt', 'Pete', 'Mike']);
});
```

##### expectJsonLike

Performs partial deep equal. 

* Allows Regular Expressions.
* Allows JavaScript Expressions.
* Order of items in an array doesn't matter.

```javascript
it('posts should have a item with title -"some title"', async () => {
  const response = await pactum.spec()
    .get('https://jsonplaceholder.typicode.com/posts')
    .expectStatus(200)
    .expectJsonLike([
      {
        "userId": /\d+/,
        "title": "some title"
      }
    ]);
  
  // Chai Style Assertions
  // pactum.expect(response).should.have.jsonLike();
  // spec.response().should.have.jsonLike();
});
```

###### JS Expressions

JS Expressions help to perform custom & complex assertions on a JSON. A JS Expression should start with `@(` & end with `)@`. 

Expression should
 * be a valid JavaScript expression.
 * have `$` to represent current value.
 * return a *boolean*.

```javascript
it('get users', async () => {
  const response = await pactum.spec()
    .get('/api/users')
    .expectStatus(200)
    .expectJsonLike('@( $.length === 10 )@'); // api should return an array with length 10
    .expectJsonLike([
      {
        name: 'jon',
        age: '@( $ > 30 )@' // age should be greater than 30
      }
    ])
});
```

##### expectJsonLikeAt

Allows validation of specific part in a JSON. See [json-query](https://www.npmjs.com/package/json-query) for more usage details.

* Performs partial deep equal.
* Order of items in an array doesn't matter.

```javascript
it('get people', async () => {
  const response = await pactum.spec()
    .get('https://some-api/people')
    .expectStatus(200)
    .expectJson({
      people: [
        { name: 'Matt', country: 'NZ' },
        { name: 'Pete', country: 'AU' },
        { name: 'Mike', country: 'NZ' }
      ]
    })
    .expectJsonAt('people[*].name', ['Matt', 'Pete', 'Mike']);
    .expectJsonLikeAt('people[*].name', ['Mike', 'Matt']);
});
```

##### expectJsonSchema

Allows validation of the schema of a JSON. See [json-schema](https://json-schema.org/learn/) for more usage details.

```javascript
it('get people', async () => {
  const response = await pactum.spec()
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
      "type": "object",
      "properties": {
        "people": {
          "type": "array"
        }
      }
    });
});
```

##### expectJsonSchemaAt

Allows validation of the schema of a JSON at a specific place. See [json-schema](https://json-schema.org/learn/) for more usage details.

```javascript
it('get people', async () => {
  const response = await pactum.spec()
    .get('https://some-api/people')
    .expectStatus(200)
    .expectJson({
      people: [
        { name: 'Matt', country: 'NZ' },
        { name: 'Pete', country: 'AU' },
        { name: 'Mike', country: 'NZ' }
      ]
    })
    .expectJsonSchemaAt('people', {
      "type": "array"
    });
});
```

##### expectJsonMatch

Allows validation of JSON with a set of matchers. See [matching](https://github.com/ASaiAnudeep/pactum/wiki/Mock-Server#matching) for more usage details.

```javascript
const { like } = pactum.matchers;

it('get people', async () => {
  const response = await pactum.spec()
    .get('https://some-api/people')
    .expectStatus(200)
    .expectJsonMatch({
      id: like(1),
      name: 'jon'
    });
});
```

#### Custom Validations

You can also add custom expect handlers to this library for making much more complicated assertions that are ideal to your requirement. You can bring your own assertion library or take advantage of popular libraries like [chai](https://www.npmjs.com/package/chai).

##### AdHoc

You can simply pass a function as a parameter to `expect` & then write your logic that performs assertions. A *context* object is passed to the handler function which contains *req* (request) & *res* (response) objects.

```javascript
const chai = require('chai');
const expect = chai.expect;

const pactum = require('pactum');
const _expect = pactum.expect;

it('post should have a item with title -"some title"', async () => {
  const response = await pactum.spec()
    .get('https://jsonplaceholder.typicode.com/posts/5')
    .expect((ctx) => {
      const res = ctx.res;
      _expect(res).to.have.status(200);
      expect(res.json.title).equals('some title');
    });
});
```

##### Common

There might be a use case where you wanted to perform the same set of assertions. For such scenarios, you can add custom expect handlers that can be used at different places. A *context* object is passed to the handler function which contains *req* (request) & *res* (response) objects & *data* (custom data).

```javascript
const chai = require('chai');
const expect = chai.expect;

const pactum = require('pactum');
const _expect = pactum.expect;
const handler = pactum.handler;

before(() => {
  handler.addExpectHandler('user details', (ctx) => {
    const res = ctx.res;
    const user = res.json;
    expect(user).deep.equals({ id: 1 });
    _expect(res).to.have.status(200);
    _expect(res).to.have.responseTimeLessThan(500);
    _expect(res).to.have.jsonSchema({ /* some schema */ });
  });
});

it('should have a post with id 5', async () => {
  const response = await pactum.spec()
    .get('https://jsonplaceholder.typicode.com/posts/5')
    .expect('user details');
  
  // Chai Style Assertions
  // pactum.expect(response).should.have._('user details');
});

it('should have a post with id 5', async () => {
  const response = await pactum.spec()
    .get('https://jsonplaceholder.typicode.com/posts/6')
    .expect('to have user details');
});
```

You are also allowed to pass custom data to common expect handlers.

```javascript
before(() => {
  handler.addExpectHandler('to have user details', (ctx) => {
    const res = ctx.res;
    const req = ctx.req;
    const data = ctx.data;
    /*
     Add custom logic to perform based on req (request) & data (custom data passed)
     */
  });
});

it('should have a post with id 5', async () => {
  const response = await pactum.spec()
    .get('https://jsonplaceholder.typicode.com/posts/5')
    .expect('to have user details', 5); // data = 5
});

it('should have a post with id 5', async () => {
  const response = await pactum.spec()
    .get('https://jsonplaceholder.typicode.com/posts/6')
    .expect('to have user details', { id: 6 }); // data = { id: 6 }
});
```

### Request Settings

This library also offers us to set default options for all the requests that are sent through it.

#### setBaseUrl

Sets the base URL for all the HTTP requests.

```javascript
const pactum = require('pactum');
const request = pactum.request;

before(() => {
  request.setBaseUrl('http://localhost:3000');
});

it('should have a post with id 5', async () => {
  // request will be sent to http://localhost:3000/api/projects
  await pactum.spec()
    .get('/api/projects');
});
```

#### setDefaultTimeout

Sets the default timeout for all the HTTP requests.
The default value is **3000 ms**

```javascript
pactum.request.setDefaultTimeout(5000);
```

#### setDefaultHeader

Sets default headers for all the HTTP requests.

```javascript
pactum.request.setDefaultHeader('Authorization', 'Basic xxxxx');
pactum.request.setDefaultHeader('content-type', 'application/json');
```


## Next

* [Integration Testing](https://github.com/ASaiAnudeep/pactum/wiki/Integration-Testing)
* [Data Management](https://github.com/ASaiAnudeep/pactum/wiki/Data-Management)
* [Mock Server](https://github.com/ASaiAnudeep/pactum/wiki/Mock-Server)
* [Component Testing](https://github.com/ASaiAnudeep/pactum/wiki/Component-Testing)
* [Contract Testing](https://github.com/ASaiAnudeep/pactum/wiki/Contract-Testing)
  * [Consumer Testing](https://github.com/ASaiAnudeep/pactum/wiki/Consumer-Testing)
  * [Provider Verification](https://github.com/ASaiAnudeep/pactum/wiki/Provider-Verification)

----------------------------------------------------------------------------------------------------------------

<a href="https://github.com/ASaiAnudeep/pactum/wiki" >
  <img src="https://img.shields.io/badge/PREV-Home-orange" alt="Home" align="left" style="display: inline;" />
</a>
<a href="https://github.com/ASaiAnudeep/pactum/wiki/Integration-Testing" >
  <img src="https://img.shields.io/badge/NEXT-Integration%20Testing-blue" alt="Integration Testing" align="right" style="display: inline;" />
</a>
