const pactum = require('../../src/index');

before(async () => {
  pactum.consumer.setConsumerName('consumer');
  await pactum.mock.start();
});

after(async () => {
  await pactum.mock.stop();
  pactum.consumer.save();
});