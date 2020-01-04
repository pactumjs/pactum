const pactum = require('../../src/index');


describe('Pact', () => {

  before(async () => {
    await pactum.mock.start();
  });

  it('one interaction', async () => {
    await pactum
      .addInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/projects/1'
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            id: 1,
            name: 'fake'
          }
        }
      })
      .get('http://localhost:3000/api/projects/1')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      }) 
      .toss()
  });

  after(async () => {
    await pactum.mock.stop();
  })

});