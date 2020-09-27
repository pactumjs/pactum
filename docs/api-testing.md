# API Testing (REST)

API Testing in general can greatly improve the efficiency of our testing strategy helping us to deliver software faster than ever. It has many aspects but generally consists of making a request & validating the response. 

* It can be performed at different levels of a software development life cycle.
* It can be performed independent of the language used to develop the application. (*java based applications API can be tested in other programming languages*)
* In the market there are numerous tools available that allow us to test our APIs for different test types.

Instead of using different tools for each test type, **pactum** comes with all the popular features in a single bundle.

##### Why pactum?

* Extremely lightweight.
* Quick & easy to send requests & validate responses.
* Out of the box Data Management.
* Easy to chain multiple requests.
* Fully customizable Retry Mechanisms, Assertions.
* Works with any of the test runners like **mocha**, **cucumber**, **jest**.
* Ideal for *component testing*, *contract testing* & *e2e testing*.
* Ability to control the behavior of external services with a powerful mock server. (*learn more at [Component Testing](https://github.com/ASaiAnudeep/pactum/wiki/Component-Testing)*)

Lets get started with API Testing.

## Table of contents

* [Getting Started](#getting-started)
* [API](#api)
  * [Request Making](#request-making)
  * [Response Validation](#response-validation)
  * [Nested Dependent HTTP Calls](#nested-dependent-http-calls)
  * [Retry Mechanism](#retry-mechanism)
* [Data Management](#data-management)


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

#### Body (JSON)

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

#### RequestTimeout

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

##### expectJsonLike

Performs partial deep equal. 

* Allows Regular Expressions.
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
  // pactum.expect(response).should.have.jsonLike({});
});
```

##### expectJsonQuery

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
    .expectJsonQuery('people[*].name', ['Matt', 'Pete', 'Mike']);
    .expectJsonQueryLike('people[*].name', ['Mike', 'Matt']);
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
      properties: {
        "people": "array"
      }
    });
});
```

#### Custom Expect Handlers

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

### Nested Dependent HTTP Calls

API testing is naturally asynchronous, which can make tests complex when these tests need to be chained. **Pactum** allows us to return custom data from the response that can be passed to the next tests using [json-query](https://www.npmjs.com/package/json-query) or custom handler functions.

#### returns 

Use `returns` method to return custom response from the received JSON.

##### json-query

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

We can also use a custom common handler function to return data & use it at different places.

```javascript
const pactum = require('pactum');
const handler = pactum.handler;

before(() => {
  handler.addReturnHandler('user id', (ctx) => {
    const res = ctx.res;
    return res.json[0].id;
  });
});

it('should return all posts and first post should have comments', async () => {
  const postID = await pactum.spec()
    .get('http://jsonplaceholder.typicode.com/posts')
    .expectStatus(200)
    .returns('user id');
  await pactum.spec()
    .get(`http://jsonplaceholder.typicode.com/posts/${postID}/comments`)
    .expectStatus(200);
});
```

**Note**: *While evaluating the string passed to the returns function, the library sees if there is a handler function with the name. If not found it will execute the json-query.*

#### stores

Use `stores` method to save response data under *data management* which can be referenced later in specs. This method accepts two arguments `key` & `value`.

* `key` is a string that can be referenced in other parts to fetch corresponding value.
* `value` is a *json-query* that will fetch custom response data & save it against the key.

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

  @DATA:SPEC::FirstPost@ will contain the first item in the response JSON
    {
      id: 1,
      user: 'jon'
    }

  @DATA:SPEC::SecondPost@ will contain the second item in the response JSON
    {
      id: 2,
      user: 'snow'
    }
  
  @DATA:SPEC::AllPosts@ will have the entire JSON response.
*/

await pactum.spec()
  .patch('http://jsonplaceholder.typicode.com/posts')
  .withJson({
    id: '@DATA:SPEC::FirstPost.id@'
    title: 'new title'
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
  .get('https://jsonplaceholder.typicode.com/posts/12')
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

## Data Management

As the functionality of the application grows, the scope of the testing grows with it. At one point test data management becomes complex.

Assume you have numerous test cases around adding a new user to your system. To add a new user you post the following JSON to `/api/users` endpoint.

```json
{
  "FirstName": "Jon",
  "LastName": "Snow",
  "Age": 26,
  "House": "Castle Black"
}
```

Now let's assume, your application no longer accepts the above JSON. It needs a new field `Gender` in the JSON. It will be tedious to update all your existing test cases to add the new field.

```json
{
  "FirstName": "Jon",
  "LastName": "Snow",
  "Age": 26,
  "Gender": "male",
  "House": "Castle Black"
}
```


To solve these kind of problems, **pactum** comes with a concept of *Data Templates* & *Data References* to manage your test data. It helps us to re-use data across tests.

You can load *Data Templates* & *Data Maps* directly from file system using `loadData` function. You can either group your templates & maps inside *templates* & *maps* folders or place them in the root dir by adding suffix *.template* or *.map* to the json files.

```
- data/
  - maps/
    - User.json
  - templates
    - Address.json
  - Bank.template.json
  - Army.map.json
```

```javascript
stash.loadData(); // By default it looks for directory `./data`
// or
stash.loadData('/path/to/data/folder');
```

### Data Template

A Data Template is a standard format for a particular resource. Once a template is defined, it can be used across all the tests to perform a request.

Use `stash.addDataTemplate` to add a data template. To use the template in the tests, use `@DATA:TEMPLATE@` as key & the name of the template as value.

```javascript
const pactum = require('pactum');
const stash = pactum.stash;

before(() => {
  stash.addDataTemplate({
    'User:New': {
      "FirstName": "Jon",
      "LastName": "Snow",
      "Age": 26,
      "Gender": "male",
      "House": "Castle Black"
    }
  })
});

it('adds a new user', async () => {
  await pactum.spec()
    .post('/api/users')
    .withJson({
      '@DATA:TEMPLATE@': 'User:New'
    })
    .expectStatus(200);
    /*
      The value of the template will be posted to /api/users
      {
        "FirstName": "Jon",
        "LastName": "Snow",
        "Age": 26,
        "Gender": "male",
        "House": "Castle Black"
      }
    */
});
```

The exact resource is not going to be used across every test. Every test might need specific values. This library supports the overriding of specific values & extending the data template. This allows tests to be customized as much as you'd like when using templates.

```javascript
it('should not add a user with negative age', async () => {
  await pactum.spec()
    .post('/api/users')
    .withJson({
      '@DATA:TEMPLATE@': 'User:New',
      '@OVERRIDES@': {
        'Age': -1,
        'House': 'WinterFell'
      }
    })
    .expectStatus(400);
    /*
      The value of the template with overridden values will be posted to /api/users
      {
        "FirstName": "Jon",
        "LastName": "Snow",
        "Age": -1,
        "Gender": "male",
        "House": "WinterFell"
      }
    */
});
```

Templates can also reference other templates. *Be cautious not to create circular dependencies*

```javascript
const pactum = require('pactum');
const stash = pactum.stash;

before(() => {
  stash.addDataTemplate({
    'User:New': {
      "FirstName": "Jon",
      "LastName": "Snow",
      "Age": 26,
      "Gender": "male",
      "House": "Castle Black"
    },
    'User:New:WithEmptyAddress': {
      '@DATA:TEMPLATE@': 'User:New',
      '@OVERRIDES@': {
        'Address': []
      }
    },
    'User:New:WithAddress': {
      '@DATA:TEMPLATE@': 'User:New',
      '@OVERRIDES@': {
        'Address': [
          {
            '@DATA:TEMPLATE@': 'Address:New'
          }
        ]
      }
    },
    'Address:New': {
      'Street': 'Kings Road',
      'Country': 'WestRos'
    }
  });
});

it('should add a user with address', async () => {
  await pactum.spec()
    .post('/api/users')
    .withJson({
      '@DATA:TEMPLATE@': 'User:WithAddress',
      '@OVERRIDES@': {
        'Age': 36,
        'Address': [
          {
            'Country': 'Beyond The Wall',
            'Zip': 524004
          }
        ]
      }
    })
    .expectStatus(400);
    /*
      The value of the template with overridden values will be posted to /api/users
      {
        "FirstName": "Jon",
        "LastName": "Snow",
        "Age": 36,
        "Gender": "male",
        "House": "WinterFell",
        "Address": [
          {
            'Street': 'Kings Road',
            'Country': 'Beyond The Wall',
            'Zip': 524004       
          }
        ]
      }
    */
});
```

### Data Map (Data References)

A Data Map is a collection of data that can be referenced in data templates or tests. The major differences between a data template & a data map are

* When a data template is used, the current object will be replaced.
* When a data map is used, the current object's property value will be replaced.

Use `stash.addDataMap` to add a data map. To use the map in the tests or in the template, use `@DATA:MAP::<json-query>@` as the value.

```javascript
const pactum = require('pactum');
const stash = pactum.stash;

before(() => {
  stash.addDataMap({
    'User': {
      'FirstName': 'Jon',
      'LastName': 'Snow',
      'Country': 'North'
    }
  });
  stash.addDataTemplate({
    'User:New': {
      "FirstName": "@DATA:MAP::User.FirstName@",
      "LastName": "@DATA:MAP::User.LastName@",
      "Age": 26,
      "Gender": "male",
      "House": "Castle Black"
    }
  });
});

/*
  The template `User:New` will be 
  {
    "FirstName": "Jon",
    "LastName": "Snow",
    "Age": 26,
    "Gender": "male",
    "House": "Castle Black"
  }
*/
```

It's perfectly legal to refer other data maps from a data map. *Be cautious not to create circular dependencies*

```javascript
const pactum = require('pactum');
const stash = pactum.stash;

before(() => {
  stash.addDataMap({
    'User': {
      'Default': {
        'FirstName': '@DATA:MAP::User.FirstNames[0]@',
        'LastName': '@DATA:MAP::User.LastNames[0]@',
        'Country': 'North'
      },
      'FirstNames': [ 'Jon', 'Ned', 'Ary' ],
      'LastNames': [ 'Stark', 'Sand', 'Snow' ]
    }
  });
});
```

### Data Function (Data References)

A Data Function is a custom data handler that returns some sort of data that can be referenced in data templates or tests. 

Use `handler.addDataHandler` to add a custom data handler function. To use the function in the tests or in the template, use `@DATA:FUN::<handler-name>@` as the value.

```javascript
const pactum = require('pactum');
const handler = pactum.handler;

before(() => {
  handler.addDataHandler('GetTimeStamp', () => {
    return Date.now();
  });
  handler.addDataHandler('GetAuthToken', () => {
    return 'Basic some-token';
  });
});

it('order an item', async () => {
  await pactum.spec()
    .post('/api/order')
    .withHeaders('Authorization', '@DATA:FUN::GetAuthToken@')
    .withJson({
      'Item': 'Sword',
      'CreatedAt': '@DATA:FUN::GetTimeStamp@'
    });
});
```

### Data Spec (Data References)

A data spec is a reference for custom response data that is received while running API tests. This comes in handy while running integration or e2e API testing to pass data to next tests.

See [Nested Dependent HTTP Calls](#nested-dependent-http-calls) for more information.

## Next

----------------------------------------------------------------------------------------------------------------

<a href="https://github.com/ASaiAnudeep/pactum/wiki/Mock-Server" >
  <img src="https://img.shields.io/badge/NEXT-Mock%20Server-blue" alt="Mock Server" align="right" style="display: inline;" />
</a>
