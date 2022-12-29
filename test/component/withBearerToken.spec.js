const pactum = require('../../src/index');

describe('withBearerToken', () => {

  describe('should process', () => {
    
    it('with value', async () => {
      await pactum.spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/api/token',
            headers:{
              Authorization: "Bearer token"
            }
          },
          response: {
            status: 200
          }
        })
        .get('http://localhost:9393/api/token')
        .withBearerToken('token')
        .expectStatus(200);
    });
    
    it('without value', async () => {
      await pactum.spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/api/token',
            headers:{
              Authorization: "Bearer"
            }
          },
          response: {
            status: 200
          }
        })
        .get('http://localhost:9393/api/token')
        .withBearerToken('')
        .expectStatus(200);
    });

    it('with duplicate value', async () => {
      await pactum.spec()
        .useInteraction({
          strict: false,
          request: {
            method: 'GET',
            path: '/api/token',
            headers:{
              Authorization: "Bearer duplicate"
            }
          },
          response: {
            status: 200
          }
        })
        .get('http://localhost:9393/api/token')
        .withBearerToken('token')
        .withBearerToken('duplicate')
        .expectStatus(200);
    });
  
  });
  
});