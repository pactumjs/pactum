# Mock Server

Pactum can also act as a standalone mock server.
Mock interactions & pact interactions can be used to train the mock server to react in a particular way when a particular request is received.

## Table of contents

* [Getting Started](#getting-started)
* [API](#api)
* [Examples](#examples)
* [Remote API](#remote-api)
  * [Mock Interactions](#mock-interactions)
  * [Pact Interactions](#pact-interactions)

## Getting Started

#### Setup

The below code will run the pactum server on port 3000

```javascript
const pactum = require('pactum');
pactum.mock.setDefaultPort(3000);
pactum.mock.start();
```

## API

### pactum.mock

#### setDefaultPort
Type: `Function`<br>

Sets the port of the mock server to start. The default port of the server is `9393`.
This function should be called before starting the server.

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

#### addDefaultMockInteraction
Type: `Function`<br>
Returns: `string` - interaction id

Adds a mock interaction to the server.

```javascript
pactum.mock.addDefaultMockInteraction({
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

#### addDefaultMockInteractions
Type: `Function`<br>
Returns: `string[]` - interaction id's

Adds multiple mock interactions to the server.

```javascript
pactum.mock.addDefaultMockInteractions([
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

Adds multiple pact interaction to the server.

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

pactum.mock.addDefaultMockInteraction({
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

Pactum allows to add or remove interactions dynamically through REST API.
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

Adds multiple mock interaction to the server.

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

Removes a mock interaction or all mock interactions from mock server.

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

Removes a pact interaction or all pact interactions from mock server.

```Shell
# Removes a single pact interaction with id m1uh9
curl --location --request DELETE 'http://localhost:9393/api/pactum/pactInteraction?id=m1uh9'

# Removes all pact interactions
curl --location --request DELETE 'http://localhost:9393/api/pactum/pactInteraction'
```
