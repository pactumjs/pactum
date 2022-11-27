const pactum = require('../../src/index');
const expect = require('chai').expect;

describe('withCompression', () => {

  describe('should process', () => {

    it('with encoding as br', async () => {
      await pactum.spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/api/compression',
          },
          response: {
            status: 200,
            headers: {
              'content-encoding': 'br'
            },
            file: 'test/data/files/data.txt.br'
          }
        })
        .get('http://localhost:9393/api/compression')
        .withCompression()
        .expectStatus(200);
    });

  });

  describe('should not process', () => {

    it('without a response body', async () => {
      let err;
      try {
        await pactum.spec()
          .useLogLevel('SILENT')
          .useInteraction({
            request: {
              method: 'GET',
              path: '/api/compression',
            },
            response: {
              status: 200,
              headers: {
                'content-encoding': 'br'
              }
            }
          })
          .get('http://localhost:9393/api/compression')
          .withCompression()

          .expectStatus(200);
      } catch (error) {
        err = error;
      }
      expect(err.message).contains('unexpected end of file');
    });

  });

});