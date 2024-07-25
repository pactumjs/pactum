const { spec } = require('../../src');
const { pactumEvents, EVENT_TYPES } = require('../../src').events;

describe('events', () => {

  before(() => {
    pactumEvents.on(EVENT_TYPES.BEFORE_REQUEST, (r) => {
      console.log(r);
    });
    pactumEvents.on(EVENT_TYPES.AFTER_RESPONSE, (r) => {
      console.log(r.response.body);
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
});