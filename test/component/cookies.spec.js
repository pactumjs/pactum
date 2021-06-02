const pactum = require('../../src/index');

describe('Cookies', () => {
  //
  it('sending cookies as key,value pair', async () => {
    await pactum
      .spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/army',
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
      .expectCookies('name', 'snow');
  });

  it('sending cookies as string', async () => {
    await pactum
      .spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/army',
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
      .expectStrictCookies('name=snow');
  });

  it('sending cookies as object', async () => {
    await pactum
      .spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/army',
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
      .expectStrictCookies({ name: 'snow' });
  });

  it('expecting strict cookie', async () => {
    await pactum
      .spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/army',
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
      .expectStrictCookies('name', 'snow');
  });

  it('sending muliple cookies', async () => {
    await pactum
      .spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/army',
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
      .expectStatus(200)
      .expectCookies('name', 'snow');
  });
});
