# Interactions

Interactions are the way to instruct or train the mock server to respond in a particular way when a particular request is received. An interaction is an individual message that combines a request sent by the consumer & minimal expected response replied by the provider. Interactions help you to control the state of your providers. They are categorized into two:

* Mock Interaction
* Pact Interaction

The main difference between mock & pact interactions is that mock interaction cannot form a contract while a pact interaction can.

## Table of contents

* [API](#api)
* [Matching](#matching)

## API

Interactions can be added or removed from the mock server in the following ways.

* When using pactum as a **testing tool**
  * `pactum.addPactInteraction({ })` - auto removed after the test case execution
  * `pactum.addMockInteraction({ })` - auto removed after the test case execution
* When using pactum as a **testing tool** or **mock server**
  * `pactum.mock.addMockInteraction({ })`
  * `pactum.mock.addPactInteraction({ })`
  * `pactum.mock.addMockInteractions([{ }])`
  * `pactum.mock.addPactInteractions([{ }])`
  * `pactum.mock.removeInteraction('')`
  * `pactum.mock.reset()`
* Through **remote api**
  * `/api/pactum/mockInteraction`
  * `/api/pactum/pactInteraction`

Learn more about these methods at [Mock Server](https://github.com/ASaiAnudeep/pactum/wiki/Mock-Server)

### Mock Interaction

Mock Interaction will have the following properties.

| Property                        | Type        | Description                     |
| ------------------------------  | ----------  | --------------------------      |
| id                              | string      | id of the interaction           |
| provider                        | string      | name of the provider            |
| withRequest                     | **object**  | request details                 |
| withRequest.method              | **string**  | HTTP method                     |
| withRequest.path                | **string**  | api path                        |
| withRequest.headers             | object      | request headers                 |
| withRequest.query               | object      | query parameters                |
| withRequest.body                | any         | request body                    |
| withRequest.ignoreQuery         | boolean     | ignore request query            |
| withRequest.ignoreBody          | boolean     | ignore request body             |
| withRequest.graphQL             | object      | graphQL details                 |
| withRequest.graphQL.query       | **string**  | graphQL query                   |
| withRequest.graphQL.variables   | object      | graphQL variables               |
| willRespondWith                 | **any**     | response details                |
| willRespondWith.status          | **number**  | response status code            |
| willRespondWith.headers         | object      | response headers                |
| willRespondWith.body            | any         | response body                   |
| willRespondWith.fixedDelay      | number      | delays the response by ms       |
| willRespondWith.randomDelay     | object      | delays the response by ms       |
| willRespondWith.randomDelay.min | number      | delays the response by ms       |
| willRespondWith.randomDelay.max | number      | delays the response by ms       |
| willRespondWith.onCall          | object      | response on consecutive  calls  |
| willRespondWith(req, res)       | function    | response with custom function   |

The response of a mock interaction can be controlled in three forms:
1. Static Object
2. Custom Function
3. Dynamic Object

#### pactum.addMockInteraction
Type: `Function`<br>

```javascript
// Static Object
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
});

// Custom Function
pactum.addMockInteraction({
  withRequest: {
    method: 'GET',
    path: '/api/currency/INR'
  },
  willRespondWith: function (req, res) {
    res.status(200);
    res.send({
      id: 1,
      name: 'fake'
    });
  }
});

// Dynamic Object (change behavior on consecutive calls)
pactum.addMockInteraction({
  withRequest: {
    method: 'GET',
    path: '/api/projects/1'
  },
  willRespondWith: {
    status: 204, // default response
    onCall: {
      0: {
        status: 200,
        body: 'Success :)'
      },
      1: {
        status: 201
      },
      2: {
        status: 202
      },
      5: {
        status: 500,
        body: 'No Success :('
      }
    }
  }
});
```

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

## Matching

In real world applications, sometimes it is hard to match an expected request/response with actual request/response.

```javascript
const interaction = {
  withRequest: {
    method: 'GET',
    path: '/api/orders',
    query: {
      // randomly generated id
      id: 'p144XiRTu'
    }
  },
  willRespondWith: {
    status: 200
  }
}
```

To overcome such issues, **pactum** provides a mechanism for request matching during *[Component Testing](https://github.com/ASaiAnudeep/pactum/wiki/Component-Testing)* & *[Consumer Testing](https://github.com/ASaiAnudeep/pactum/wiki/Consumer-Testing)* and response matching during *[Provider Verification](https://github.com/ASaiAnudeep/pactum/wiki/Provider-Verification)*.

**pactum** matching mechanism is inspired from [Pact - Matching](https://docs.pact.io/getting_started/matching)

It supports following matchers

* `like` or `somethingLike` - matches with the type
* `regex` or `term` - matches with the regular expression
* `eachLike` - matches all the elements in the array with the specified type
* `contains` - checks if actual value contains a specified value in it

Matchers can be applied to

* Path - *supports only regex*
* Query
* Headers - *headers are ignored during request matching until explicitly specified*
* Body

### Type Matching

Often, you will not care what the exact value is at a particular path is, you just care that a value is present and that it is of the expected type.

* `like` or `somethingLike`
* `eachLike`

#### like

Type matching for primitive data types - *string*/*number*/*boolean*

```javascript
const { like } = pactum.matchers;
const interaction = {
  withRequest: {
    method: 'GET',
    path: '/api/orders',
    query: {
      // matches if it has id & of type string
      id: like('abc')
    }
  },
  willRespondWith: {
    status: 200,
    body: {
      // matches if it has quantity & active properties with number & bool types
      quantity: like(2),
      active: like(true)
    }
  }
}
```

Type matching for objects in **pactum** deviates from in **pact.io** when matching nested objects.

```javascript
const { like } = pactum.matchers;
const interaction = {
  withRequest: {
    method: 'GET',
    path: '/api/orders'
  },
  willRespondWith: {
    status: 200,
    // matches if body is JSON & has quantity & active properties with number & bool types
    body: like({
      quantity: 2,
      active: true
    })
  }
}
```

```javascript
// matching doesn't expand to nested objects
const { like } = pactum.matchers;
const interaction = {
  withRequest: {
    method: 'GET',
    path: '/api/orders'
  },
  willRespondWith: {
    status: 200,
    // matches if body is JSON object
    // & it has quantity, active & item properties with number, bool & object types respectively
    // & item has name & brand properties with 'car' & 'v40' values respectively
    body: like({
      quantity: 2,
      active: true,
      item: {
        name: 'car',
        brand: 'v40'
      }
    })
  }
}
```

```javascript
// to match nested objects with type, we need apply 'like()' explicitly to nested objects
const { like } = pactum.matchers;
const interaction = {
  withRequest: {
    method: 'GET',
    path: '/api/orders'
  },
  willRespondWith: {
    status: 200,
    // matches if body is JSON object
    // & it has quantity, active, item & delivery properties with number, bool & object types respectively
    // & item has name & brand properties with string types
    // & delivery has pin property with type number & has state property with 'AP' as value
    body: like({
      quantity: 2,
      active: true,
      item: like({
        name: 'car',
        brand: 'v40'
      }),
      delivery: {
        pin: like(500081),
        state: 'AP'
      }
    })
  }
}
```

#### eachLike

*eachLike* is similar to *like* but applies to arrays.

```javascript
const { eachLike } = pactum.matchers;
const interaction = {
  withRequest: {
    method: 'GET',
    path: '/api/orders'
  },
  willRespondWith: {
    status: 200,
    // matches if body is an array of JSON objects
    // & each object in array should have it has quantity, active, item
    // & item has name property with string type
    // & item has colors property with array of strings
    body: eachLike({
      quantity: 2,
      active: true,
      item: like({
        name: 'car',
        colors: eachLike('blue')
      }
    })
  }
}
```

### Regex Matching

Sometimes you will have keys in a request or response with values that are hard to know beforehand - timestamps and generated IDs are two examples.

What you need is a way to say "I expect something matching this regular expression, but I don't care what the actual value is".

#### regex

```javascript
const { regex } = pactum.matchers;
const interaction = {
  withRequest: {
    method: 'GET',
    path: regex('/api/projects/\\d+')
  },
  willRespondWith: {
    status: 200,
    body: {
      name: 'xyx'
      birthDate: regex({
        generate: '03/05/2020',
        matcher: /\d{2}\/\d{2}\/\d{4}/
      })
    }
  }
}
```

## Request Matching

When a request is received by the pactum's mock server, it will attempt to match each interaction with the request. If a match is found, it will respond with the response details in the matched interaction. If no match is found, the mock server will respond with status *404*.

*As a rule of thumb, you generally want to use exact matching when you're setting up the expectations for a request because you're under control of the data at this stage, and according to Postel's Law, we want to be "strict" with what we send out. Note that the request matching does not allow "unexpected" values to be present in JSON request bodies or query strings. (It does however allow extra headers, because we found that writing expectations that included the headers added by the various frameworks that might be used resulted in tests that were very fiddly to maintain.)*

> Applicable during *component testing* and *consumer testing*

```javascript
const pactum = require('pactum');
const { like, somethingLike, term, regex, eachLike, contains } = pactum.matchers;

it('Matchers - Path & Query', () => {
  return pactum
    .addMockInteraction({
      withRequest: {
        method: 'GET',
        // Matches path with value in matcher. Value inside generate is used in contract testing.
        path: regex({ generate: '/api/projects/1', matcher: /\/api\/projects\/\d+/ }),
        query: {
          // Matches with type. Date can be any string.
          date: like('08/04/2020'),
          // No matcher is applied to the age.
          age: '10'
        } 
      },
      willRespondWith: {
        status: 200
      }
    })
    .get('http://localhost:9393/api/projects/1')
    .withQueryParam('date', '12/00/9632')
    .expectStatus(200);
});

it('Matchers - Body', () => {
  return pactum
    .addMockInteraction({
      withRequest: {
        method: 'POST',
        path: '/api/person',
        // checks if the body has array of objects with id, name & address
        body: eachLike({
          // checks if id matches with regular expression
          id: term({ generate: 123, matcher: /\d+/ }),
          name: 'Bark',
          address: like({
            // checks if city is string
            city: 'some',
            // checks if pin is number
            pin: 123 
          })
        })
      },
      willRespondWith: {
        status: 200
      }
    })
    .post('http://localhost:9393/api/person')
    .withBody([{
      id: 100,
      name: 'Dark',
      address: {
        city: 'another',
        pin: 5000
      }
    }])
    .expectStatus(200);
});
```

## Response Matching

*You want to be as loose as possible with the matching for the response though. This stops the tests being brittle on the provider side. Generally speaking, it doesn't matter what value the provider actually returns during verification, as long as the types match. When you need certain formats in the values (eg. URLS), you can use regex. Really really consider before you start introducing too many matchers however - for example, yes, the provider might be currently returning a GUID, but would anything in your consumer really break if they returned a different format of string ID? (If it did, that's a nasty code smell!) Note that during provider verification, following Postel's Law of being "relaxed" with what we accept, "unexpected" values in JSON response bodies are ignored. This is expected and is perfectly OK. Another consumer may have an expectation about that field.*

> Applicable during *provider verification*

```javascript
const pactum = require('pactum');
const { like, somethingLike, term, regex, eachLike, contains } = pactum.matchers;

it('Matchers - Body', () => {
  return pactum
    .addMockInteraction({
      withRequest: {
        method: 'POST',
        path: '/api/person'
      },
      willRespondWith: {
        status: 200,
        // create a single array of object with id, name & address
        body: eachLike({
          // creates a id with 123
          id: term({ generate: 123, matcher: /\d+/ }),
          name: 'Bark',
          address: like({
            // creates a city with 'hyd'
            city: 'hyd',
            // creates a pin with '500081'
            pin: 500081 
          })
        })
      }
    })
    .get('http://localhost:9393/api/person')
    .expectStatus(200)
    .expectJson([{
      id: 123,
      name: 'Bark',
      address: {
        cit: 'hyd',
        pin: 500081
      }
    }]);
});
```

----------------------------------------------------------------------------------------------------------------