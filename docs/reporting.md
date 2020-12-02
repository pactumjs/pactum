# Reporting

For the tests we run through pactum can also generate reports. By default, pactum comes with zero reporters. We need to manually add & enable required reporters.

## Adding a Reporter

Reporters are available as individual packages. Install the required reporter as your dependency.

```shell
npm install --save-dev pactum-json-reporter
```

We can add *n* number of reporters to the pactum tests. Use `pactum.reporter.add` method to add reporters at the beginning of your execution. Run `pactum.reporter.end` method at the end of your test execution.

!> As pactum is not tightly coupled with any of the test runners, it is required to run the `reporter.end()` function at the end of your test execution to let pactum generate the reports. 

```js
const pjr = require('pactum-json-reporter');
const pactum = require('pactum');
const reporter = pactum.reporter;

// global before block
before(() => {
  reporter.add(pjr);
});

// global after block
after(() => {
  return reporter.end();
});
```

## Available Reporters

* [pactum-json-reporter](https://www.npmjs.com/package/pactum-json-reporter)
* [pactum-swagger-coverage](https://www.npmjs.com/package/pactum-swagger-coverage)
* [pactum-influxdb-reporter](https://www.npmjs.com/package/pactum-influxdb-reporter)

?> More reporters are on the way

## Write a Custom Reporter

A reporter should have the following methods in it.

* `afterSpec` - will be called after each spec
* `afterStep` - will be called after each step in e2e testing
* `afterTest` - will be called after each test in e2e testing
* `end` - will be called at the end. It can return a promise.

See the above reporters source code for usage examples.