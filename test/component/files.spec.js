const pactum = require('../../src/index');
const { addInteractionHandler } = pactum.handler;

describe('Files', () => {

  before(() => {
    addInteractionHandler('post file', () => {
      return {
        strict: false,
        request: {
          method: 'POST',
          path: '/api/file'
        },
        response: {
          status: 200
        }
      }
    });
  });

  it('withBody', async () => {
    await pactum.spec()
      .useInteraction('post file')
      .post('http://localhost:9393/api/file')
      .withBody({ file: './package.json' })
  });

  it('with file - just path', async () => {
    await pactum.spec()
      .useInteraction('post file')
      .post('http://localhost:9393/api/file')
      .withFile('./package.json')
      .expectStatus(200);
  });

  it('with file - path & options', async () => {
    await pactum.spec()
      .useInteraction('post file')
      .post('http://localhost:9393/api/file')
      .withFile('./package.json', { contentType: 'application/json' })
      .expectStatus(200);
  });

  it('with file - key & path', async () => {
    await pactum.spec()
      .useInteraction('post file')
      .post('http://localhost:9393/api/file')
      .withFile('file-2', './package.json')
      .expectStatus(200);
  });

  it('with file - key, path & options', async () => {
    await pactum.spec()
      .useInteraction('post file')
      .post('http://localhost:9393/api/file')
      .withFile('file-2', './package.json', { contentType: 'application/json' })
      .expectStatus(200);
  });

});