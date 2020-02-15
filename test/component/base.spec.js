const pactum = require('../../src/index');

before(async () => {
  pactum.pact.setConsumerName('consumer');
  await pactum.mock.start();
});

after(async () => {
  await pactum.mock.stop();
  pactum.pact.save();
});