const pactum = require('../../src/index');
const expect = require('chai').expect;

describe('Cookies', () => {

  it('sending cookies as key-value pair', async () => {
    await pactum
      .spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/army',
          headers: {
            cookie: 'name=snow'
          }
        },
        response: {
          status: 200,
          headers: {
            'set-cookie': 'name=snow',
          },
          body: {
            Name: 'Golden Army',
            Count: 10000,
            Alliance: 'Stark',
          },
        },
      })
      .get('http://localhost:9393/api/army')
      .withCookies('name', 'snow')
      .expectStatus(200)
      .expectCookiesLike('name', 'snow');
  });

  it('sending cookies as string', async () => {
    await pactum
      .spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/army',
          headers: {
            cookie: 'name=snow'
          }
        },
        response: {
          status: 200,
          headers: {
            'set-cookie': 'name=snow',
          },
          body: {
            Name: 'Golden Army',
            Count: 10000,
            Alliance: 'Stark',
          },
        },
      })
      .get('http://localhost:9393/api/army')
      .withCookies('name=snow')
      .expectStatus(200)
      .expectCookies('name=snow');
  });

  it('sending cookies as object', async () => {
    await pactum
      .spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/army',
          headers: {
            cookie: 'name=snow'
          }
        },
        response: {
          status: 200,
          headers: {
            'set-cookie': 'name=snow',
          },
          body: {
            Name: 'Golden Army',
            Count: 10000,
            Alliance: 'Stark',
          },
        },
      })
      .get('http://localhost:9393/api/army')
      .withCookies({ name: 'snow' })
      .expectStatus(200)
      .expectCookies({ name: 'snow' });
  });

  it('sending multiple cookies & assert multiple cookies', async () => {
    await pactum
      .spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/army',
          headers: {
            cookie: 'name=snow;httpOnly;foo=bar;bro'
          }
        },
        response: {
          status: 200,
          headers: {
            'set-cookie': 'name=snow;httpOnly;foo=bar',
          },
          body: {
            Name: 'Golden Army',
            Count: 10000,
            Alliance: 'Stark',
          },
        },
      })
      .get('http://localhost:9393/api/army')
      .withCookies({ name: 'snow', httpOnly: null })
      .withCookies('foo', 'bar')
      .withCookies('bro')
      .expectStatus(200)
      .expectCookiesLike('name', 'snow')
      .expectCookiesLike('httpOnly')
      .expectCookiesLike('foo', 'bar')
      .expectCookies('foo=bar;name=snow;httpOnly');
  });

  it('set-cookie key not found in response - expectCookie', async () => {
    let err;
    try {
      await pactum
        .spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/api/army'
          },
          response: {
            status: 200
          },
        })
        .get('http://localhost:9393/api/army')
        .expectStatus(200)
        .expectCookiesLike('name', 'snow');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`'set-cookie' key not found in response headers`);
  });

  it('set-cookie key not found in response - expectCookies', async () => {
    let err;
    try {
      await pactum
        .spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/api/army'
          },
          response: {
            status: 200
          },
        })
        .get('http://localhost:9393/api/army')
        .expectStatus(200)
        .expectCookies('name', 'snow');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`'set-cookie' key not found in response headers`);
  });

  it('expected cookie not found in response - expectCookie', async () => {
    let err;
    try {
      await pactum
        .spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/api/army'
          },
          response: {
            status: 200,
            headers: {
              'set-cookie': 'httpOnly'
            }
          },
        })
        .get('http://localhost:9393/api/army')
        .expectStatus(200)
        .expectCookiesLike('name', 'snow');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Cookie doesn't have property 'name' at '$'`);
  });

  it('expected cookie not found in response - expectCookies', async () => {
    let err;
    try {
      await pactum
        .spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/api/army'
          },
          response: {
            status: 200,
            headers: {
              'set-cookie': 'httpOnly;name=snow'
            }
          },
        })
        .get('http://localhost:9393/api/army')
        .expectStatus(200)
        .expectCookies('name', 'snow');
    } catch (error) {
      err = error;
    }
    expect(err.message).not.undefined;
  });

});
