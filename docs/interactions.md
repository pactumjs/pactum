# Interactions

> Interactions will be explained in much more detailed in [consumer testing](https://github.com/ASaiAnudeep/pactum/wiki/Consumer-Testing)

An interaction is an individual message that combines a request sent by the consumer & minimal expected response replied by the provider. Interactions help you to control the the state of your providers (mock server). They are categorized into two:

* Mock Interaction
* Pact Interaction

The main difference between mock & pact interactions is that mock interaction cannot form a contract while a pact interaction can.


## API

Interactions have the following properties.

| Property                      | Type    | Mock      | Pact      | Description                 |
| -----------------------       | ------- | --------  | --------  | --------------------------  |
| id                            | string  | optional  | optional  | id of the interaction       |
| provider                      | string  | optional  | required  | name of the provider        |
| state                         | string  | optional  | required  | state of the provider       |
| uponReceiving                 | string  | optional  | required  | description of the request  |
| withRequest                   | object  | required  | required  | request details             |
| withRequest.method            | string  | required  | required  | HTTP method                 |
| withRequest.path              | string  | required  | required  | api path                    |
| withRequest.headers           | object  | optional  | optional  | request headers             |
| withRequest.query             | object  | optional  | optional  | query parameters            |
| withRequest.body              | any     | optional  | optional  | request body                |
| withRequest.ignoreQuery       | boolean | optional  | NA        | ignore request query        |
| withRequest.ignoreBody        | boolean | optional  | NA        | ignore request body         |
| withRequest.graphQL           | object  | optional  | optional  | graphQL details             |
| withRequest.graphQL.query     | string  | required  | optional  | graphQL query               |
| withRequest.graphQL.variables | object  | optional  | optional  | graphQL variables           |
| willRespondWith               | object  | required  | required  | response details            |
| willRespondWith.status        | number  | required  | required  | response status code        |
| willRespondWith.headers       | object  | optional  | optional  | response headers            |
| willRespondWith.body          | any     | optional  | optional  | response body               |

Interactions can be added to the mock server in different ways.

* `pactum.addPactInteraction()`
* `pactum.addMockInteraction()`
* `pactum.mock.addDefaultMockInteraction()`
* `pactum.mock.addDefaultPactInteraction()`
* `pactum.mock.addDefaultMockInteractions()`
* `pactum.mock.addDefaultPactInteractions()`

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
  consumer: 'order-service',
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
