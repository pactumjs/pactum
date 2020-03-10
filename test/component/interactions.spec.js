const pactum = require('../../src/index');
const { like, term, eachLike } = pactum.matchers;


describe('Mock', () => {

  it('GET - one interaction', async () => {
    await pactum
      .addMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/projects/1'
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            id: 1,
            name: 'fake'
          }
        }
      })
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .expectJsonSchema({
        "properties": {
          "id": {
            "type": "number"
          },
          "name": {
            "type": "string"
          }
        },
        "required": ["name", "id"]
      })
      .expectJsonQuery('id', 1)
      .expectResponseTime(100)
      .toss();
  });

  it('GET - one interaction - without body', async () => {
    await pactum
      .addMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/projects/1'
        },
        willRespondWith: {
          status: 204,
          headers: {
            'content-type': 'application/json'
          }
        }
      })
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(204)
      .expectResponseTime(100)
      .toss();
  });

  it('GET - one interaction - bad response', async () => {
    await pactum
      .addMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/projects/1'
        },
        willRespondWith: {
          status: 400,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            message: 'invalid request'
          }
        }
      })
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(400)
      .expectJsonLike({
        message: 'invalid request'
      })
      .expectResponseTime(100)
      .toss();
  });

  it('GET - one interaction - with one query', async () => {
    await pactum
      .addMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/projects/1',
          query: {
            name: 'fake'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            id: 1,
            name: 'fake'
          }
        }
      })
      .get('http://localhost:9393/api/projects/1')
      .withQuery('name', 'fake')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  it('GET - one interaction - with multiple queries', async () => {
    await pactum
      .addMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/projects/1',
          query: {
            id: 1,
            name: 'fake'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            id: 1,
            name: 'fake'
          }
        }
      })
      .get('http://localhost:9393/api/projects/1')
      .withQuery('id', 1)
      .withQuery('name', 'fake')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  it('GET - one interaction - with query params', async () => {
    await pactum
      .addMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/projects/1',
          query: {
            id: 1,
            name: 'fake'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            id: 1,
            name: 'fake'
          }
        }
      })
      .get('http://localhost:9393/api/projects/1')
      .withQueryParams({
        'id': 1,
        'name': 'fake'
      })
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  it('GET - one interaction - with headers', async () => {
    await pactum
      .addMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/projects/1',
          headers: {
            'content-type': 'application/json'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            id: 1,
            name: 'fake'
          }
        }
      })
      .get('http://localhost:9393/api/projects/1')
      .withHeaders({
        'content-type': 'application/json'
      })
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  it('POST - one interaction', async () => {
    await pactum
      .addMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/api/projects'
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            message: 'ok'
          }
        }
      })
      .post('http://localhost:9393/api/projects')
      .expectStatus(200)
      .expectJson({
        message: 'ok'
      })
      .toss();
  });

  it('POST - one interaction - with body', async () => {
    await pactum
      .addMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/api/projects',
          body: {
            id: 1,
            title: 'new fake'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            message: 'ok'
          }
        }
      })
      .post('http://localhost:9393/api/projects')
      .withJson({
        id: 1,
        title: 'new fake'
      })
      .expectStatus(200)
      .expectJson({
        message: 'ok'
      })
      .toss();
  });

  it('POST - one interaction - with ignore body', async () => {
    await pactum
      .addMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/api/projects',
          ignoreBody: true
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            message: 'ok'
          }
        }
      })
      .post('http://localhost:9393/api/projects')
      .withJson({
        id: 1,
        title: 'new fake'
      })
      .expectStatus(200)
      .expectJson({
        message: 'ok'
      })
      .toss();
  });

  it('POST - one interaction - with form data', async () => {
    await pactum
      .addMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/api/projects',
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          ignoreBody: true
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            message: 'ok'
          }
        }
      })
      .post('http://localhost:9393/api/projects')
      .withForm({ 'user': 'drake' })
      .expectStatus(200)
      .expectJson({
        message: 'ok'
      })
      .toss();
  });

  it('POST - one interaction - with multi part form data', async () => {
    const fs = require('fs');
    const path = require('path');
    await pactum
      .addMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/api/projects',
          ignoreBody: true
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            message: 'ok'
          }
        }
      })
      .post('http://localhost:9393/api/projects')
      .withMultiPartFormData('file', fs.readFileSync(path.resolve('./test/component/base.spec.js')), { contentType: 'application/js', filename: 'interactions.spec.js' })
      .expectStatus(200)
      .expectJson({
        message: 'ok'
      })
      .toss();
  });

  it('POST - one interaction - with multi part form data instance', async () => {
    const fs = require('fs');
    const path = require('path');
    const form = new pactum.request.FormData();
    form.append('file', fs.readFileSync(path.resolve('./test/component/base.spec.js')), { contentType: 'application/js', filename: 'interactions.spec.js' });
    await pactum
      .addMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/api/projects',
          ignoreBody: true
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            message: 'ok'
          }
        }
      })
      .post('http://localhost:9393/api/projects')
      .withMultiPartFormData(form)
      .expectStatus(200)
      .expectJson({
        message: 'ok'
      })
      .toss();
  });

  it('GET - invalid interaction', async () => {
    await pactum
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(404)
      .expectBody('Interaction Not Found')
      .expectBodyContains('Not Found')
      .expectResponseTime(100)
      .toss();
  });

  it('PUT - invalid interaction', () => {
    return pactum
      .put('http://localhost:9393/api/projects/1')
      .withBody("Hello")
      .expectStatus(404)
      .expectBody('Interaction Not Found')
      .expectHeader('connection', 'close')
      .expectHeaderContains('connection', 'close')
      .expectResponseTime(100);
  });

  it('PATCH - invalid interaction', async () => {
    await pactum
      .patch('http://localhost:9393/api/projects/1')
      .expectStatus(404)
      .expectBody('Interaction Not Found')
      .expectResponseTime(100)
      .toss();
  });

  it('HEAD - invalid interaction', async () => {
    await pactum
      .head('http://localhost:9393/api/projects/1')
      .expectStatus(404)
      .expectResponseTime(100)
      .toss();
  });

});

describe('Pact - matchers', () => {

  it('GET - one interaction', async () => {
    await pactum
      .addMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/projects/1'
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            id: like(1),
            name: like('fake'),
            gender: term({ matcher: /F|M/, generate: 'M' }),
            married: like(true),
            favorite: {
              books: eachLike('Harry Porter')
            },
            addresses: eachLike({ street: like('Road No. 60') })
          }
        }
      })
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake',
        gender: 'M',
        married: true,
        favorite: {
          books: ['Harry Porter']
        },
        addresses: [
          {
            street: 'Road No. 60'
          }
        ]
      })
      .toss();
  });

  it('GET - one interaction - array body', async () => {
    await pactum
      .addMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/projects'
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: eachLike({
            id: 1,
            items: eachLike({
              name: 'burger',
              quantity: 2,
              value: 100,
            }),
          })
        }
      })
      .get('http://localhost:9393/api/projects')
      .expectStatus(200)
      .expectJsonLike([{
        id: 1,
        items: [{
          name: 'burger',
          quantity: 2,
          value: 100
        }]
      }])
      .toss();
  });

});

describe('Pact - VALID', () => {

  it('GET - one interaction', async () => {
    await pactum
      .addPactInteraction({
        provider: 'test-provider',
        state: 'when there is a project with id 1',
        uponReceiving: 'a request for project 1',
        withRequest: {
          method: 'GET',
          path: '/api/projects/1'
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            id: 1,
            name: 'fake'
          }
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

  it('GET - one interaction', async () => {
    await pactum
      .addPactInteraction({
        provider: 'test-provider',
        state: 'when there is a project with id 1',
        uponReceiving: 'a request for project 1',
        withRequest: {
          method: 'GET',
          path: '/api/projects/1'
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            id: like(1),
            name: like('fake'),
            gender: term({ matcher: 'F|M', generate: 'M' }),
            married: like(true),
            favorite: {
              books: eachLike('Harry Porter')
            },
            addresses: eachLike({ street: like('Road No. 60') })
          }
        }
      })
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake',
        gender: 'M',
        married: true,
        favorite: {
          books: ['Harry Porter']
        },
        addresses: [
          {
            street: 'Road No. 60'
          }
        ]
      })
      .toss();
  });

  it('GET - one interaction - array body', async () => {
    await pactum
      .addPactInteraction({
        provider: 'test-provider-2',
        state: 'when there is a project with id 1',
        uponReceiving: 'a request for project 1',
        withRequest: {
          method: 'GET',
          path: '/api/projects'
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: eachLike({
            id: 1,
            items: eachLike({
              name: 'burger',
              quantity: 2,
              value: 100,
            }),
          })
        }
      })
      .get('http://localhost:9393/api/projects')
      .expectStatus(200)
      .expectJsonLike([{
        id: 1,
        items: [{
          name: 'burger',
          quantity: 2,
          value: 100
        }]
      }])
      .toss();
  });

});