const expect = require('chai').expect;
const pactum = require('../../src/index');
const { mock, handler } = pactum;

describe('Fuzz', () => {

  before(() => {
    pactum.settings.setLogLevel('ERROR');
    mock.addInteraction({
      request: {
        method: 'GET',
        path: '/swagger.json'
      },
      response: {
        status: 200,
        body: {
          "swagger": "2.0",
          "basePath": "/v2",
          "paths": {
            "/health": {
              "get": {}
            },
            "/info": {
              "post": {}
            },
            "/version": {
              "put": {
                "parameters": [
                  {
                    "in": "body",
                    "schema": {
                      "$ref": "#/definitions/Version"
                    }
                  }
                ]
              }
            }
          },
          "definitions": {
            "Version": {
              "type": "object",
              "properties": {
                "major": {
                  "type": "string"
                },
                "minor": {
                  "type": "string"
                },
                "patch": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    });
    handler.addInteractionHandler('root invalid path', (ctx) => {
      return {
        strict: false,
        request: {
          method: ctx.data,
          path: '/ROOT/INVALID/PATH'
        },
        response: {
          status: 404
        }
      };
    });
    handler.addInteractionHandler('invalid path', (ctx) => {
      return {
        strict: false,
        request: {
          method: ctx.data.method,
          path: ctx.data.path
        },
        response: {
          status: 404
        }
      };
    });
    handler.addInteractionHandler('invalid method', (ctx) => {
      return {
        request: {
          method: ctx.data.method,
          path: ctx.data.path
        },
        response: {
          status: 405
        }
      };
    });
    mock.addInteraction('root invalid path', 'GET');
    mock.addInteraction('root invalid path', 'POST');
    mock.addInteraction('root invalid path', 'DELETE');
    mock.addInteraction('root invalid path', 'PUT');
    mock.addInteraction('root invalid path', 'PATCH');
    mock.addInteraction('invalid path', { method: 'GET', path: '/v2/health/INVALID/PATH' });
    mock.addInteraction('invalid path', { method: 'POST', path: '/v2/info/INVALID/PATH' });
    mock.addInteraction('invalid path', { method: 'PUT', path: '/v2/version/INVALID/PATH' });
    mock.addInteraction('invalid method', { method: 'POST', path: '/v2/health' });
    mock.addInteraction('invalid method', { method: 'PUT', path: '/v2/health' });
    mock.addInteraction('invalid method', { method: 'PATCH', path: '/v2/health' });
    mock.addInteraction('invalid method', { method: 'DELETE', path: '/v2/health' });
    mock.addInteraction('invalid method', { method: 'GET', path: '/v2/info' });
    mock.addInteraction('invalid method', { method: 'PUT', path: '/v2/info' });
    mock.addInteraction('invalid method', { method: 'PATCH', path: '/v2/info' });
    mock.addInteraction('invalid method', { method: 'DELETE', path: '/v2/info' });
    mock.addInteraction('invalid method', { method: 'GET', path: '/v2/version' });
    mock.addInteraction('invalid method', { method: 'POST', path: '/v2/version' });
    mock.addInteraction('invalid method', { method: 'PATCH', path: '/v2/version' });
    mock.addInteraction('invalid method', { method: 'DELETE', path: '/v2/version' });
    mock.addInteraction({
      strict: false,
      request: {
        method: 'PUT',
        path: '/v2/version'
      },
      response: {
        status: 400
      }
    });
  });

  it('swagger', async () => {
    await pactum.fuzz()
      .onSwagger('http://localhost:9393/swagger.json');
  });

  it('swagger - with batch size & inspect', async () => {
    await pactum.fuzz()
      .onSwagger('http://localhost:9393/swagger.json')
      .withHeaders('x', 'y')
      .withHeaders({'x': 'z'})
      .withBatchSize(5)
      .inspect();
  });

  it('swagger - fail for success status', async () => {
    let err;
    try {
      await pactum.fuzz()
        .useInteraction({
          request: {
            method: 'DELETE',
            path: '/v2/version'
          },
          response: {
            status: 200
          }
        })
        .onSwagger('http://localhost:9393/swagger.json');
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
    expect(err.toString()).includes('Fuzz');
  });

  after(() => {
    pactum.settings.setLogLevel('INFO');
    pactum.mock.clearInteractions();
  });

});