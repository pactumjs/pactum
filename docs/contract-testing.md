# Contract Testing

Contract Testing is a technique for testing interactions between applications (often called as services) that communicate with each other, to ensure the messages they send or receive conform to a shared understanding that is documented in a **contract**.

Contract Testing gives a way for services to enter into an agreement on how they are going to communicate with each other. Once the agreement is in place it provides a way to modify the agreement but before the change takes effect, the services need to sign off on the new contract.

Learn more about contract testing at [pact.io](https://docs.pact.io)

> Pactum is inspired from **pact.io**. Pactum works at HTTP layer while pact.io works at unit testing level.

## Table of contents

* [Terminology](#terminology)
* [Workflow](#workflow)
  * [Consumer Testing](#consumer-testing)
  * [Provider Verification](#provider-verification)
* [Interactions](#interactions)

## Terminology

* **Consumer** - An application that makes use of the functionality or data from another application to do its job.

* **Provider** - An application (often called a service) that provides functionality or data for other applications to use, often via an API.

* **Contract** - A contract is a documented form of shared understanding between a consumer & a provider. Pact creates this document in the form of **JSON** file.

* **Pact** - A contract between a consumer and provider is called a pact. Each pact is a collection of interactions.

* **Interaction** - An individual message that combines a request sent by the consumer & minimal expected response replied by the provider.

* **Minimal Expected Response** - It describes the parts of the response the consumer wants the provider to return.

## Workflow

Pactum follows the same workflow of [pact.io](https://docs.pact.io)

Contract Testing has two steps

1. Consumer Testing
2. Provider Verification

### Consumer Testing

Consumer Testing is performed at consumer pipeline.

During consumer testing, a consumer will generate pacts with its provider using interactions. Consumer Pact tests operate on each interaction to say *"assuming the provider returns the expected response for this request, does the consumer code correctly generate the request and handle the expected response?"*.

### Provider Verification

Provider Verification is performed at providers pipeline.

During provider verification, each request is sent to the provider, and the actual response it generates is compared with the minimal expected response described in the consumer test.

## Interactions

An interaction is an individual message that combines a request sent by the consumer & minimal expected response replied by the provider. Interactions help you to control the the state of your providers (mock server). They are categorized into two:

* Mock Interaction
* Pact Interaction

The main difference between mock & pact interactions is that mock interaction cannot form a contract while a pact interaction can.


### API

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

