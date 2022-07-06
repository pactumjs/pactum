const pactum = require('../../src/index');

describe('Interactions - File', () => {

  it('download file with default headers', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/download'
        },
        response: {
          status: 200,
          file: 'assets/logo.png'
        }
      })
      .get('http://localhost:9393/download')
      .expectStatus(200)
      .expectBodyContains('PNG')
      .expectHeader('content-type', 'image/png');
  });

  it('download file with custom headers', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/download'
        },
        response: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          file: 'assets/logo.png'
        }
      })
      .get('http://localhost:9393/download')
      .expectStatus(200)
      .expectBodyContains('PNG')
      .expectHeader('content-type', 'application/json');
  });

});