# Consumer Testing

Consumer testing is the first step in contract testing. This testing helps in building/generating contracts for consumers with its external providers.

In **pactum**, consumer tests are written as a wrapper around the [component testing](https://github.com/ASaiAnudeep/pactum/wiki/Component-Testing).

## Table of contents

* [Getting Started](#getting-started)
  * [Example Scenario](#example-scenario)
* [API](#api)

## Getting Started

Before getting started with consumer testing, get familiar with [component testing](https://github.com/ASaiAnudeep/pactum/wiki/Component-Testing)

### Example Scenario

Here we have an example describing pactum consumer tests between a consumer (order-service) and its provider (product-service).

To make things simple, lets assume order-service has a single order with id `1`. When requested for this order details, order-service will fetch corresponding product details from its provider product-service.


#### Order Service Code

```javascript
const fetch = require('node-fetch');
const express = require('express');
const app = express();

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://my-shop.com';

app.get('/api/orders/1', (req, res) => {
  // order with id "1" includes a product with id "190"
  const productId = 190;
  // fetches product details with id "190"
  fetch(`${PRODUCT_SERVICE_URL}/api/products?id=${productId}`)
    .then(product => {
      const order = {
        id: 1,
        product: {
          id: productId,
          name: product.name
          price: product.price
        }
      }
      // responds with order details
      res.send(order);
    });
});

app.listen(3000, () => console.log(`Example app listening on port ${port}!`))
```

Making a request to get order details will result in the following response

```json
{
  "id": 1,
  "product": {
    "id": 190,
    "name": "book",
    "price": 321.12
  }
}
```

#### Component Test for Order Service

A general component test for order service might look like:

```javascript
const pactum = require('pactum');

it('should fetch order details', async () => {
  await pactum
    .get('http://localhost:3000/api/orders/1')
    .expectStatus(200)
    .expectJson({
      "id": 1,
      "product": {
        "id": 190,
        "name": "book",
        "price": 321.12
      }
    })
    .toss();
});
```

As described earlier, during component testing the order-service will be talking to a mock version of product-service.

#### Consumer Test for Order Service

During consumer testing with **pactum**, you don't need to spin up a mock server & train it to behave like product service. Pactum comes with its own mock server where you can train your service on the fly to react in a specific way when a specific request is received.

As you observed in consumer code, the order-service will be making the following request on product-service.

```json
Request:
--------------------------
Method  -   GET
Path    -   /api/products
Query   -   id = 1

Response
--------------------------
{
  "id": 190,
  "name": "book",
  "price": 321.12
}
```

Pactum allows you to add this interaction to the mock server before running a consumer test case. And also it automatically removes all interactions after the execution of a test case.

Yoc can add an Pact Interaction by

```javascript
const pactum = require('pactum');

pactum.addPactInteraction({
  provider: 'product-service',
  state: 'there is product with id 190',
  uponReceiving: 'a request for product',
  withRequest: {
    method: 'GET',
    path: '/api/products',
    query: {
      id: 190
    }
  },
  willRespondWith: {
    status: 200,
    headers: {
      'content-type': 'application/json'
    },
    body: {
      "id": 190,
      "name": "book",
      "price": 321.12
    }
  }
});
```

Now, while running order service you need to update order-service to talk with pactum's mock server. By default pactum mock server runs on port `9393`.

A consumer test might look like

```javascript
const pactum = require('pactum');

before(async () => {
  // sets the name of the consumer
  pactum.pact.setConsumerName('order-service');
  // starts the mock server on port 9393
  await pactum.mock.start();
});

it('should fetch order details', async () => {
  await pactum
    .addPactInteraction({
      provider: 'product-service',
      state: 'there is product with id 190',
      uponReceiving: 'a request for product',
      withRequest: {
        method: 'GET',
        path: '/api/products',
        query: {
          id: 190
        }
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          "id": 190,
          "name": "book",
          "price": 321.12
        }
      }
    })
    .get('http://localhost:3000/api/orders/1')
    .expectStatus(200)
    .expectJson({
      "id": 1,
      "product": {
        "id": 190,
        "name": "book",
        "price": 321.12
      }
    })
    .toss();
});

after(async () => {
  // saves the contract file in ./pacts/ folder
  pactum.pact.save();
  // stops the mock server
  await pactum.mock.stop();

});
```

A real application/service is much more complicated with a lot of moving parts. The service under test might be talking to many more external services. **Pactum** allows you to specify multiple interactions in a single test case. You can add multiple pact & mock interactions in a single spec.

If anyone of the interaction is not exercised, the test will fail. At the end of the test case, all these interactions will be removed from the server.

```javascript
await pactum
  .addPactInteraction(`GET_PRODUCT_DETAILS_WITH_ID_1`)
  .addPactInteraction(`POST_AUDIT_DETAILS`)
  .addMockInteraction(`GET_DELIVERY_DETAILS`)
  .get('http://localhost:3000/api/orders/1')
  .expectStatus(200)
  .expectJson({
    "id": 1,
    "product": {
      "id": 190,
      "name": "book",
      "price": 321.12
    }
  })
  .toss();
```

#### Publishing Contracts to Pact Broker

Final step of consumer testing is to publish the contracts (pact files) to a shared location like pact-broker.

```javascript
await pactum.pact.publish({
  pactFilesOrDirs: ['./pacts/'],
  pactBroker: 'http://localhost:9292',
  consumerVersion: '1.2.3'
});
```

## API

### pactum.mock

#### setDefaultPort
Type: `Function`<br>

Sets the port of the mock server to start. The default port of the server is `9393`.

*This function should be called before starting the server.*

```javascript
pactum.mock.setDefaultPort(3333);
```

#### start
Type: `Function`<br>

Starts the mock server on the default/custom port.

```javascript
pactum.mock.start();
```

#### stop
Type: `Function`<br>

Stops the mock server.

```javascript
pactum.mock.stop();
```

### pactum.pact

#### setConsumerName
Type: `Function`<br>

sets the name of the consumer

```javascript
pactum.pact.setConsumerName('order-service');
```

#### save
Type: `Function`<br>

saves all the contracts(pact files) in the specified directory

```javascript
pactum.pact.save();
```

#### setPactFilesDirectory
Type: `Function`<br>

sets directory for saving pact files

*This should be called before save()*

```javascript
pactum.pact.save();
```

#### publish
Type: `Function`<br>

publish pact files to pact broker

*This should be called after save()*

```javascript
pactum.pact.publish({
  pactFilesOrDirs: ['./pacts/'],
  pactBroker: 'http://pact-broker',
  pactBrokerUsername: 'username',
  pactBrokerPassword: '********',
  consumerVersion: '1.2.22',
  tags: ['QA', 'DEV']
});
```

----------------------------------------------------------------------------------------------------------------


<a href="https://github.com/ASaiAnudeep/pactum/wiki/Contract-Testing" >
  <img src="https://img.shields.io/badge/PREV-Contract%20Testing-orange" alt="Contract Testing" align="left" style="display: inline;" />
</a>
<a href="https://github.com/ASaiAnudeep/pactum/wiki/Provider-Verification" >
  <img src="https://img.shields.io/badge/NEXT-Provider%20Verification-blue" alt="Provider Verification" align="right" style="display: inline;" />
</a>