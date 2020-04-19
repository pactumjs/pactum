# Interactions

Interactions are the way to instruct or train the mock server to respond in a particular way when a particular request is received. An interaction is an individual message that combines a request sent by the consumer & minimal expected response replied by the provider. Interactions help you to control the state of your providers. They are categorized into two:

* Mock Interaction
* Pact Interaction

The main difference between mock & pact interactions is that mock interaction cannot form a contract while a pact interaction can.

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

----------------------------------------------------------------------------------------------------------------