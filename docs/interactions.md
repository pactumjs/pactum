# Interactions

Interactions are the way to instruct or train the mock server to respond in a particular way when a particular request is received. An interaction is an individual message that combines a request sent by the consumer & minimal expected response replied by the provider. Interactions help you to control the state of your providers. They are categorized into two:

* Mock Interaction
* Pact Interaction

The main difference between mock & pact interactions is that mock interaction cannot form a contract while a pact interaction can.

## Table of contents

* [API](#api)
* [Request Matching](#request-matching)

## API

Interactions can be added or removed from the mock server in the following ways.

* When using pactum as a **testing tool**
  * `pactum.addPactInteraction({ })` - auto removed after the test case execution
  * `pactum.addMockInteraction({ })` - auto removed after the test case execution
* When using pactum as a **testing tool** or **mock server**
  * `pactum.mock.addDefaultMockInteraction({ })`
  * `pactum.mock.addDefaultPactInteraction({ })`
  * `pactum.mock.addDefaultMockInteractions([{ }])`
  * `pactum.mock.addDefaultPactInteractions([{ }])`
  * `pactum.mock.removeDefaultInteraction('')`
  * `pactum.mock.clearDefaultInteractions()`
* Through **remote api**
  * `/api/pactum/mockInteraction`
  * `/api/pactum/pactInteraction`

Learn more about these methods at [Mock Server](https://github.com/ASaiAnudeep/pactum/wiki/Mock-Server)

### Mock Interaction

Mock Interaction will have the following properties.

| Property                        | Type        | Description                 |
| ------------------------------  | ----------  | --------------------------  |
| id                              | string      | id of the interaction       |
| provider                        | string      | name of the provider        |
| withRequest                     | **object**  | request details             |
| withRequest.method              | **string**  | HTTP method                 |
| withRequest.path                | **string**  | api path                    |
| withRequest.headers             | object      | request headers             |
| withRequest.query               | object      | query parameters            |
| withRequest.body                | any         | request body                |
| withRequest.ignoreQuery         | boolean     | ignore request query        |
| withRequest.ignoreBody          | boolean     | ignore request body         |
| withRequest.graphQL             | object      | graphQL details             |
| withRequest.graphQL.query       | **string**  | graphQL query               |
| withRequest.graphQL.variables   | object      | graphQL variables           |
| willRespondWith                 | **any**     | response details            |
| willRespondWith.status          | **number**  | response status code        |
| willRespondWith.headers         | object      | response headers            |
| willRespondWith.body            | any         | response body               |
| willRespondWith.fixedDelay      | number      | delays the response by ms   |
| willRespondWith.randomDelay     | object      | delays the response by ms   |
| willRespondWith.randomDelay.min | number      | delays the response by ms   |
| willRespondWith.randomDelay.max | number      | delays the response by ms   |

#### pactum.addMockInteraction
Type: `Function`<br>

```javascript
pactum.addMockInteraction({
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
```

### Pact Interaction

| Property                      | Type        | Description                 |
| -----------------------       | -------     | --------------------------  |
| id                            | string      | id of the interaction       |
| provider                      | **string**  | name of the provider        |
| state                         | **string**  | state of the provider       |
| uponReceiving                 | **string**  | description of the request  |
| withRequest                   | **object**  | request details             |
| withRequest.method            | **string**  | HTTP method                 |
| withRequest.path              | **string**  | api path                    |
| withRequest.headers           | object      | request headers             |
| withRequest.query             | object      | query parameters            |
| withRequest.body              | any         | request body                |
| withRequest.graphQL           | object      | graphQL details             |
| withRequest.graphQL.query     | string      | graphQL query               |
| withRequest.graphQL.variables | object      | graphQL variables           |
| willRespondWith               | **object**  | response details            |
| willRespondWith.status        | **number**  | response status code        |
| willRespondWith.headers       | object      | response headers            |
| willRespondWith.body          | any         | response body               |

#### pactum.addPactInteraction
Type: `Function`<br>

```javascript
pactum.addPactInteraction({
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
```

## Request Matching

**pactum** supports matching of requests.

It supports following matchers

* `like` or `somethingLike` - matches with the type
* `regex` or `term` - matches with the regular expression
* `eachLike` - matches all the elements in the array with the specified type
* `contains` - checks if actual value contains a specified value in it

Matchers can be applied to

* Path - *supports only regex*
* Query
* Headers - *headers are ignored during request matching until explicitly specified*
* Body

When a request is received by the pactum's mock server, it will attempt to match each interaction with the request. If a match is found, it will respond with the response details in the matched interaction. If no match is found, the mock server will respond with status *404*.

```javascript
it('Matchers - Path & Query', () => {
  return pactum
    .addMockInteraction({
      withRequest: {
        method: 'GET',
        // Matches path with value in matcher. Value inside generate is used in contract testing.
        path: regex({ generate: '/api/projects/1', matcher: /\/api\/projects\/\d+/ }),
        query: {
          // Matches with type. Date can be any string.
          date: like('08/04/2020'),
          // No matcher is applied to the age.
          age: '10'
        } 
      },
      willRespondWith: {
        status: 200
      }
    })
    .get('http://localhost:9393/api/projects/1')
    .withQuery('date', '12/00/9632')
    .expectStatus(200);
});

it('Matchers - Body', () => {
  return pactum
    .addMockInteraction({
      withRequest: {
        method: 'POST',
        path: '/api/person',
        // checks if the body has array of objects with id, name & address
        body: eachLike({
          // checks if id matches with regular expression
          id: term({ generate: 123, matcher: /\d+/ }),
          name: 'Bark',
          address: like({
            // checks if city is string
            city: 'some',
            // checks if pin is number
            pin: 123 
          })
        })
      },
      willRespondWith: {
        status: 200
      }
    })
    .post('http://localhost:9393/api/person')
    .withBody([{
      id: 100,
      name: 'Dark',
      address: {
        city: 'another',
        pin: 5000
      }
    }])
    .expectStatus(200);
});
```

----------------------------------------------------------------------------------------------------------------