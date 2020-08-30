## Component Testing with Mock Server

Lets assume you have an order-service which is a RESTFull API service running on port 3000. Consider if order-service depends on a currency-service to fetch the prices.

Start the order-service & overwrite the endpoint of currency-service to http://localhost:9393

```javascript
const pactum = require('pactum');

before(async () => {
  // starts the mock service on port 9393 (port number can be modified)
  await pactum.mock.start();
});

it('should fetch order details', async () => {
  await pactum
    // here we are training the mock server to act as currency-service
    // if the order-service fails to make a call to this endpoint then
    // the test will fail with - Interaction Not Exercised
    // after the execution of this spec, the mock interaction will be removed
    .addMockInteraction({
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
    .get('http://localhost:3000/api/orders/123')
    .expectStatus(200)
    .expectJson({
      orderId: '123',
      price: '3030',
      currency: 'INR'
    })
    .toss();
});

after(async () => {
  // stops the mock service on port 9393 (port number can be modified)
  await pactum.mock.stop();
});
```

If the order-service interacts with multiple services, we can add multiple mock interactions.

```javascript
const pactum = require('pactum');

before(async () => {
  await pactum.mock.start();
});

it('should fetch order details', async () => {
  await pactum
    // if the order-service fails to make a call to this endpoint then
    // the test will fail with - Interaction Not Exercised
    .addMockInteraction({
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
    // if the order-service fails to make a call to this endpoint then
    // the test will fail with - Interaction Not Exercised
    .addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/api/allocations/123'
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: [12, 13]
      }
    })
    .get('http://localhost:3000/api/orders/123')
    .expectStatus(200)
    .expectJson({
      orderId: '123',
      price: '3030',
      currency: 'INR'
    })
    .toss();
});

after(async () => {
  await pactum.mock.stop();
});
```

The scope of each interaction added through `pactum.addMockInteraction()` will be restricted to current spec (`it` block)
To add mock interactions that will be consumed in all the specs use - `pactum.mock.addMockInteraction()`

```javascript
const pactum = require('pactum');

before(async () => {
  await pactum.mock.start();

  // adds a default mock interaction
  pactum.mock.addMockInteraction({
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
});

it('should fetch order details for id 123', async () => {
  await pactum
    .get('http://localhost:3000/api/orders/123')
    .expectStatus(200)
    .expectJson({
      orderId: '123',
      price: '3030',
      currency: 'INR'
    })
    .toss();
});

it('should fetch order details for id 124', async () => {
  await pactum
    .get('http://localhost:3000/api/orders/124')
    .expectStatus(200)
    .expectJson({
      orderId: '124',
      price: '5643',
      currency: 'INR'
    })
    .toss();
});

after(async () => {
  // removes all default interactions
  pactum.mock.clearDefaultInteractions();
  await pactum.mock.stop();
});
```

### Mock Interaction

Methods to add a mock interaction:

* `pactum.addMockInteraction()`
* `pactum.mock.addMockInteraction()`

| Property                | Type    | Required | Description                |
| ----------------------- | ------- | -------- | -------------------------- |
| id                      | string  | optional | id of the interaction      |
| consumer                | string  | optional | name of the consumer       |
| provider                | string  | optional | name of the provider       |
| state                   | string  | optional | state of the provider      |
| uponReceiving           | string  | optional | description of the request |
| withRequest             | object  | required | request details            |
| withRequest.method      | string  | required | HTTP method                |
| withRequest.path        | string  | required | api path                   |
| withRequest.headers     | object  | optional | request headers            |
| withRequest.query       | object  | optional | query parameters           |
| withRequest.body        | any     | optional | request body               |
| withRequest.ignoreQuery | boolean | optional | ignore request query       |
| withRequest.ignoreBody  | boolean | optional | ignore request body        |
| willRespondWith         | object  | required | response details           |
| willRespondWith.status  | number  | required | response status code       |
| willRespondWith.headers | object  | optional | response headers           |
| willRespondWith.body    | any     | required | response body              |
