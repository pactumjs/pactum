const { spec, settings } = require('../../src/index');
const expect = require('chai').expect;

describe('withJson', () => {

  before(() => {
    settings.setDataDirectory('test/data');
  });

  after(() => {
    settings.setDataDirectory('data');
  });

  it('with file in parent folder', async () => {
    await spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/file',
          body: {
            "key": "value-1"
          }
        },
        response: {
          status: 200
        }
      })
      .post('http://localhost:9393/file')
      .withJson('sample-1.json')
      .expectStatus(200);
  });

  it('with file in child folder', async () => {
    await spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/file',
          body: {
            "key": "value-2"
          }
        },
        response: {
          status: 200
        }
      })
      .post('http://localhost:9393/file')
      .withJson('sample-2.json')
      .expectStatus(200);
  });

  it('with invalid file', async () => {
    let err;
    try {
      await spec()
        .post('http://localhost:9393/file')
        .withJson('invalid-file.json')
    } catch(error) {
      err = error;
    }
    expect(err.message).equals(`File Not Found - 'invalid-file.json'`);
  })
  
});