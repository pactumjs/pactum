# pactum

![Build](https://github.com/ASaiAnudeep/pactum/workflows/Build/badge.svg?branch=master)
![Coverage](https://img.shields.io/codeclimate/coverage/ASaiAnudeep/pactum)

**pactum** is a REST API Testing Tool that combines the implementation of consumer driven contract library [Pact](https://docs.pact.io) for JavaScript.

## Documentation

* [Pactum](https://github.com/ASaiAnudeep/pactum/wiki)
* [Component Testing](https://github.com/ASaiAnudeep/pactum/wiki/Component-Testing)
* [Contract Testing](https://github.com/ASaiAnudeep/pactum/wiki/Contract-Testing)
  * [Consumer Testing](https://github.com/ASaiAnudeep/pactum/wiki/Consumer-Testing)
  * [Provider Verification](https://github.com/ASaiAnudeep/pactum/wiki/Provider-Verification)
* [Interactions](https://github.com/ASaiAnudeep/pactum/wiki/Interactions)
* [Mock Server](https://github.com/ASaiAnudeep/pactum/wiki/Mock-Server)

## Installation

```shell
npm install --save-dev pactum
```

## Usage

### Component Testing

Running a single component test expectation.

```javascript
const pactum = require('pactum');

it('should be a teapot', async () => {
  await pactum
    .get('http://httpbin.org/status/418')
    .expectStatus(418)
    .toss();
});
```

```shell
# mocha is a test framework
mocha /path/to/test
```

Learn more about pactum as a component tester [here](https://github.com/ASaiAnudeep/pactum/wiki/Component-Testing)

### Contract Testing

Running a contract test with the help of a mock server & a single pact interaction. 
If the pact interaction is not exercised, the test will fail.

```javascript
const pactum = require('pactum');

before(async () => {
  await pactum.mock.start();
});

it('GET - one interaction', async () => {
  await pactum
    .addPactInteraction({
      provider: 'projects-service',
      state: 'when there is a project with id 1',
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
    })
    .get('http://localhost:9393/api/projects/1')
    .expectStatus(200)
    .expectJsonLike({
      id: 1,
      name: 'fake'
    })
    .toss();
});

after(async () => {
  await pactum.mock.stop();
});
```
Learn more about pactum as a contract tester [here](https://github.com/ASaiAnudeep/pactum/wiki/Contract-Testing)

### Mock Server

Running **pactum** as a standalone mock server.

```javascript
const pactum = require('pactum');
pactum.mock.setDefaultPort(3000);
pactum.mock.start();
```

Learn more about pactum as a mock server [here](https://github.com/ASaiAnudeep/pactum/wiki/Mock-Server)

----------------------------------------------------------------------------------------------------------------

<a href="https://github.com/ASaiAnudeep/pactum/wiki/Component-Testing" >
  <img src="https://img.shields.io/badge/NEXT-Component%20Testing-blue" alt="Component Testing" align="right" style="display: inline;" />
</a>
