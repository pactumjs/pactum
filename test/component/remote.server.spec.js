const config = require('../../src/config');
const pactum = require('../../src/index');
const { expect } = require('chai');
const mock = pactum.mock;
const handler = pactum.handler;

describe('Remote Server - use with spec', () => {

  before(() => {
    mock.useRemoteServer('http://localhost:9393');
    handler.addMockInteractionHandler('mock remote handler', (ctx) => {
      return {
        withRequest: {
          method: 'GET',
          path: '/remote/mock/handler'
        },
        willRespondWith: {
          status: 200,
          body: ctx.data
        }
      }
    });
    handler.addPactInteractionHandler('pact remote handler', () => {
      return {
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
      }
    });
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

  it('useMockInteraction - handler', async () => {
    await pactum.spec()
      .useMockInteraction('mock remote handler', 'hello remote')
      .get('http://localhost:9393/remote/mock/handler')
      .expectStatus(200)
      .expectBody('hello remote');
    await pactum.spec()
      .useMockInteraction('mock remote handler', 'hello remote')
      .get('http://localhost:9393/remote/mock/handler')
      .expectStatus(200)
      .expectBody('hello remote');
    await pactum.spec()
      .get('http://localhost:9393/remote/mock/handler')
      .expectStatus(404)
  });

  it('useMockInteraction - handler not found', async () => {
    let err;
    try {
      await pactum.spec()
        .useMockInteraction('random mock remote handler', 'hello remote')
        .get('http://localhost:9393/remote/mock/handler')
        .expectStatus(200)
        .expectBody('hello remote');
    } catch (error) {
      err = error;
    }
    expect(err.message).contains(`Mock Interaction Handler Not Found - 'random mock remote handler'`);
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

  it('usePactInteraction - handler', async () => {
    await pactum.spec()
      .usePactInteraction('pact remote handler', 'hello remote')
      .get('http://localhost:9393/remote')
      .expectStatus(200);
    await pactum.spec()
      .get('http://localhost:9393/remote')
      .expectStatus(404)
  });

  after(async () => {
    await mock.clearInteractions();
    config.mock.remote = '';
  });

});

describe('Remote Server - before and after spec', () => {

  before(() => {
    mock.useRemoteServer('http://localhost:9393');
    handler.addMockInteractionHandler('mock remote handler', () => {
      return {
        id: 'id2',
        withRequest: {
          method: 'GET',
          path: '/remote/mock/handler'
        },
        willRespondWith: {
          status: 200
        }
      }
    });
  });

  it('add mock interaction & get', async () => {
    const id = await mock.addMockInteraction({
      id: 'id',
      withRequest: {
        method: 'GET',
        path: '/remote/get'
      },
      willRespondWith: {
        status: 200
      }
    });
    expect(id).equals('id');
    const interaction = await mock.getInteraction('id');
    expect(interaction).deep.equals({
      id: 'id',
      "consumer": "consumer",
      "mock": true,
      withRequest: { method: 'GET', path: '/remote/get', "matchingRules": {} },
      willRespondWith: { status: 200, "matchingRules": {}, "delay": { "type": "NONE", "value": 0 } },
      callCount: 0,
      "calls": [],
      "exercised": false,
      expects: { exercised: true }
    });
  });

  it('add mock interactions & get them', async () => {
    const ids = await mock.addMockInteraction([
      {
        id: 'id1',
        withRequest: {
          method: 'GET',
          path: '/remote/get'
        },
        willRespondWith: {
          status: 200
        }
      },
      {
        id: 'id2',
        withRequest: {
          method: 'GET',
          path: '/remote/get'
        },
        willRespondWith: {
          status: 200
        }
      }
    ]);
    expect(ids).deep.equals(['id1', 'id2']);
    const interactions = await mock.getInteraction(['id1', 'id2']);
    expect(interactions).deep.equals([
      {
        id: 'id1',
        "consumer": "consumer",
        "mock": true,
        withRequest: { method: 'GET', path: '/remote/get', "matchingRules": {} },
        willRespondWith: { status: 200, "matchingRules": {}, "delay": { "type": "NONE", "value": 0 } },
        callCount: 0,
      "calls": [],
        "exercised": false,
        expects: { exercised: true }
      },
      {
        id: 'id2',
        "consumer": "consumer",
        "mock": true,
        withRequest: { method: 'GET', path: '/remote/get', "matchingRules": {} },
        willRespondWith: { status: 200, "matchingRules": {}, "delay": { "type": "NONE", "value": 0 } },
        callCount: 0,
      "calls": [],
        "exercised": false,
        expects: { exercised: true }
      }
    ]);
  });

  it('add mock interactions with a handler & get them', async () => {
    const ids = await mock.addMockInteraction([
      {
        id: 'id1',
        withRequest: {
          method: 'GET',
          path: '/remote/get'
        },
        willRespondWith: {
          status: 200
        }
      },
      'mock remote handler'
    ]);
    expect(ids).deep.equals(['id1', 'id2']);
    const interactions = await mock.getInteraction(['id1', 'id2']);
    expect(interactions).deep.equals([
      {
        id: 'id1',
        "consumer": "consumer",
        "mock": true,
        withRequest: { method: 'GET', path: '/remote/get', "matchingRules": {} },
        willRespondWith: { status: 200, "matchingRules": {}, "delay": { "type": "NONE", "value": 0 } },
        callCount: 0,
      "calls": [],
        "exercised": false,
        expects: { exercised: true }
      },
      {
        id: 'id2',
        "consumer": "consumer",
        "mock": true,
        withRequest: { method: 'GET', path: '/remote/mock/handler', "matchingRules": {} },
        willRespondWith: { status: 200, "matchingRules": {}, "delay": { "type": "NONE", "value": 0 } },
        callCount: 0,
      "calls": [],
        "exercised": false,
        expects: { exercised: true }
      }
    ]);
  });

  after(async () => {
    await mock.clearInteractions();
    config.mock.remote = '';
  });

});