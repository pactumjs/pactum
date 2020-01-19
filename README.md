# pactum

## Introduction
pactum is a REST API Testing Tool that combines the implementation of consumer driven contract library [Pact](https://docs.pact.io) for Javascript.

## Installation

```
npm install pactum --save-dev
```

## Creating Simple Tests

Running a single component test expectation.

```javascript
const pactum = require('pactum');

it('should be a teapot', async () => {
  await pactum
    .get('http://httpbin.org/status/418')
    .expect('status', 418)
    .toss();
});
```

Running a component test with a mock server. If the mock interaction is not exercised, the test will fail.

```javascript
const pactum = require('pactum');

before(async () => {
  await pactum.mock.start();
});

it('GET - one interaction', async () => {
  await pactum
    .addInteraction({
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
    .toss()
});

after(async () => {
  await pactum.mock.stop();
});
```

## API

<details>
  
  <summary>Basics</summary>

  | Method       | Description                                  | Usage                                 |
  | ----------   | -------------------------------------------- | ------------------------------------- |
  | get          | performs a GET request on given resource     | `pactum.get('url')`                   |
  | expectStatus | expects a status code from the resource      | `pactum.get('url').expectStatus(200)` |
  | toss         | executes the test case and returns a promise | `await pactum.get('url').toss()`      |

</details>

<details>
  
  <summary>HTTP Methods</summary>

  | Method     | Usage                 |
  | ---------- | --------------------- |
  | get        | `pactum.get('')`      |
  | post       | `pactum.post('')`     |
  | put        | `pactum.get('')`      |
  | delete     | `pactum.get('')`      |

</details>