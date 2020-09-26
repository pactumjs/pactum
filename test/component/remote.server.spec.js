const config = require('../../src/config');
const pactum = require('../../src/index');
const { expect } = require('chai');
const mock = pactum.mock;

describe('Remote Server', () => {

  before(() => {
    mock.useRemoteServer('http://localhost:9393');
  });

  it('useInteraction', async () => {
    await pactum.spec()
      .useInteraction({ get: '/remote' })
      .get('http://localhost:9393/remote')
      .expectStatus(200);
    await pactum.spec()
      .get('http://localhost:9393/remote')
      .expectStatus(404);
  });

  it('useMockInteraction', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/remote'
        },
        willRespondWith: {
          status: 200
        }
      })
      .get('http://localhost:9393/remote')
      .expectStatus(200);
    await pactum.spec()
      .get('http://localhost:9393/remote')
      .expectStatus(404)
  });

  it('usePactInteraction', async () => {
    await pactum.spec()
      .usePactInteraction({
        provider: 'remote-provider',
        state: 'remote-state',
        uponReceiving: 'remote-desc',
        withRequest: {
          method: 'GET',
          path: '/remote'
        },
        willRespondWith: {
          status: 200
        }
      })
      .get('http://localhost:9393/remote')
      .expectStatus(200);
    await pactum.spec()
      .get('http://localhost:9393/remote')
      .expectStatus(404)
  });

  it('useInteraction - not exercised', async () => {
    let err;
    try {
      await pactum.spec()
        .useInteraction({ get: '/remote' })
        .useInteraction({ get: '/remote1' })
        .get('http://localhost:9393/remote2')
        .expectStatus(200);
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('Interaction not exercised: GET - /remote');
    await pactum.spec()
      .get('http://localhost:9393/remote')
      .expectStatus(404)
    await pactum.spec()
      .get('http://localhost:9393/remote1')
      .expectStatus(404)
  });

  it('useInteraction - empty', async () => {
    let err;
    try {
      await pactum.spec()
        .useInteraction()
        .get('http://localhost:9393/remote')
      .expectStatus(200); 
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('`interaction` is required');
  });

  after(() => {
    config.mock.remote = '';
  });

});