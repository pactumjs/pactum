const pactum = require('../../src/index');

describe('Deprecated', () => {

  it('expects', async () => {
    await pactum.spec()
      .useInteraction('get people')
      .get('http://localhost:9393/api/people')
      .expectJsonAt('people[0].name', 'Matt')
      .expectJsonLikeAt('people[0].name', 'Matt')
      .expectJsonMatchAt('people[0].name', 'Matt')
      .expectJsonMatchStrictAt('people[0].name', 'Matt')
      .expectJsonSchemaAt('people[0].name', { type: 'string' });
  });

});
