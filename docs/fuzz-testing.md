# Fuzz Testing

Fuzz testing is in still experimental phase.

## Running Fuzz Tests

Running fuzz tests on a swagger endpoint.

```js
await pactum.fuzz()
  .onSwagger('/swagger.json');
```