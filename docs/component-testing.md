# Component Testing

Component testing is defined as a software testing type, in which the testing is performed on each component (*or service*) separately without integrating with other components (*or services*).

These tests are all about testing the functionality of individual service. During this, your service will be talking to other external services. But instead of talking to real external services, they talk to mock versions of external services.

It involves testing a service in isolation by 

* starting a mock server locally
* starting the service under test locally by updating the configuration of it to point the mock server for all external calls.
* if the service is dependent on a database, start it & connect it to your service.

## Pre Requisite

* [API Testing](api-testing)
* [Integration Testing](integration-testing)
* [Mock Server](mock-server)

## Example

To better understand component testing, consider an e-commerce application that has multiple micro-services that power it.

Assume it has a **order-service** that manages orders. When a user places an order, it will internally communicates with the **inventory-service** to check if the product is available or not. 

We can write two simple functional tests for *order-service*

* Buy a product which is in-stock
* Buy a product which is out-of-stock


*order-service* has an API endpoint `/api/orders` that accepts a POST request with the following JSON with product details for placing an order.

```json
{
  "Name": "iPhone X",
  "Quantity": 2
}
```

*inventory-service* exposes an API endpoint `/api/inventory` that returns available products in the inventory. When requested, it will return the product availability details in the form of following JSON

```json
{
  "InStock": true
}
```

When user places an order, *order-service* will make a GET request to `/api/inventory?product=iPhone`. Based on the response from the *inventory-service*, it will accept or reject an order.

Assume we have a mock server that returns a successful response for product - *iPhone* & unsuccessful response for product - *Galaxy*.

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
    .post('http://localhost:3000/api/orders')
    .withJson({
      "name": "iPhone",
      "quantity": 1
    })
    .expectStatus(200);
});

it('should not buy a product which is out-of-stock', () => {
  await pactum.spec()
    .post('http://localhost:3000/api/orders')
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

This looks simple & easy to test. But as the functionality of the application grows, the dependency of the *order-service* on other services will increase. To test different scenarios, it becomes difficult to control the behavior of mock server.

## Simple Component Tests

**pactum** makes component testing easy & fun as it allows us to control the behavior of the mock server for each & every test case. It works on top of [API Testing](api-testing) & [Mock Server](mock-server). If you haven't read about them, use the above links to learn more about them.

Instead of maintaining a separate mock server, pactum comes with it. Interactions can be added to the mock server before the execution of a test case through `useMockInteraction` method. Once the interactions are added, you can build your request & expectations on top of it.

* Interactions added through `useMockInteraction` method are auto removed from the mock server.
* If interactions added through `useMockInteraction` method are not exercised, *pactum* will immediately fail the test case.

```javascript
const pactum = require('pactum');
const mock = pactum.mock;

before(async () => {
  await mock.start(4000);
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

## Multiple Interactions

In real-life scenarios, a single service might be dependent upon *n* number of services. You can use `useMockInteraction` method multiple times to add multiple interactions.

* All the interactions are auto removed.
* Test will fail, if any one of the interaction is not exercised.

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

## Mock Interaction Handlers

There are high chances that you wanted to use the same interaction in multiple occasions. To reuse interactions, you can create separate *js* files to hold interactions & import them in your spec file. This is one way to solve the issue. But there is a better way through *mock handlers*.

Mock handlers help us to reuse interactions across tests. Use `handler.addMockInteractionHandler` function to temporarily store an interaction & later use it in test cases.

It accepts two arguments

* handler name - a string to refer the interaction later
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

## Non CRUD Endpoints

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

We can also use `wait` method to pause the validation for the background process to complete.

```javascript
it('some background process', () => {
  await pactum.spec()
    .useMockInteraction('get product')
    .post('/api/process')
    .expectStatus(202)
    .wait(1000);
});
```

## Using Remote Mock Server

For some reasons, you want the mock server to be independent of component tests & you still want the ability to control it remotely while running your api tests. This can be achieved through `mock.useRemoteServer` function. While using remote server, all the existing functions will return promises.

Let's look at the below example, where we start the mock server independent of component tests.

```javascript
// server.js
const pactum = require('pactum');
const mock = pactum.mock;
const handler = pactum.handler;

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

mock.start(4000);
```

Everything works as usual when adding interactions through `useMockInteraction` method. But methods from *mock* will return promises. 

```javascript
// test.js
const pactum = require('pactum');
const mock = pactum.mock;

before(() => {
  mock.useRemoteServer('http://localhost:4000');
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

it('some background process', () => {
  const id = await mock.addMockInteraction('get product');
  await pactum.spec()
    .post('/api/process')
    .expectStatus(202);
  // wait for the process to complete
  const interaction = await mock.getInteraction(id);
  expect(interaction.exercised).equals(true);
  expect(interaction.callCount).equals(1);
  await mock.removeInteraction(id);
});
```

## Next

----

<a href="#/mock-server" >
  <img src="https://img.shields.io/badge/PREV-Mock%20Server-orange" alt="Mock Server" align="left" style="display: inline;" />
</a>
<a href="#/contract-testing" >
  <img src="https://img.shields.io/badge/NEXT-Contract%20Testing-blue" alt="Contract Testing" align="right" style="display: inline;" />
</a>
