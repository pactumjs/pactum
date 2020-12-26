const config = require('../../src/config');
const pactum = require('../../src/index');
const { expect } = require('chai');
const mock = pactum.mock;
const handler = pactum.handler;

describe('Remote Server - use with spec', () => {

  before(() => {
    mock.useRemoteServer('http://localhost:9393');
    handler.addInteractionHandler('mock remote handler', (ctx) => {
      return {
        request: {
          method: 'GET',
          path: '/remote/mock/handler'
        },
        response: {
          status: 200,
          body: ctx.data
        }
      };
    });
    handler.addInteractionHandler('pact remote handler', () => {
      return {
        request: {
          method: 'GET',
          path: '/remote'
        },
        response: {
          status: 200
        }
      };
    });
  });

  it('useInteraction', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/remote'
        },
        response: {
          status: 200
        }
      })
      .get('http://localhost:9393/remote')
      .expectStatus(200);
    await pactum.spec()
      .get('http://localhost:9393/remote')
      .expectStatus(404);
  });

  it('useInteraction - handler', async () => {
    await pactum.spec()
      .useInteraction('mock remote handler', 'hello remote')
      .get('http://localhost:9393/remote/mock/handler')
      .expectStatus(200)
      .expectBody('hello remote');
    await pactum.spec()
      .useInteraction('mock remote handler', 'hello remote')
      .get('http://localhost:9393/remote/mock/handler')
      .expectStatus(200)
      .expectBody('hello remote');
    await pactum.spec()
      .get('http://localhost:9393/remote/mock/handler')
      .expectStatus(404);
  });

  it('useInteraction - handler not found', async () => {
    let err;
    try {
      await pactum.spec()
        .useInteraction('random mock remote handler', 'hello remote')
        .get('http://localhost:9393/remote/mock/handler')
        .expectStatus(200)
        .expectBody('hello remote');
    } catch (error) {
      err = error;
    }
    expect(err.message).contains(`Interaction Handler Not Found - 'random mock remote handler'`);
  });

  it('useInteraction', async () => {
    await pactum.spec()
      .useInteraction({
        provider: 'remote-provider',
        state: 'remote-state',
        uponReceiving: 'remote-desc',
        request: {
          method: 'GET',
          path: '/remote'
        },
        response: {
          status: 200
        }
      })
      .get('http://localhost:9393/remote')
      .expectStatus(200);
    await pactum.spec()
      .get('http://localhost:9393/remote')
      .expectStatus(404);
  });

  it('useInteraction - handler', async () => {
    await pactum.spec()
      .useInteraction('pact remote handler', 'hello remote')
      .get('http://localhost:9393/remote')
      .expectStatus(200);
    await pactum.spec()
      .get('http://localhost:9393/remote')
      .expectStatus(404);
  });

  after(async () => {
    await mock.clearInteractions();
    config.mock.remote = '';
  });

});

describe('Remote Server - before and after spec', () => {

  before(() => {
    mock.useRemoteServer('http://localhost:9393');
    handler.addInteractionHandler('mock remote handler', () => {
      return {
        id: 'id2',
        request: {
          method: 'GET',
          path: '/remote/mock/handler'
        },
        response: {
          status: 200
        }
      };
    });
  });

  it('add mock interaction & get', async () => {
    const id = await mock.addInteraction({
      id: 'id',
      request: {
        method: 'GET',
        path: '/remote/get'
      },
      response: {
        status: 200
      }
    });
    expect(id).equals('id');
    const interaction = await mock.getInteraction('id');
    expect(interaction).deep.equals({
      id: 'id',
      "strict": true,
      request: { method: 'GET', path: '/remote/get', "matchingRules": {}, "queryParams": {} },
      response: { status: 200, "matchingRules": {} },
      callCount: 0,
      "calls": [],
      "exercised": false,
      expects: { exercised: true }
    });
  });

  it('add mock interactions & get them', async () => {
    const ids = await mock.addInteraction([
      {
        id: 'id1',
        request: {
          method: 'GET',
          path: '/remote/get'
        },
        response: {
          status: 200
        }
      },
      {
        id: 'id2',
        request: {
          method: 'GET',
          path: '/remote/get'
        },
        response: {
          status: 200
        }
      }
    ]);
    expect(ids).deep.equals(['id1', 'id2']);
    const interactions = await mock.getInteraction(['id1', 'id2']);
    expect(interactions).deep.equals([
      {
        id: 'id1',
        "strict": true,
        request: { method: 'GET', path: '/remote/get', "matchingRules": {}, "queryParams": {} },
        response: { status: 200, "matchingRules": {} },
        callCount: 0,
        "calls": [],
        "exercised": false,
        expects: { exercised: true }
      },
      {
        id: 'id2',
        "strict": true,
        request: { method: 'GET', path: '/remote/get', "matchingRules": {}, "queryParams": {} },
        response: { status: 200, "matchingRules": {} },
        callCount: 0,
        "calls": [],
        "exercised": false,
        expects: { exercised: true }
      }
    ]);
  });

  it('add mock interactions with a handler & get them', async () => {
    const ids = await mock.addInteraction([
      {
        id: 'id1',
        request: {
          method: 'GET',
          path: '/remote/get'
        },
        response: {
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
        "strict": true,
        request: { method: 'GET', path: '/remote/get', "matchingRules": {}, "queryParams": {} },
        response: { status: 200, "matchingRules": {} },
        callCount: 0,
        "calls": [],
        "exercised": false,
        expects: { exercised: true }
      },
      {
        id: 'id2',
        "strict": true,
        request: { method: 'GET', path: '/remote/mock/handler', "matchingRules": {}, "queryParams": {} },
        response: { status: 200, "matchingRules": {} },
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