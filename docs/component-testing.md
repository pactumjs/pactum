# Component Testing

Component testing is defined as a software testing type, in which the testing is performed on each component (*or service*) separately without integrating with other components (*or services*).

These tests are all about testing the functionality of individual service. During this, your service will be talking to other external services. But instead of talking to real external services, they talk to mock versions of external services.

It involves testing a service in isolation by 

* starting a mock server locally (*lets say in port 4000*)
* starting the service under test locally (*lets say in port 3000*) by updating the configuration of it to point the mock server for all external calls.
* if the service is dependent on a database, start it & connect it to your service.

## Example

To better understand component testing, consider an e-commerce application that has multiple micro-services that power it.

It has a **order-service** that manages orders. When a user places an order, it will internally communicates with the **inventory-service** to check if the product is available or not. 

We can write two simple functional tests

* Buy a product which is in-stock
* Buy a product which is out-of-stock


*order-service* has an API endpoint `/api/orders` that accepts a POST request with the following JSON with product details.

```json
{
  "Name": "iPhone X",
  "Quantity": 2
}
```

*inventory-service* exposes an API endpoint `/api/inventory` that returns available products in the inventory. When requested it will return product availability details in the form of following JSON

```json
{
  "InStock": true
}
```

When user places an order, *order-service* will make a GET request to `/api/inventory?product=iPhone`. Based on the response from the *inventory-service*, it will accept or reject an order.

We train the mock server to return a successful response for product - *iPhone* & unsuccessful response for product - *Galaxy*.

If the mock server is written in **express** the internal code for mock server will look like

```javascript
const app = require('express')();

app.get('/api/inventory', (req, res) => {
  if (req.query.product === 'iPhone') {
    res.send({ InStock = true });
  } else {
    res.send({ InStock = false });
  }
});

app.listen(4000, () => {});
```

Lets look at the component tests.

```javascript
it('should buy a product which is in stock', () => {
  await pactum.spec()
    .post('/api/orders')
    .withJson({
      "name": "iPhone",
      "quantity": 1
    })
    .expectStatus(200);
});

it('should not buy a product which is out-of-stock', () => {
  await pactum.spec()
    .post('/api/orders')
    .withJson({
      "name": "Galaxy",
      "quantity": 1
    })
    .expectStatus(400)
    .expectJson({
      "message": "product is out-of-stock"
    });
});
```

As the functionality of the service grows, the dependency of the *order-service* on other services will increase. To test different scenarios, it becomes difficult to control the behavior of mock server.

But **pactum** makes component testing easy & fun as it allows us to control the behavior of the mock server for each & every test case. It works on top of [API Testing](https://github.com/ASaiAnudeep/pactum/wiki/Component-Testing) & [Mock Server](https://github.com/ASaiAnudeep/pactum/wiki/Mock-Server). If you haven't read about them, use the above links to learn more about them.

Instead of spinning a separate mock server, pactum comes with it. Multiple interactions can be added to the mock server before the execution of a test case through `useMockInteraction` method. If these interactions are not exercised then the test case will fail. If an unexpected request is sent to the mock server, it will respond with *404* - *Interaction Not Found*.

```javascript
before(async () => {
  await mock.start(3000);
});

it('should buy a product which is in stock', () => {
  await pactum.spec()
    .useMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/api/inventory',
        query: {
          product: 'iPhone'
        }
      },
      willRespondWith: {
        status: 200,
        body: {
          "InStock": true
        }
      }
    })
    .post('/api/orders')
    .withJson({
      "name": "iPhone",
      "quantity": 1
    })
    .expectStatus(200);
});

it('should not buy a product which is out-of-stock', () => {
  await pactum.spec()
    .useMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/api/inventory',
        query: {
          product: 'iPhone'
        }
      },
      willRespondWith: {
        status: 200,
        body: {
          "InStock": false
        }
      }
    })
    .post('/api/orders')
    .withJson({
      "name": "iPhone",
      "quantity": 1
    })
    .expectStatus(400)
    .expectJson({
      "message": "product is out-of-stock"
    });
});

after(async () => {
  await mock.stop();
});
```

## API

### Multiple Interactions

`useMockInteraction` method will add interactions to the mock server. Once the interactions are added, you can build your request & expectations on top of it. 

 * These interactions are auto removed after the spec is executed.
 * If these interactions are not exercised, the test spec will fail.
 * You can add multiple interactions for a single test spec.

```javascript
it('should not buy a product which is out-of-stock', () => {
  await pactum.spec()
    .useMockInteraction(/* one interaction details */)
    .useMockInteraction(/* another interaction details */)
    .post('/api/orders')
    .withJson({
      "name": "iPhone",
      "quantity": 1
    })
    .expectStatus(400)
    .expectJson({
      "message": "product is out-of-stock"
    });
});
```

### Mock Interaction Handlers

There are high chances that you wanted to use same interaction in multiple occasions. To reuse interactions, you can create separate *js* files to hold interactions & import them in your spec file. This is one way to solve the issue. But there is a better way.

Mock handlers help us to reuse interactions across tests. Use `handler.addMockInteractionHandler` function to temporarily store an interaction & later use it in test cases.

It accepts two arguments

* handler name - a string to reference the interaction later
* callback function - it should return a mock interaction

While using a mock handler, you can pass custom data into it to change the behavior of the interaction. Look at the below example where we use the same interaction in both scenarios.

```javascript
const handler = pactum.handler;

before(async () => {
  handler.addMockInteractionHandler('get product', (ctx) => {
    return {
      withRequest: {
        method: 'GET',
        path: '/api/inventory',
        query: {
          product: ctx.data.product
        }
      },
      willRespondWith: {
        status: 200,
        body: {
          "InStock": ctx.data.inStock
        }
      }
    }    
  });
});

it('should buy a product which is in stock', () => {
  await pactum.spec()
    .useMockInteraction('get product', { product: 'iPhone', inStock: true })
    .post('/api/orders')
    .withJson({
      "name": "iPhone",
      "quantity": 1
    })
    .expectStatus(200);
});

it('should not buy a product which is out-of-stock', () => {
  await pactum.spec()
    .useMockInteraction('get product', { product: 'iPhone', inStock: false })
    .post('/api/orders')
    .withJson({
      "name": "iPhone",
      "quantity": 1
    })
    .expectStatus(400)
    .expectJson({
      "message": "product is out-of-stock"
    });
});
```

### Non CRUD Endpoints

Not all endpoints will perform CRUD operations. Some endpoints will perform some long running operations in the background even though it sends a response immediately. It becomes difficult to test how it interacts with other services in the background.

This library helps to validate whether interactions are exercised or not in the background. We can also validate the number of times the interaction is exercised.

Use `mock.addMockInteraction` to add a interaction to the server & later use `mock.getInteraction` to get interaction details & perform validations on it.

Lets look at an example

```javascript
it('some background process', () => {
  const id = mock.addMockInteraction('get product');
  await pactum.spec()
    .post('/api/process')
    .expectStatus(202);
  // wait for the process to complete
  const interaction = mock.getInteraction(id);
  expect(interaction.exercised).equals(true);
  expect(interaction.callCount).equals(1);
  mock.removeInteraction(id);
});
```

### Using Remote Server


----------------------------------------------------------------------------------------------------------------

<a href="https://github.com/ASaiAnudeep/pactum/wiki" >
  <img src="https://img.shields.io/badge/PREV-Home-orange" alt="Home" align="left" style="display: inline;" />
</a>
<a href="https://github.com/ASaiAnudeep/pactum/wiki/Contract-Testing" >
  <img src="https://img.shields.io/badge/NEXT-Contract%20Testing-blue" alt="Contract Testing" align="right" style="display: inline;" />
</a>
