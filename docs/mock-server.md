# Mock Server

Mock Server allows you to mock any server or service via HTTP or HTTPS, such as a REST endpoint. Simply it is a simulator for HTTP-based APIs.

At one end **pactum** is a REST API testing tool, on the other it can also act as a standalone mock server. It packs with a powerful request & response matching & you can spin it up in a matter of seconds.

## Table of contents

* [Getting Started](#getting-started)
* [API](#api)
* [Examples](#examples)
* [Remote API](#remote-api)
  * [Mock Interactions](#mock-interactions)
  * [Pact Interactions](#pact-interactions)

## Getting Started

#### Setup

The below code will run the pactum mock server on port 3000

```javascript
// server.js
const mock = require('pactum').mock;
mock.start(3000);
```

```shell
# Running Mock Server
node server.js
```

```shell
# Returns OK
curl http://localhost:3000/api/pactum/health
```

## API

### Start Mock Server

Use `start` to start the mock server on default port 9393 or pass port number as a parameter. It returns a promise. *Waiting for the server to start will be useful while running mock server along with your unit or component tests.*

```javascript
// starts mock server on port 9393
await mock.start();
```

```javascript
// starts mock server on port 3000
await mock.start(3000);
```

### Stop Mock Server

Use `stop` to stop the mock server. It returns a promise. *Waiting for the server to stop will be useful while running mock server along with your unit or component tests.*

```javascript
await mock.stop();
```

### Adding Behavior

By now, you know how to start & stop a mock server. To add behavior, we need to add [interactions](https://github.com/ASaiAnudeep/pactum/wiki/Interactions) into it. An interaction contains a message with request & response details. When a request is received, the mock server will look if there is a matching interaction. If found it will return the specified response or 404 will be returned.

We have three kinds of interactions. They are

* Basic Interactions
* Mock Interactions
* Pact Interactions

#### Basic Interactions

Use `addInteraction` to add a basic interaction to the server. It returns a string containing id of the interaction.

```javascript
const mock = require('pactum').mock;

mock.addInteraction({
  get: '/api/users',
  return: 'Hello From Users'
});

mock.start(3000);
```

Run the mock server & open `http://localhost:3000/api/users` in a browser or using cURL. It will return `Hello From Users`. 

```shell
curl http://localhost:3000/api/users
# Returns "Hello From Users"
```

Lets add more interactions to the server to learn more about them.

```javascript
const mock = require('pactum').mock;

mock.addInteraction({
  get: '/api/users/1',
  return: {
    id: 1,
    /* user 1 details */
  }
});

mock.addInteraction({
  get: '/api/users/2',
  status: 401
});

mock.start(3000);
```

Now we have added 2 basic interactions to the server.

* Invoking GET `/api/users/1` will return a JSON with user 1 details.
* Invoking POST `/api/users/1` will return a status code 404.
* Invoking GET `/api/users/2` will return a status code 401.
* Invoking GET `/other` will return a status code 404.

As you see, the mock server will perform an exact match on HTTP method & path to send a response back.

Now you have the basic understanding of how mock server works. Lets add more basic interactions, to learn more about them

```javascript
const mock = require('pactum').mock;

mock.addInteraction({
  get: '/api/users',
  return: []
});

mock.addInteraction({
  post: '/api/users',
  return: 'OK'
});

mock.start(3000);
```

* Invoking GET `/api/users` will return empty array.
* Invoking GET `/api/users?id=1` will still return empty array.
* Invoking GET `/api/users/1` will return a status code 404.
* Invoking POST `/api/users` with empty body will return `'OK'`.
* Invoking POST `/api/users` with some body will still return `'OK'`.

As you see above, by default basic interactions will ignore both query params & body. 

Learn more about basic interactions at [Basic Interactions](https://github.com/ASaiAnudeep/pactum/wiki/Interactions#basic-inteactions)

#### Mock Interactions


#### addMockInteraction
Type: `Function`<br>
Returns: `string` - interaction id

Adds a mock interaction to the server.

```javascript
pactum.mock.addMockInteraction({
  withRequest: {
    method: 'GET',
    path: '/api/projects/1'
  },
  willRespondWith: {
    status: 200,
    headers: {
      'content-type': 'application/json'
    },
    body: {
      id: 1,
      name: 'fake'
    }
  }
});
```

#### addMockInteractions
Type: `Function`<br>
Returns: `string[]` - interaction id's

Adds multiple mock interactions to the server.

```javascript
pactum.mock.addMockInteractions([
  {
    withRequest: {
      method: 'GET',
      path: '/api/projects/1'
    },
    willRespondWith: {
      status: 200,
      headers: {
        'content-type': 'application/json'
      },
      body: {
        id: 1,
        name: 'fake'
      }
    }
  },
  {
    withRequest: {
      method: 'GET',
      path: '/api/orders'
    },
    willRespondWith: {
      status: 200,
      headers: {
        'content-type': 'application/json'
      },
      body: [
        {
          item: 'box'
        },
        {
          item: 'door'
        }
      ]
    }
  }
]);
```


#### addDefaultPactInteraction
Type: `Function`<br>
Returns: `string` - interaction id

Adds a pact interaction to the server.

```javascript
pactum.mock.addDefaultPactInteraction({
  provider: 'project-service',
  state: 'there is a project with id 1',
  uponReceiving: 'a request for project 1',
  withRequest: {
    method: 'GET',
    path: '/api/projects/1'
  },
  willRespondWith: {
    status: 200,
    headers: {
      'content-type': 'application/json'
    },
    body: {
      id: 1,
      name: 'fake'
    }
  }
});
```

#### addDefaultPactInteractions
Type: `Function`<br>
Returns: `string[]` - interaction id's

Adds multiple pact interactions to the server.

```javascript
pactum.mock.addDefaultPactInteractions([
  {
    provider: 'project-service',
    state: 'there is a project with id 1',
    uponReceiving: 'a request for project 1',
    withRequest: {
      method: 'GET',
      path: '/api/projects/1'
    },
    willRespondWith: {
      status: 200,
      headers: {
        'content-type': 'application/json'
      },
      body: {
        id: 1,
        name: 'fake'
      }
    }
  },
  {
    provider: 'order-service',
    state: 'there are orders',
    uponReceiving: 'a request for orders',
    withRequest: {
      method: 'GET',
      path: '/api/orders'
    },
    willRespondWith: {
      status: 200,
      headers: {
        'content-type': 'application/json'
      },
      body: [
        {
          item: 'box'
        },
        {
          item: 'door'
        }
      ]
    }
  }
]);
```

#### removeDefaultInteraction
Type: `Function`<br>

Removes an interaction from the mock server.

```javascript
pactum.mock.removeDefaultInteraction('interactionId');
```

#### clearDefaultInteractions
Type: `Function`<br>

Clears all default interactions

```javascript
pactum.mock.clearDefaultInteractions();
```

## Examples

```javascript
const pactum = require('pactum');

pactum.mock.setDefaultPort(3000);

pactum.mock.addMockInteraction({
  withRequest: {
    method: 'GET',
    path: '/api/projects/1'
  },
  willRespondWith: {
    status: 200,
    headers: {
      'content-type': 'application/json'
    },
    body: {
      id: 1,
      name: 'fake'
    }
  }
});

pactum.mock.addDefaultPactInteraction({
  provider: 'order-service',
  state: 'there is a order with id 1',
  uponReceiving: 'a request for order 1',
  withRequest: {
    method: 'GET',
    path: '/api/orders/1'
  },
  willRespondWith: {
    status: 200,
    headers: {
      'content-type': 'application/json'
    },
    body: {
      id: 1,
      name: 'fake'
    }
  }
});

pactum.mock.start();
```

## Remote API

Pactum allows us to add or remove interactions dynamically through the REST API.
Once the server is started, interact with the following API to control the mock server.

### Mock Interactions

#### /api/pactum/mockInteraction

##### GET

Returns a single or all mock interactions.

```Shell
# Fetches a mock interaction with id "m1uh9"
curl --location --request GET 'http://localhost:9393/api/pactum/mockInteraction?id=m1uh9'

# Fetches all mock interactions
curl --location --request GET 'http://localhost:9393/api/pactum/mockInteraction'
```

Response - returns all the mock interactions

```JSON
[
  {
    "withRequest": {
      "method": "GET",
      "path": "/api/projects/2",
      "query": {
        "name": "fake"
      }
    },
    "willRespondWith": {
      "status": 200,
      "headers": {
        "content-type": "application/json"
      },
      "body": {
        "id": 1,
        "name": "fake"
      }
    }
  }
]
```

##### POST

Adds multiple mock interactions to the server.

```Shell
curl --location --request POST 'http://localhost:9393/api/pactum/mockInteraction' \
--header 'Content-Type: application/json' \
--data-raw '[{
    "withRequest": {
        "method": "GET",
        "path": "/api/projects/2",
        "query": {
            "name": "fake"
        }
    },
    "willRespondWith": {
        "status": 200,
        "headers": {
            "content-type": "application/json"
        },
        "body": {
            "id": 1,
            "name": "fake"
        }
    }
  }]'
```

Response - returns the mock interaction id.

```JSON
[ "x121w" ] 
```

##### DELETE

Removes a mock interaction or all mock interactions from the mock server.

```Shell
# Removes a single mock interaction with id m1uh9
curl --location --request DELETE 'http://localhost:9393/api/pactum/mockInteraction?id=m1uh9'

# Removes all mock interactions
curl --location --request DELETE 'http://localhost:9393/api/pactum/mockInteraction'
```

### Pact Interactions

#### /api/pactum/pactInteraction

##### GET

Returns a single or all pact interactions.

```Shell
# Fetches a pact interaction with id "m1uh9"
curl --location --request GET 'http://localhost:9393/api/pactum/pactInteraction?id=m1uh9'

# Fetches all pact interactions
curl --location --request GET 'http://localhost:9393/api/pactum/pactInteraction'
```

Response - returns all the pact interactions

```JSON
[
  {
    "consumer": "consumer-name",
    "provider": "provider-name",
    "state": "provider state",
    "uponReceiving": "description",
    "withRequest": {
      "method": "GET",
      "path": "/api/projects/2",
      "query": {
        "name": "fake"
      }
    },
    "willRespondWith": {
      "status": 200,
      "headers": {
        "content-type": "application/json"
      },
      "body": {
        "id": 1,
        "name": "fake"
      }
    }
  }
]
```

##### POST

Adds multiple pact interactions to the server.

```Shell
curl --location --request POST 'http://localhost:9393/api/pactum/pactInteraction' \
--header 'Content-Type: application/json' \
--data-raw '[{
    "consumer": "consumer-name",
    "provider": "provider-name",
    "state": "provider state",
    "uponReceiving": "description",
    "withRequest": {
        "method": "GET",
        "path": "/api/projects/2",
        "query": {
            "name": "fake"
        }
    },
    "willRespondWith": {
        "status": 200,
        "headers": {
            "content-type": "application/json"
        },
        "body": {
            "id": 1,
            "name": "fake"
        }
    }
  }]'
```

Response - returns the pact interaction id.

```JSON
[ "x121w" ]
```

##### DELETE

Removes a pact interaction or all pact interactions from the mock server.

```Shell
# Removes a single pact interaction with id m1uh9
curl --location --request DELETE 'http://localhost:9393/api/pactum/pactInteraction?id=m1uh9'

# Removes all pact interactions
curl --location --request DELETE 'http://localhost:9393/api/pactum/pactInteraction'
```
