const pactum = require('../../src/index');
const { like, term } = pactum.matchers;
const { eachLike } = require('../../src/exports/matcher');


describe('Basic Interactions', () => {

  it('GET - string', async () => {
    await pactum
      .addInteraction('/api/projects/1')
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(200);
  });

  it('GET - override status', async () => {
    await pactum
      .addInteraction({
        get: '/api/projects/1',
        status: 202
      })
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(202);
  });

  it('POST - override return', async () => {
    await pactum
      .addInteraction({
        post: '/api/projects',
        return: { id: 1 }
      })
      .post('http://localhost:9393/api/projects')
      .withJson({ name: 'Potter' })
      .expectStatus(200)
      .expectJson({
        id: 1
      });
  });

  it('PUT - with query', async () => {
    await pactum
      .addInteraction({
        put: '/api/projects/1'
      })
      .put('http://localhost:9393/api/projects/1')
      .withQueryParam('skip', true)
      .expectStatus(200);
  });

  it('PATCH', async () => {
    await pactum
      .addInteraction({
        patch: '/api/projects/1'
      })
      .patch('http://localhost:9393/api/projects/1')
      .expectStatus(200);
  });

  it('DELETE', async () => {
    await pactum
      .addInteraction({
        delete: '/api/projects/1'
      })
      .delete('http://localhost:9393/api/projects/1')
      .expectStatus(200);
  });

});

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
      .withQueryParam('name', 'fake')
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
            name: 'fake',
            age: 27
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
      .withQueryParam('id', 1)
      .withQueryParam('name', 'fake')
      .withQueryParams({ 'age': 27 })
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
            'content-type': 'application/json',
            'x-powered-by': 'phin',
            'x-served-by': 'polka'
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
      .withHeader('x-served-by', 'polka')
      .withHeaders({
        'content-type': 'application/json'
      })
      .withHeader('x-powered-by', 'phin')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  it('GET - one interaction - with fixed delay', async () => {
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
          },
          fixedDelay: 10
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
      .toss();
  });

  it('GET - one interaction - with random delay', async () => {
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
          },
          randomDelay: {
            min: 10,
            max: 15
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
      .withQueryParams({ id: '1' })
      .expectStatus(404)
      .expectBody('Interaction Not Found')
      .expectBodyContains('Not Found')
      .expectResponseTime(100)
      .toss();
  });

  it('POST - invalid interaction', async () => {
    await pactum
      .post('http://localhost:9393/api/projects')
      .__setLogLevel('DEBUG')
      .__setRequestTimeout(1000)
      .withJson({
        parent: {
          child: [1, { grand: 3 }]
        }
      })
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

  it('GET - empty on call', async () => {
    await pactum
      .addMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/projects/1'
        },
        willRespondWith: {
          onCall: {}
        }
      })
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(404)
      .expectBody('Response Not Found')
      .toss();
  });

  it('GET - 0th on call', async () => {
    await pactum
      .addMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/projects/1'
        },
        willRespondWith: {
          onCall: {
            0: {
              status: 200
            }
          }
        }
      })
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(200)
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