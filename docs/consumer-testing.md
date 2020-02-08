# Consumer Testing

Consumer testing is the first step in contract testing. This testing helps in building/generating contracts for consumers with its external providers.

In **pactum**, consumer tests are written as a wrapper around the [component testing](https://github.com/ASaiAnudeep/pactum/wiki/Component-Testing).

## Getting Started

Before getting started with consumer testing, get familiar with [component testing](https://github.com/ASaiAnudeep/pactum/wiki/Component-Testing) and a little bit on [interactions](https://github.com/ASaiAnudeep/pactum/wiki/interactions). **Interactions** are explained in a much more detailed way in this page.

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
    .then(res => {
      const productDetails = res;
      const order = {
        id: 1,
        product: {
          id: productId,
          name: productDetails.name
          price: productDetails.price
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

As described earlier, during component testing order-service will be talking to a mock version of product-service.

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

Pactum allows you to add this interaction to the mock server before running a component test case & it automatically removes all interactions after the execution of test case.

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
  // starts the mock server on port 9393
  await pactum.mock.start();
});

it('should fetch order details', async () => {
  await pactum.addPactInteraction({
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
  // stops the mock server
  await pactum.mock.stop();
});
```
