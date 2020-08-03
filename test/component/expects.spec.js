const pactum = require('../../src/index');
const expect = require('chai').expect;

describe('Expects', () => {

  before(() => {
    const isUser = function (response) {
      const user = response.json;
      expect(user).deep.equals({ id: 1 });
    }
    pactum.handler.addCustomExpectHandler('isUser', isUser);

    const hasAddress = function (response, addressType) {
      const address = response.json;
      expect(address.type).equals(addressType);
    }
    pactum.handler.addCustomExpectHandler('hasAddress', hasAddress);
  });

  it('custom expect handler', async () => {

    await pactum
      .addMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/users/1'
        },
        willRespondWith: {
          status: 200,
          body: {
            id: 1
          }
        }
      })
      .get('http://localhost:9393/api/users/1')
      .expect('isUser')
      .expectStatus(200);
  });

  it('unknown custom expect handler', async () => {
    let err;
    try {
      await pactum
        .get('http://localhost:9393/api/users/1')
        .expect('isAddress');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('Custom Expect Handler Not Found - isAddress');
  });

  it('failed custom expect handler with data', async () => {
    let err;
    try {
      await pactum
        .addMockInteraction({
          withRequest: {
            method: 'GET',
            path: '/api/address/1'
          },
          willRespondWith: {
            status: 200,
            body: {
              type: 'WORK'
            }
          }
        })
        .get('http://localhost:9393/api/address/1')
        .expect('hasAddress', 'HOME');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`expected 'WORK' to equal 'HOME'`);
  });

  it('failed status code', async () => {
    let err;
    try {
      await pactum
        .get('http://localhost:9393/api/users/1')
        .expectStatus(200);
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('HTTP status 404 !== 200');
  });

  it('header key not found', async () => {
    let err;
    try {
      await pactum
        .get('http://localhost:9393/api/users/1')
        .expectHeader('x-header', 'value');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Header 'x-header' not present in HTTP response`);
  });

  it('header value not found', async () => {
    let err;
    try {
      await pactum
        .get('http://localhost:9393/api/users/1')
        .expectHeader('connection', 'value');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Header value 'value' did not match for header 'connection': 'close'`);
  });

  it('header value not found - RegEx', async () => {
    let err;
    try {
      await pactum
        .get('http://localhost:9393/api/users/1')
        .expectHeader('connection', /value/);
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Header regex (/value/) did not match for header 'connection': 'close'`);
  });

  it('header contains key not found', async () => {
    let err;
    try {
      await pactum
        .get('http://localhost:9393/api/users/1')
        .expectHeaderContains('x-header', 'value');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Header 'x-header' not present in HTTP response`);
  });

  it('header contains value not found', async () => {
    let err;
    try {
      await pactum
        .get('http://localhost:9393/api/users/1')
        .expectHeaderContains('connection', 'value');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Header value 'value' did not match for header 'connection': 'close'`);
  });

  it('header contains value not found - RegEx', async () => {
    let err;
    try {
      await pactum
        .get('http://localhost:9393/api/users/1')
        .expectHeaderContains('connection', /value/);
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Header regex (/value/) did not match for header 'connection': 'close'`);
  });

  it('failed body', async () => {
    let err;
    try {
      await pactum
        .get('http://localhost:9393/api/users/1')
        .expectBody('Hello World')
    } catch (error) {
      err = error;
    }
    expect(err.message).contains('Interaction Not Found');
  });

  it('failed body contains', async () => {
    let err;
    try {
      await pactum
        .get('http://localhost:9393/api/users/1')
        .expectBodyContains('Hello World')
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Value 'Hello World' not found in response body`);
  });

  it('failed body contains - RegEx', async () => {
    let err;
    try {
      await pactum
        .get('http://localhost:9393/api/users/1')
        .expectBodyContains(/Hello World/)
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Value '/Hello World/' not found in response body`);
  });

  it('failed json schema', async () => {
    let err;
    try {
      await pactum
        .addMockInteraction({
          withRequest: {
            method: 'GET',
            path: '/api/users/1'
          },
          willRespondWith: {
            status: 200,
            body: {
              id: 1
            }
          }
        })
        .get('http://localhost:9393/api/users/1')
        .expectJsonSchema({
          "required": ["userId", "id"]
        });
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

  it('network error', async () => {
    let err;
    try {
      await pactum
        .get('http://localhost:9394/api/users/1')
        .expectJsonSchema({
          "required": ["userId", "id"]
        });
    } catch (error) {
      err = error;
    }
    expect(err.code).equals('ECONNREFUSED');
  });

});