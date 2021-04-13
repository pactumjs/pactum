const pactum = require('../../src/index');
const { request, response } = pactum;
const config = require('../../src/config');
const { expect } = require('chai');

describe('Response', () => {

  it('with default expected response status - string value', async () => {
    request.setBaseUrl('http://localhost:9392');
    try {
      response.setDefaultExpectStatus("100");
      await pactum
        .spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/users'
          },
          response: {
            status: 400
          }
        })
        .get('http://localhost:9393/users')
        .expectStatus(200);
    }
    catch (error) {
      expect(error.message).equals(`Invalid expected response status provided - 100`);
    }
  });

  it('with default expected response status - empty value', async () => {
    request.setBaseUrl('http://localhost:9392');
    try {
      response.setDefaultExpectStatus();
      await pactum
        .spec()
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
    }
    catch (error) {
      expect(error.message).equals(`Invalid expected response status provided - undefined`);
    }
  });

  it('with default expected response status - status code > 599', async () => {
    request.setBaseUrl('http://localhost:9392');
    try {
      response.setDefaultExpectStatus(600);
      await pactum
        .spec()
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
    }
    catch (error) {
      expect(error.message).equals(`Invalid expected response status provided - 600`);
    }
  });

  it('with default expected response status - status code < 100', async () => {
    request.setBaseUrl('http://localhost:9392');
    try {
      response.setDefaultExpectStatus(99);
      await pactum
        .spec()
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
    }
    catch (error) {
      expect(error.message).equals(`Invalid expected response status provided - 99`);
    }
  });

  it('with default expected response status - override value', async () => {
    request.setBaseUrl('http://localhost:9392');
    response.setDefaultExpectStatus(200);
    await pactum
      .spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/users'
        },
        response: {
          status: 400
        }
      })
      .get('http://localhost:9393/users')
      .expectStatus(400);
  });

  it('with default expected response status - valid status', async () => {
    request.setBaseUrl('http://localhost:9392');
    response.setDefaultExpectStatus(200);
    await pactum
      .spec()
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

  it('with default expected response time - string value', async () => {
    request.setBaseUrl('http://localhost:9392');
    try {
      response.setDefaultExpectResponseTime("100");
      await pactum
        .spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/users'
          },
          response: {
            status: 400,
            fixedDelay: 200
          }
        })
        .get('http://localhost:9393/users')
        .expectStatus(200);
    }
    catch (error) {
      expect(error.message).equals(`Invalid expected response time provided - 100`);
    }
  });

  it('with default expected response time - empty value', async () => {
    request.setBaseUrl('http://localhost:9392');
    try {
      response.setDefaultExpectResponseTime();
      await pactum
        .spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/users'
          },
          response: {
            status: 200,
            fixedDelay: 200
          }
        })
        .get('http://localhost:9393/users')
        .expectStatus(200);
    }
    catch (error) {
      expect(error.message).equals(`Invalid expected response time provided - undefined`);
    }
  });

  it('with default expected response time - override value', async () => {
    request.setBaseUrl('http://localhost:9392');
    response.setDefaultExpectResponseTime(100);
    await pactum
      .spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/users'
        },
        response: {
          status: 400,
          fixedDelay: 130
        }
      })
      .get('http://localhost:9393/users')
      .expectStatus(400)
      .expectResponseTime(500);
  });

  it('with default expected response time - valid time', async () => {
    request.setBaseUrl('http://localhost:9392');
    response.setDefaultExpectResponseTime(500);
    await pactum
      .spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/users'
        },
        response: {
          status: 200,
          fixedDelay: 50
        }
      })
      .get('http://localhost:9393/users')
      .expectStatus(200);
  });

  it('with default expected response header - no headers', async () => {
    request.setBaseUrl('http://localhost:9393');
    try {
      response.setDefaultExpectHeaders();
      await pactum
        .spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/users'
          },
          response: {
            status: 200,
            headers: {
              'x': '2'
            }
          }
        })
        .get('http://localhost:9393/users')
        .expectStatus(200);
    }
    catch (error) {
      expect(error.message).equals(`Invalid expected response header key provided - undefined`);
    }
  });

  it('with default expected response header - header not present', async () => {
    request.setBaseUrl('http://localhost:9393');
    response.setDefaultExpectHeaders('x-header', 'value');
    try {
      await pactum
        .spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/users'
          },
          response: {
            status: 200,
            headers: {
              'x': '2'
            }
          }
        })
        .get('http://localhost:9393/users')
        .expectStatus(200);
    }
    catch (error) {
      expect(error.message).equals(`Header 'x-header' not present in HTTP response`);
    }
  });

  it('with default expected response header - override to empty value', async () => {
    request.setBaseUrl('http://localhost:9393');
    response.setDefaultExpectHeaders('x-header', 'value');
    await pactum
      .spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/users'
        },
        response: {
          status: 200,
          headers: {
            'x-header': ''
          }
        }
      })
      .get('http://localhost:9393/users')
      .expectStatus(200)
      .expectHeader('x-header', '');
  });

  it('with default expected response header - override value', async () => {
    request.setBaseUrl('http://localhost:9393');
    response.setDefaultExpectHeaders('x-header', 'a');
    await pactum
      .spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/users'
        },
        response: {
          status: 200,
          headers: {
            'x-header': 'b'
          }
        }
      })
      .get('http://localhost:9393/users')
      .expectHeader('x-header', 'b')
      .expectStatus(200);
  });

  it('with default expected response header - multiple headers', async () => {
    request.setBaseUrl('http://localhost:9393');
    response.setDefaultExpectHeaders({
      'x-header': 'a',
      'x-header2': 'b'
    });
    await pactum
      .spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/users'
        },
        response: {
          status: 200,
          headers: {
            'x-header': 'a',
            'x-header2': 'b'
          }
        }
      })
      .get('http://localhost:9393/users')
      .expectStatus(200);
  });

  it('with default expected response - all valid values', async () => {
    request.setBaseUrl('http://localhost:9392');
    response.setDefaultExpectResponseTime(500);
    response.setDefaultExpectHeaders("x-header", "value");
    response.setDefaultExpectStatus(200)
    await pactum
      .spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/users'
        },
        response: {
          status: 200,
          headers: {
            "x-header": "value"
          },
          fixedDelay: 50
        }
      })
      .get('http://localhost:9393/users')
      .expectStatus(200);
  });

  afterEach(() => {
    config.response.status = null;
    config.response.time = null;
    config.response.headers = {};
  });
});
