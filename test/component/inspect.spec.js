const { spec } = require('../../src/index');

describe('Inspect', () => {

  it('without custom path', async () => {
    await spec()
      .useInteraction('get people')
      .get('http://localhost:9393/api/people')
      .expectStatus(200)
      .inspect();
  });

  it('with custom path', async () => {
    await spec()
      .useInteraction('get people')
      .get('http://localhost:9393/api/people')
      .expectStatus(200)
      .inspect('people');
  });

  it('inspect all and with custom path', async () => {
    await spec()
      .useInteraction('get people')
      .get('http://localhost:9393/api/people')
      .expectStatus(200)
      .inspect()
      .inspect('.');
  });

  it('with multiple custom paths', async () => {
    await spec()
      .useInteraction('get people')
      .get('http://localhost:9393/api/people')
      .expectStatus(200)
      .inspect('people[country=NZ]')
      .inspect('people[country=AU]');
  });

});