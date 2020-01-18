const pactum = require('../../src/index');

before(async () => {
  await pactum.mock.start();
});

after(async () => {
  await pactum.mock.stop();
  pactum.pact.save();
});