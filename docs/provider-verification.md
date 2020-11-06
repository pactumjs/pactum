# Provider Verification

Provider verification is the second step in contract testing. Each request in the pact file is replayed against the provider, and the response is compared with the expected response in the pact file. If the two match, then we know the consumer and provider are compatible.

## Table of contents

* [Getting Started](#getting-started)
* [API](#api)

## Getting Started

Pacts from **pact-broker**

```javascript
await pactum.provider.validate({
  pactBrokerUrl: 'http://pact-broker:9393',
  providerBaseUrl: 'http://user-service:3000',
  provider: 'user-service',
  providerVersion: '1.2.3'
});
```

Pacts from **local**

```javascript
await pactum.provider.validate({
  pactFilesOrDirs: [ './path/to/pacts' ],
  providerBaseUrl: 'http://user-service:9393',
  provider: 'user-service'
});
```

Verification with **state handlers** & **custom provider headers**

```javascript
await pactum.provider.validate({
  pactFilesOrDirs: [ './path/to/pacts' ],
  providerBaseUrl: 'http://user-service:9393',
  provider: 'user-service',
  stateHandlers: {
    'there is an order with id 1': async function() {
      // update database with an order with id 1
    },
    'there are no orders': async function() {
      // clean all orders in database
    }
  },
  customProviderHeaders: {
    'authorization': 'Basic =QBaX45BhJ4'
  }
});
```

## API

### pactum.provider

#### validate
Type: `Function`<br>
Returns: `Promise`<br>

| Options                     | Description                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------- |
| `providerBaseUrl`           | running API provider host endpoint                                                    |
| `provider`                  | name of the provider                                                                  |
| `providerVersion`           | provider version, required to publish verification results to a broker                |
| `stateHandlers`             | provider state handlers used to configure the state in the Provider                   |
| `customProviderHeaders`     | Header(s) to add to any requests to the provider service                              |
| `pactFilesOrDirs`           | array of local pact files or directories                                              |
| `pactBrokerUrl`             | URL of the Pact Broker to retrieve pacts from. Required if not using pactFilesOrDirs  |
| `pactBrokerUsername`        | username for Pact Broker basic authentication                                         |
| `pactBrokerPassword`        | password for Pact Broker basic authentication                                         |
| `pactBrokerToken`           | bearer token for Pact Broker authentication                                           |
| `publishVerificationResult` | publish verification result to Broker                                                 |

----------------------------------------------------------------------------------------------------------------

<a href="#/consumer-testing" >
  <img src="https://img.shields.io/badge/PREV-Consumer%20Testing-orange" alt="Consumer Testing" align="left" style="display: inline;" />
</a>
<a href="#/mock-server" >
  <img src="https://img.shields.io/badge/NEXT-Mock%20Server-blue" alt="Mock Server" align="right" style="display: inline;" />
</a>