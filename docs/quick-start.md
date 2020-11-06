# Quick Start

To get started we need to have NodeJS (>=8) installed in our system.

## Installation

**pactum** is available as a npm package to download. Add it as a dependency to a new project or existing project.

### New Project

```shell
# create new folder
mkdir pactum-api-testing
cd pactum-api-testing

# initialize npm
npm init -y

# install pactum as a dev dependency
npm install --save-dev pactum
```

### Existing Project

```shell
# move to project folder
cd <existing-project-folder>

# install pactum as a dev dependency
npm install --save-dev pactum
```

## Running Testing

!> **pactum** is not a test runner. It needs to be used alongside with a test runner like **mocha**, **jest**, **jasmine** or **cucumber**.

Install a test runner that supports *promises*.

```shell
# install a test runner
npm install mocha -g
```

Create a JS file & copy the below code

<!-- tabs:start -->

#### ** test.js **

```javascript
const pactum = require('pactum');

it('should be a teapot', async () => {
  await pactum.spec()
    .get('http://httpbin.org/status/418')
    .expectStatus(418);
});
```

<!-- tabs:end -->

Running the test

```shell
# mocha is a test framework to execute test cases
mocha test.js
```

## Mock Server

**pactum** can also be used as a standalone mock server or a service virtualization tool to generate pact files for contract testing.

<!-- tabs:start -->

#### ** server.js **

```js
const mock = require('pactum').mock;
mock.start(3000);
```

<!-- tabs:end -->

Running the mock server

```shell
node server.js
```

Behavior to mock server is added through interactions. Learn more about it at [Mock Server](mock-server.md)

----

<a href="#/pactum" >
  <img src="https://img.shields.io/badge/PREV-Home-orange" alt="Home" align="left" style="display: inline;" />
</a>
<a href="#/test-runners" >
  <img src="https://img.shields.io/badge/NEXT-Test%20Runners-blue" alt="Test Runners" align="right" style="display: inline;" />
</a>
