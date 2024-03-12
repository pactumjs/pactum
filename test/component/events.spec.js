const { spec } = require('../../src');
const { events, EVENT_TYPES } = require('../../src').events;

describe('events', () => {

  before(() => {
    events.on(EVENT_TYPES.BEFORE_REQUEST, (r) => {
      console.log(r);
    });
    events.on(EVENT_TYPES.AFTER_RESPONSE, (r) => {
      console.log(r.body);
    });
  });

  after(() => {
    events.removeAllListeners();
  });

  it('get', async () => {
    await spec()
      .useInteraction('default get')
      .get('http://localhost:9393/default/get')
      .expectStatus(200);
  });
});