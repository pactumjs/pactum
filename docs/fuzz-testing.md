# Fuzz Testing

Fuzz testing is still in experimental phase. At the core, pactum uses [openapi-fuzzer-core](https://github.com/ASaiAnudeep/openapi-fuzzer-core) to generate requests & it partially supports swagger v2 open-api specification.

## Running Fuzz Tests

Running fuzz tests on a swagger endpoint.

```js
await pactum.fuzz()
  .onSwagger('/api/swagger.json');
```

> By default, a batch of 10 requests are sent in parallel.

> It expects every request responds with client error code. *( 400 >= statusCode < 500)*

More Options.

| Method                    | Description                               |
| ------------------------- | ----------------------------------------- |
| `onSwagger`               | swagger json url                          |
| `withBatchSize`           | no. of requests to be sent in parallel    |
| `inspect`                 | prints request & response details         |
| `toss` (optional)         | runs all specs & returns a promise        |