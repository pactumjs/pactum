const pactum = require('../../src/index');

describe('withQueryParams', () => {

  describe('should process', () => {
    
    it('without value', async () => {
      await pactum.spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/api/query',
            queryParams: {
              refresh: ''
            }
          },
          response: {
            status: 200
          }
        })
        .get('http://localhost:9393/api/query')
        .withQueryParams('refresh')
        .expectStatus(200);
    });

    it('with multiple query params without values', async () => {
      await pactum.spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/api/query',
            queryParams: {
              refresh: '',
              id: ''
            }
          },
          response: {
            status: 200
          }
        })
        .get('http://localhost:9393/api/query')
        .withQueryParams('refresh')
        .withQueryParams('id')
        .expectStatus(200);
    });

    it('with multiple query params where one without value', async () => {
      await pactum.spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/api/query',
            queryParams: {
              refresh: '',
              id: '1'
            }
          },
          response: {
            status: 200
          }
        })
        .get('http://localhost:9393/api/query')
        .withQueryParams('refresh')
        .withQueryParams('id', '1')
        .expectStatus(200);
    });

    it('with duplicate query params', async () => {
      await pactum.spec()
        .useInteraction({
          strict: false,
          request: {
            method: 'GET',
            path: '/api/query'
          },
          response: {
            status: 200
          }
        })
        .get('http://localhost:9393/api/query')
        .withQueryParams('filters', 'name=test')
        .withQueryParams('filters', 'total>10')
        .expectStatus(200);
    });
  
  });
  
});