const pactum = require('../../src/index');
const handler = pactum.handler;

function addDefaultMockHandlers() {
  handler.addMockInteractionHandler('default get', () => {
    return {
      withRequest: {
        method: 'GET',
        path: '/default/get'
      },
      willRespondWith: {
        status: 200,
        body: {
          method: 'GET',
          path: '/default/get'
        }
      }
    }
  });
  handler.addMockInteractionHandler('default post', () => {
    return {
      withRequest: {
        method: 'POST',
        path: '/default/post',
        body: {
          method: 'POST',
          path: '/default/post'
        }
      },
      willRespondWith: {
        status: 200
      }
    }
  });
}

before(async () => {
  pactum.consumer.setConsumerName('consumer');
  addDefaultMockHandlers();
  await pactum.mock.start();
});

after(async () => {
  await pactum.mock.stop();
  pactum.consumer.save();
});