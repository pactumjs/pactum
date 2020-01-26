const expect = require('chai').expect;
const sandbox = require('sinon').createSandbox();

const Interaction = require('../../src/models/interaction');
const helper = require('../../src/helpers/helper');

describe('Interaction', () => {

  before(() => {
    this.helperGetRandomIdStub = sandbox.stub(helper, 'getRandomId');
  });

  it('valid mock interaction', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteraction = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1'
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    }
    const interaction = new Interaction(rawInteraction, true);
    expect(interaction).to.deep.equals({
      "id": "random",
      "consumer": undefined,
      "port": 9393,
      "mock": true,
      "provider": undefined,
      "state": undefined,
      "uponReceiving": undefined,
      "willRespondWith": {
        "body": {
          "id": 1,
          "name": "fake"
        },
        "headers": {
          "content-type": "application/json"
        },
        "rawBody": {
          "id": 1,
          "name": "fake"
        },
        "status": 200
      },
      "withRequest": {
        "body": undefined,
        "headers": undefined,
        "ignoreBody": false,
        "ignoreQuery": false,
        "method": "GET",
        "path": "/api/projects/1",
        "query": undefined
      },
      "rawInteraction": {
        "willRespondWith": {
          "body": {
            "id": 1,
            "name": "fake"
          },
          "headers": {
            "content-type": "application/json"
          },
          "status": 200
        },
        "withRequest": {
          "method": "GET",
          "path": "/api/projects/1"
        }
      },
    });
  });

  it('invalid mock interaction - no request method', () => {
    const rawInteraction = {
      withRequest: {
        path: '/api/projects/1'
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    }
    expect(function() { new Interaction(rawInteraction, true)}).to.throws('Invalid interaction request method provided - undefined');
  });

  it('invalid mock interaction - no request path', () => {
    const rawInteraction = {
      withRequest: {
        method: 'GET'
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    }
    expect(function() { new Interaction(rawInteraction, true)}).to.throws('Invalid interaction request path provided - undefined');
  });

  it('invalid mock interaction - no response status', () => {
    const rawInteraction = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1'
      },
      willRespondWith: {
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    }
    expect(function() { new Interaction(rawInteraction, true)}).to.throws('Invalid interaction response status provided - undefined');
  });

  it('valid pact interaction', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteraction = {
      provider: 'pro',
      state: 'a state',
      uponReceiving: 'description',
      withRequest: {
        method: 'GET',
        path: '/api/projects/1'
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    }
    const interaction = new Interaction(rawInteraction, false);
    expect(interaction).to.deep.equals({
      "id": "random",
      "consumer": undefined,
      "mock": false,
      "port": 9393,
      "provider": 'pro',
      "state": 'a state',
      "uponReceiving": 'description',
      "willRespondWith": {
        "body": {
          "id": 1,
          "name": "fake"
        },
        "headers": {
          "content-type": "application/json"
        },
        "rawBody": {
          "id": 1,
          "name": "fake"
        },
        "status": 200
      },
      "withRequest": {
        "body": undefined,
        "headers": undefined,
        "ignoreBody": false,
        "ignoreQuery": false,
        "method": "GET",
        "path": "/api/projects/1",
        "query": undefined
      },
      "rawInteraction": {
        "provider": 'pro',
        "state": 'a state',
        "uponReceiving": 'description',
        "willRespondWith": {
          "body": {
            "id": 1,
            "name": "fake"
          },
          "headers": {
            "content-type": "application/json"
          },
          "status": 200
        },
        "withRequest": {
          "method": "GET",
          "path": "/api/projects/1"
        }
      },
    });
  });

  it('invalid pact interaction - no provider name', () => {
    const rawInteraction = {
      state: 'a state',
      uponReceiving: 'description',
      withRequest: {
        method: 'GET',
        path: '/api/projects/1'
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    }
    expect(function() { new Interaction(rawInteraction, false)}).to.throws('Invalid provider name provided - undefined');
  });

  it('invalid pact interaction - no state name', () => {
    const rawInteraction = {
      provider: 'pro',
      uponReceiving: 'description',
      withRequest: {
        method: 'GET',
        path: '/api/projects/1'
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    }
    expect(function() { new Interaction(rawInteraction, false)}).to.throws('Invalid state provided - undefined');
  });

  it('invalid pact interaction - no upon receiving description', () => {
    const rawInteraction = {
      provider: 'pro',
      state: 'a state',
      withRequest: {
        method: 'GET',
        path: '/api/projects/1'
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    }
    expect(function() { new Interaction(rawInteraction, false)}).to.throws('Invalid upon receiving description provided - undefined');
  });

  it('invalid pact interaction - with ignore query', () => {
    const rawInteraction = {
      provider: 'pro',
      state: 'a state',
      uponReceiving: 'description',
      withRequest: {
        method: 'GET',
        path: '/api/projects/1',
        ignoreQuery: true
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    }
    expect(function() { new Interaction(rawInteraction, false)}).to.throws(`Pact interaction won't support ignore query`);
  });

  it('invalid pact interaction - with ignore body', () => {
    const rawInteraction = {
      provider: 'pro',
      state: 'a state',
      uponReceiving: 'description',
      withRequest: {
        method: 'GET',
        path: '/api/projects/1',
        ignoreBody: true
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    }
    expect(function() { new Interaction(rawInteraction, false)}).to.throws(`Pact interaction won't support ignore body`);
  });

  after(() => {
    sandbox.restore();
  });

});