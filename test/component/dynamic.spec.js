const pactum = require('../../src/index');

describe('Dynamic', () => {

  it('GET - without query', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1'
        },
        response: function (req, res) {
          res.status(200);
          res.send({
            id: 1,
            name: 'fake'
          });
        }
      })
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  it('GET - with query', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1',
          queryParams: {
            id: 1
          }
        },
        response: function (req, res) {
          res.status(200);
          res.send({
            id: 1,
            name: 'fake'
          });
        }
      })
      .get('http://localhost:9393/api/projects/1')
      .withQueryParams('id', '1')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  it('GET - ignore query - first record', async () => {
    await pactum.spec()
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/api/projects'
        },
        response: function (req, res) {
          const response = [
            {
              id: 1,
              name: 'fake'
            },
            {
              id: 2,
              name: 'fake'
            }
          ];
          res.status(200);
          if (req.query.id === '1') {
            res.send(response[0]);
          } else {
            res.send(response[1]);
          }
        }
      })
      .get('http://localhost:9393/api/projects')
      .withQueryParams('id', '1')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  it('GET - ignore query - second record', async () => {
    await pactum.spec()
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/api/projects/1'
        },
        response: function (req, res) {
          const response = [
            {
              id: 1,
              name: 'fake'
            },
            {
              id: 2,
              name: 'bake'
            }
          ];
          res.status(200);
          if (req.query.id === '1') {
            res.send(response[0]);
          } else {
            res.send(response[1]);
          }
        }
      })
      .get('http://localhost:9393/api/projects/1')
      .withQueryParams('id', '2')
      .expectStatus(200)
      .expectJsonLike({
        id: 2,
        name: 'bake'
      })
      .toss();
  });

});