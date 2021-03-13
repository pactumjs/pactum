const pactum = require('../../src/index');
const request = pactum.request;
const config = require('../../src/config');

describe('Request', () => {

  it('with baseurl', async () => {
    request.setBaseUrl('http://localhost:9393');
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/users'
        },
        response: {
          status: 200
        }
      })
      .get('/users')
      .expectStatus(200)
      .inspect();
  });

  it('with baseurl override', async () => {
    request.setBaseUrl('http://localhost:9392');
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/users'
        },
        response: {
          status: 200
        }
      })
      .get('http://localhost:9393/users')
      .expectStatus(200);
  });

  it('with default header', async () => {
    request.setBaseUrl('http://localhost:9393');
    request.setDefaultHeaders('x', 'a');
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/users',
          headers: {
            'x': 'a'
          }
        },
        response: {
          status: 200
        }
      })
      .get('http://localhost:9393/users')
      .expectStatus(200);
  });

  it('with override default header to empty value', async () => {
    request.setBaseUrl('http://localhost:9393');
    request.setDefaultHeaders('x', 'a');
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/users',
          headers: {
            'x': ''
          }
        },
        response: {
          status: 200
        }
      })
      .get('http://localhost:9393/users')
      .withHeaders('x', '')
      .expectStatus(200);
  });

  it('with override default header', async () => {
    request.setBaseUrl('http://localhost:9393');
    request.setDefaultHeaders('x', 'a');
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/users',
          headers: {
            'x': 'b'
          }
        },
        response: {
          status: 200
        }
      })
      .get('http://localhost:9393/users')
      .withHeaders('x', 'b')
      .expectStatus(200);
  });

  it('with file - just path', async () => {
    await pactum.spec()
      .useInteraction({
        strict: false,
        request: {
          method: 'POST',
          path: '/api/file'
        },
        response: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/file')
      .withFile('./package.json')
      .expectStatus(200);
  });

  it('with file - path & options', async () => {
    await pactum.spec()
      .useInteraction({
        strict: false,
        request: {
          method: 'POST',
          path: '/api/file'
        },
        response: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/file')
      .withFile('./package.json', { contentType: 'application/json' })
      .expectStatus(200);
  });

  it('with file - key & path', async () => {
    await pactum.spec()
      .useInteraction({
        strict: false,
        request: {
          method: 'POST',
          path: '/api/file'
        },
        response: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/file')
      .withFile('file-2', './package.json')
      .expectStatus(200);
  });

  it('with file - key, path & options', async () => {
    await pactum.spec()
      .useInteraction({
        strict: false,
        request: {
          method: 'POST',
          path: '/api/file'
        },
        response: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/file')
      .withFile('file-2', './package.json', { contentType: 'application/json' })
      .expectStatus(200);
  });

  afterEach(() => {
    config.request.baseUrl = '';
    config.request.headers = {};
  });

});