const pactum = require('../../src/index');

describe('Flow', () => {

  it('GET - without query', async () => {
    await pactum.flow('first flow')
      .useMockInteraction('default flow get')
      .get('http://localhost:9393/default/get')
      .expectStatus(200)
      .toss();
  });

});