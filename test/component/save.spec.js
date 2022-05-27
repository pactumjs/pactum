const { spec } = require('../../src/index');

describe('Save', () => {

  it('save json file', async () => {
    await spec()
      .useInteraction('get people')
      .get('http://localhost:9393/api/people')
      .save('.pactum/users.json')
      .expectStatus(200);
  });

});