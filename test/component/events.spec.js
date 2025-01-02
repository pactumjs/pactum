const { spec } = require('../../src');
const { pactumEvents, EVENT_TYPES } = require('../../src').events;

describe('events', () => {

  before(() => {
    pactumEvents.on(EVENT_TYPES.BEFORE_REQUEST, (r) => {
      console.log('BEFORE_REQUEST');
      console.log(r);
    });
    pactumEvents.on(EVENT_TYPES.AFTER_RESPONSE, (r) => {
      console.log('AFTER_RESPONSE');
      console.log(r.response.body);
    });
    pactumEvents.on(EVENT_TYPES.AFTER_RESPONSE_ERROR, (r) => {
      console.log('AFTER_RESPONSE_ERROR');
      console.log(r.request);
      console.log(r.response.body);
      console.log(r.error);
    });
  });

  after(() => {
    pactumEvents.removeAllListeners();
  });

  it('get', async () => {
    await spec()
      .useInteraction('default get')
      .get('http://localhost:9393/default/get')
      .expectStatus(200);
  });

  it('get error', async () => {
    try {
      await spec()
      .useInteraction('default get')
      .get('http://localhost:9393/default/get')
      .expectStatus(400);
    } catch (error) {

    }

  });
});
