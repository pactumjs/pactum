# Contract Testing

Contract testing is a technique for testing an integration point by checking each application in isolation to ensure the messages it sends or receives conform to a shared understanding that is documented in a **contract**.

```javascript
const pactum = require('pactum');

before(async () => {
  await pactum.mock.start();
});

it('should fetch order details', async () => {
  await pactum
    // here we are training the mock server to act as currency-service
    // if the order-service fails to make a call to this endpoint then
    // the test will fail with - Interaction Not Exercised
    // after the execution of this spec, the pact interaction will be removed
    .addPactInteraction({
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

### Pact Interaction

Methods to add a pact interaction:

* `pactum.addPactInteraction()`
* `pactum.mock.addDefaultPactInteraction()`

| Property                | Type    | Required | Description                |
| ----------------------- | ------- | -------- | -------------------------- |
| id                      | string  | optional | id of the interaction      |
| consumer                | string  | required | name of the consumer       |
| provider                | string  | required | name of the provider       |
| state                   | string  | required | state of the provider      |
| uponReceiving           | string  | required | description of the request |
| withRequest             | object  | required | request details            |
| withRequest.method      | string  | required | HTTP method                |
| withRequest.path        | string  | required | api path                   |
| withRequest.headers     | object  | optional | request headers            |
| withRequest.query       | object  | optional | query parameters           |
| withRequest.body        | any     | optional | request body               |
| willRespondWith         | object  | required | response details           |
| willRespondWith.status  | number  | required | response status code       |
| willRespondWith.headers | object  | optional | response headers           |
| willRespondWith.body    | any     | required | response body              |

