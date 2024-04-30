const { like, eachLike, regex } = require('pactum-matchers');
const pactum = require('../../src/index');
const FormData = require('form-data-lite');
const { expect } = require('chai');

describe('Mock', () => {

  it('GET - one interaction', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1'
        },
        response: {
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
      .expectJsonSchema('id', {
        "type": "number"
      })
      .expectJson('id', 1)
      .toss();
  });

  it('GET - one interaction - without body', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1'
        },
        response: {
          status: 204,
          headers: {
            'content-type': 'application/json'
          }
        }
      })
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(204)
      .toss();
  });

  it('GET - one interaction - bad response', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1'
        },
        response: {
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
      .toss();
  });

  it('GET - one interaction - with one query', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1',
          queryParams: {
            name: 'fake'
          }
        },
        response: {
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
      .withQueryParams('name', 'fake')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  it('GET - one interaction - with multiple queries', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1',
          queryParams: {
            id: 1,
            name: 'fake',
            age: 27
          }
        },
        response: {
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
      .withQueryParams('id', 1)
      .withQueryParams('name', 'fake')
      .withQueryParams({ 'age': 27 })
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  it('GET - one interaction - with query params', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1',
          queryParams: {
            id: 1,
            name: 'fake'
          }
        },
        response: {
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
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1',
          headers: {
            'content-type': 'application/json',
            'x-powered-by': 'phin',
            'x-served-by': 'polka'
          }
        },
        response: {
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
      .withHeaders('x-served-by', 'polka')
      .withHeaders({
        'content-type': 'application/json'
      })
      .withHeaders('x-powered-by', 'phin')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  it('GET - one interaction - with fixed delay', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1'
        },
        response: {
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
      .expectJson('id', 1)
      .toss();
  });

  it('GET - one interaction - with random delay', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1'
        },
        response: {
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
      .expectJson('id', 1)
      .toss();
  });

  it('POST - one interaction', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/projects'
        },
        response: {
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
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/projects',
          body: {
            id: 1,
            title: 'new fake'
          }
        },
        response: {
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

  it('POST - one interaction - with string as body', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/hello',
          body: 'Hello World!'
        },
        response: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/hello')
      .withBody('Hello World!')
      .expectStatus(200);
  });

  it('POST - one interaction - with form data', async () => {
    await pactum.spec()
      .useInteraction({
        strict: false,
        request: {
          method: 'POST',
          path: '/api/projects',
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          }
        },
        response: {
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
    await pactum.spec()
      .useInteraction({
        strict: false,
        request: {
          method: 'POST',
          path: '/api/projects'
        },
        response: {
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
    const form = new FormData();
    form.append('file', fs.readFileSync(path.resolve('./test/component/base.spec.js')), { contentType: 'application/js', filename: 'interactions.spec.js' });
    await pactum.spec()
      .useInteraction({
        strict: false,
        request: {
          method: 'POST',
          path: '/api/projects'
        },
        response: {
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
    await pactum.spec()
      .get('http://localhost:9393/api/invalid/1')
      .withQueryParams({ id: '1' })
      .expectStatus(404)
      .expectBody('Interaction Not Found')
      .expectBodyContains('Not Found')
      .toss();
  });

  it('POST - invalid interaction', async () => {
    await pactum.spec()
      .post('http://localhost:9393/api/projects')
      .useLogLevel('DEBUG')
      .withRequestTimeout(1000)
      .withJson({
        parent: {
          child: [1, { grand: 3 }]
        }
      })
      .expectStatus(404)
      .expectBody('Interaction Not Found')
      .expectBodyContains('Not Found')
      .toss();
  });

  it('PUT - invalid interaction', () => {
    return pactum.spec()
      .put('http://localhost:9393/api/projects/1')
      .withBody("Hello")
      .expectStatus(404)
      .expectBody('Interaction Not Found');
  });

  it('PATCH - invalid interaction', async () => {
    await pactum.spec()
      .patch('http://localhost:9393/api/projects/1')
      .expectStatus(404)
      .expectBody('Interaction Not Found')
      .toss();
  });

  it('HEAD - invalid interaction', async () => {
    await pactum.spec()
      .head('http://localhost:9393/api/projects/1')
      .expectStatus(404)
      .toss();
  });

  it('GET - empty on call', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1'
        },
        response: {
          onCall: {}
        }
      })
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(404)
      .toss();
  });

  it('GET - 0th on call', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1'
        },
        response: {
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

  it('GET - with core options', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/core'
        },
        response: {
          status: 200
        }
      })
      .get('http://localhost:9393')
      .withCore({
        path: '/api/core'
      })
      .expectStatus(200);
  });

  it('GET - with core options & auth', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/core',
          headers: {
            'authorization': 'Basic dXNlcjpwYXNz'
          }
        },
        response: {
          status: 200
        }
      })
      .get('http://localhost:9393')
      .withCore({
        path: '/api/core'
      })
      .withAuth('user', 'pass')
      .expectStatus(200);
  });

  it('GET - with core options & auth - override with auth', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/core',
          headers: {
            'authorization': 'Basic dXNlcjpwYXNz'
          }
        },
        response: {
          status: 200
        }
      })
      .get('http://localhost:9393')
      .withCore({
        path: '/api/core',
        auth: 'user:invalid-pass'
      })
      .withAuth('user', 'pass')
      .expectStatus(200);
  });

  it('GET - with core options & auth - override with core', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/core',
          headers: {
            'authorization': 'Basic dXNlcjpwYXNz'
          }
        },
        response: {
          status: 200
        }
      })
      .get('http://localhost:9393')
      .withAuth('user', 'invalid-pass')
      .withCore({
        path: '/api/core',
        auth: 'user:pass'
      })
      .expectStatus(200);
  });

  it('GET - with core options & auth - override with core invalid auth', async () => {
    try {
      await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/core',
          headers: {
            'authorization': 'Basic dXNlcjpwYXNz'
          }
        },
        response: {
          status: 200
        }
      })
      .get('http://localhost:9393')
      .withAuth('user', 'pass')
      .withCore({
        path: '/api/core',
        auth: 'user:invalid-pass'
      })
    } catch (error) {
      err = error
    }
    expect(err.message).contains('Interaction not exercised: GET - /api/core');
  });

  it('GET - with auth', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/auth',
          headers: {
            'authorization': 'Basic dXNlcjpwYXNz'
          }
        },
        response: {
          status: 200
        }
      })
      .get('http://localhost:9393/api/auth')
      .withAuth('user', 'pass')
      .expectStatus(200);
  });

});

describe('Pact - matchers', () => {

  it('GET - one interaction', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1'
        },
        response: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            id: like(1),
            name: like('fake'),
            gender: regex('M', /F|M/),
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
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects'
        },
        response: {
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
    await pactum.spec()
      .useInteraction({
        provider: 'test-provider',
        state: 'when there is a project with id 1',
        uponReceiving: 'a request for project 1',
        request: {
          method: 'GET',
          path: '/api/projects/1'
        },
        response: {
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
    await pactum.spec()
      .useInteraction({
        provider: 'test-provider',
        state: 'when there is a project with id 1',
        uponReceiving: 'a request for project 1',
        request: {
          method: 'GET',
          path: '/api/projects/1'
        },
        response: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            id: like(1),
            name: like('fake'),
            gender: regex('M', 'F|M'),
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
    await pactum.spec()
      .useInteraction({
        provider: 'test-provider-2',
        state: 'when there is a project with id 1',
        uponReceiving: 'a request for project 1',
        request: {
          method: 'GET',
          path: '/api/projects'
        },
        response: {
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

describe('Interactions - expects skip check', () => {

  it('skip expects - defaults', async () => {
    await pactum.spec()
      .useInteraction([{
        request: {
          method: 'GET',
          path: '/api/projects/{id}',
          pathParams: {
            id: '101'
          }
        },
        response: {
          status: 200,
          body: {
            id: '$S{ProjectId}'
          }
        },
        stores: {
          ProjectId: 'req.pathParams.id'
        },
        expects: {
          disable: true,
          exercised: true,
          callCount: 1
        }
      },
      {
        request: {
          method: 'GET',
          path: '/api/users/{id}',
          pathParams: {
            id: '1'
          }
        },
        response: {
          status: 200,
          body: {
            id: '$S{UserId}'
          }
        },
        stores: {
          UserId: 'req.pathParams.id'
        }
      }])
      .get('http://localhost:9393/api/users/1')
      .expectStatus(200)
      .expectJsonLike({
        id: '1'
      })
      .toss();
  });

  it('skip expects (false) - failure', async () => {
    try {
      await pactum.spec()
        .useInteraction([{
          request: {
            method: 'GET',
            path: '/api/projects/{id}',
            pathParams: {
              id: '101'
            }
          },
          response: {
            status: 200,
            body: {
              id: '$S{ProjectId}'
            }
          },
          stores: {
            ProjectId: 'req.pathParams.id'
          },
          expects: {
            disable: false
          }
        },
        {
          request: {
            method: 'GET',
            path: '/api/users/{id}',
            pathParams: {
              id: '1'
            }
          },
          response: {
            status: 200,
            body: {
              id: '$S{UserId}'
            }
          },
          stores: {
            UserId: 'req.pathParams.id'
          },
          expects: {
            exercised: true,
            callCount: 1
          }
        }])
        .get('http://localhost:9393/api/users/1')
        .expectStatus(200)
        .expectJsonLike({
          id: '1'
        })
    } catch (error) {
      err = error;
    }
    expect(err.message).contains('Interaction not exercised: GET - /api/projects/{id}');
  });
});