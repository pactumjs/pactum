## Example - Consumer Test

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
