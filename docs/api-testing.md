# API Testing

API Testing in general can greatly improve the efficiency of our testing strategy helping us to deliver software faster than ever. It has many aspects but generally consists of making a request & validating the response. 

> This documentation majorly focuses on how to make a request & how to validate the received response using *pactum*.

## Request Making

### spec

`pactum.spec()` will return an instance of *spec* which can be used to build the request and expectations.

```javascript
const pactum = require('pactum');

it('<test-name>', async () => {
  await pactum.spec()
    .get('http://httpbin.org/status/200');
});
```

To pass additional parameters to the request, we can chain or use the following methods individually to build our request.

| Method                    | Description                               |
| ------------------------- | ----------------------------------------- |
| `withPathParams`          | request path parameters                   |
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
| `withAuth`                | basic auth details                        |
| `withFollowRedirects`     | sets follow redirect boolean property     |
| `inspect`                 | prints request & response details         |
| `__setLogLevel`           | sets log level for troubleshooting        |
| `toss` (optional)         | runs the spec & returns a promise         |

### Request Method

The request method indicates the method to be performed on the resource identified by the given Request-URI.

```javascript
const pactum = require('pactum');

it('GET /user', async () => {
  await pactum.spec()
    .get('http://domain.com/user');
});

it('POST /user', async () => {
  await pactum.spec()
    .post('http://domain.com/user');
});

it('PUT /user', async () => {
  await pactum.spec()
    .put('http://domain.com/user');
});

it('PATCH /user', async () => {
  await pactum.spec()
    .patch('http://domain.com/user');
});

it('DELETE /user', async () => {
  await pactum.spec()
    .delete('http://domain.com/user');
});
```

It is a general practice in API Testing, where we set the base url to a constant value.

<!-- tabs:start -->

#### ** base.test.js **

```javascript
const pactum = require('pactum');
const request = pactum.request;

before(() => {
  request.setBaseUrl('http://localhost:3000');
});
```

#### ** projects.test.js **

```javascript
const pactum = require('pactum');

it('should have a post with id 5', async () => {
  // request will be sent to http://localhost:3000/api/projects
  await pactum.spec()
    .get('/api/projects');
});
```

<!-- tabs:end -->

### Path Params

Use `withPathParams` to pass path parameters to the request. We can either pass key & value or object as an argument.

```javascript
it('get random male user from India', async () => {
  await pactum.spec()
    .get('/api/project/{project}/repo/{repo}')
    .withPathParams('project', 'project-name')
    .withPathParams({
      'repo': 'repo-name'
    })
    .expectStatus(200);
});
```

### Query Params

Use `withQueryParams` to pass query parameters to the request. We can either pass key & value or object as an argument.

```javascript
it('get random male user from India', async () => {
  await pactum.spec()
    .get('https://randomuser.me/api')
    .withQueryParams('gender', 'male')
    .withQueryParams({
      'country': 'IND',
      'age': 17
    })
    .expectStatus(200);
});
```

### Headers

Use `withHeaders` to pass headers to the request. We can either pass key & value or object as an argument.

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

It is a general practice in API Testing, where we set the default headers.

<!-- tabs:start -->

#### ** base.test.js **

```javascript
const pactum = require('pactum');
const request = pactum.request;

before(() => {
  request.setBaseUrl('http://localhost:3000');
  request.setDefaultHeaders('Authorization', 'Basic xxxxx');
});
```

#### ** projects.test.js **

```javascript
const pactum = require('pactum');

it('should have a post with id 5', async () => {
  // request will be sent to http://localhost:3000/api/projects
  await pactum.spec()
    .get('/api/projects');
});
```

<!-- tabs:end -->

### Body

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

### Form Data

Use `withForm` or `withMultiPartFormData` to pass form data to the request.

#### withForm

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

#### withMultiPartFormData

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

### GraphQL

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

### Request Timeout

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

## Response Validation

**pactum** allows us to validate the received responses content & as well as external interactions made by the service under test during [Component Testing](component-testing).

Expectations helps us to assert the response received from the server.

| Method                  | Description                               |
| ----------------------- | ----------------------------------------- |
| `expect`                | runs custom expect handler                |
| `expectStatus`          | check HTTP status                         |
| `expectHeader`          | check HTTP header key + value             |
| `expectHeaderContains`  | check HTTP header key + partial value     |
| `expectBody`            | check exact match of body                 |
| `expectBodyContains`    | check body contains the value             |
| `expectJson`            | check exact match of json                 |
| `expectJsonAt`          | check json using **json-query**           |
| `expectJsonLike`        | check loose match of json                 |
| `expectJsonLikeAt`      | check json like using **json-query**      |
| `expectJsonSchema`      | check json schema                         |
| `expectJsonSchemaAt`    | check json schema using **json-query**    |
| `expectJsonMatch`       | check json to match                       |
| `expectJsonMatchAt`     | check json to match using **json-query**  |
| `expectResponseTime`    | check response time                       |
| `wait`                  | wait before performing validation         |

### Status & Headers & Response Time

Expecting Status Code & Headers & response time from the response.

```javascript
const expect = pactum.expect;

it('get post with id 1', async () => {
  const response = await pactum.spec()
    .get('https://jsonplaceholder.typicode.com/posts/1')
    .expectStatus(200)
    .expectHeader('content-type', 'application/json; charset=utf-8')
    .expectHeader('connection', /\w+/)
    .expectHeaderContains('content-type', 'application/json')
    .expectResponseTime(100);

  expect(response).to.have.status(200);
  expect(response).to.have.header('connection', 'close');
});
```

### JSON

Most REST APIs will return a JSON response. This library has few methods to validate a JSON response in many aspects.

#### expectJson

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

#### expectJsonAt

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

#### expectJsonLike

Performs partial deep equal. 

* Allows Regular Expressions.
* Allows Assert Expressions.
* Allows Assert Handlers.
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

##### Assert Expressions

Assert Expressions helps to run custom JavaScript code on a JSON that performs user defined assertions. 

 * Expression should contain `$V` to represent current value.
 * Expression should be a valid JavaScript code.
 * Expression should return a *boolean*.

!> String containing **$V** will be automatically treated as a Assert Expression.

```javascript
it('get users', async () => {
  await pactum.spec()
    .get('/api/users')
    .expectJsonLike('$V.length === 10'); // api should return an array with length 10
    .expectJsonLike([
      {
        id: 'typeof $V === "string"',
        name: 'jon',
        age: '$V > 30' // age should be greater than 30 
      }
    ]);
});
```

You are also allowed to change the default value `$V` to some other string based on your usage. *Be cautious that all the strings containing the new value will be treated as assert expressions and pactum will try to evaluate it as a javascript code*.

```javascript
pactum.settings.setAssertExpressionStrategy({ includes: '$' });

it('get users', async () => {
  await pactum.spec()
    .get('/api/users')
    .expectJsonLike([
      {
        name: 'jon',
        age: '$ > 30' // age should be greater than 30 
      }
    ]);
});
```

##### Assert Handlers

Assert Handlers helps us to reuse the custom JavaScript assertion code on a JSON. With this we can easily extend the capabilities of `expectJsonLike` to solve complex assertions.

 * Handler name will be prefixed with `#`.
 * Handler function should return a *boolean*.

!> String starting with **#** will be automatically treated as a Assert Handler. 

Handlers is a powerful concept in pactum that helps to reuse different things. To add a assert handler use `handler.addAssertHandler` function.

* First param will be the name of the assert handler which will be used in `expectJsonLike` to refer it.
* Second param will be a function that accepts a context object as an argument. Context object will have `data` property that will represent the current value in JSON. It also includes optional `args` property that includes custom arguments. 

```javascript
pactum.handler.addAssertHandler('number', (ctx) => {
  return typeof ctx.data === 'number';
});

it('get users', async () => {
  await pactum.spec()
    .get('/api/users')
    .expectJsonLike([
      {
        id: '#number',
        name: 'jon'
      }
    ]);
});
```

Custom arguments can be passed to the handler function by using comma separated values after `:`.

```javascript
pactum.handler.addAssertHandler('type', (ctx) => {
  return typeof ctx.data === ctx.args[0];
});

it('get users', async () => {
  await pactum.spec()
    .get('/api/users')
    .expectJsonLike([
      {
        id: '#type:number',
        name: 'jon'
      }
    ]);
});
```

You are also allowed to change the default value `#` to some other string based on your usage. *Be cautious that all the strings starting with the new value will be treated as assert handlers*.

```javascript
pactum.settings.setAssertHandlerStrategy({ starts: '##' });

it('get users', async () => {
  await pactum.spec()
    .get('/api/users')
    .expectJsonLike([
      {
        id: '##handlerName:arg1,arg2',
        name: 'jon'
      }
    ]);
});
```

#### expectJsonLikeAt

Allows validation of specific part in a JSON. See [json-query](https://www.npmjs.com/package/json-query) for more usage details.

* Performs partial deep equal.
* Allows Regular Expressions.
* Allows Assert Expressions.
* Allows Assert Handlers.
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

#### expectJsonSchema

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

#### expectJsonSchemaAt

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

#### expectJsonMatch

Allows validation of JSON with a set of matchers. See [Matching](matching) for more usage details.

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

#### expectJsonMatchAt

Allows validation of specific part in a JSON with a set of matchers. See [Matching](matching) for more usage details. See [json-query](https://www.npmjs.com/package/json-query) for more usage details.

```javascript
const { like } = pactum.matchers;

it('get people', async () => {
  const response = await pactum.spec()
    .get('https://some-api/people')
    .expectStatus(200)
    .expectJsonMatchAt('people[0]', {
      id: like(1),
      name: 'jon'
    });
});
```

### Custom Validations

You can also add custom expect handlers to this library for making much more complicated assertions that are ideal to your requirement. You can bring your own assertion library or take advantage of popular libraries like [chai](https://www.npmjs.com/package/chai).

#### AdHoc

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

#### Common

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

## Request Settings

This library also offers us to set default options for all the requests that are sent through it.

### setBaseUrl

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

### setDefaultTimeout

Sets the default timeout for all the HTTP requests.
The default value is **3000 ms**

```javascript
pactum.request.setDefaultTimeout(5000);
```

### setDefaultHeaders

Sets default headers for all the HTTP requests.

```javascript
pactum.request.setDefaultHeaders('Authorization', 'Basic xxxxx');
pactum.request.setDefaultHeaders({ 'content-type': 'application/json'});
```

### setDefaultFollowRedirects

Sets default follow redirect option for HTTP requests.

```javascript
pactum.request.setDefaultFollowRedirects(true);
```

# NEXT

----

<a href="#/quick-start" >
  <img src="https://img.shields.io/badge/PREV-Quick%20Start-orange" alt="Quick Start" align="left" style="display: inline;" />
</a>
<a href="#/integration-testing" >
  <img src="https://img.shields.io/badge/NEXT-Integration%20Testing-blue" alt="Integration Testing" align="right" style="display: inline;" />
</a>
