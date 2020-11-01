const expect = require('chai').expect;
const sandbox = require('sinon').createSandbox();

const Interaction = require('../../src/models/interaction');
const matcher = require('../../src/exports/matcher');
const helper = require('../../src/helpers/helper');
const config = require('../../src/config');

describe('Interaction - Mock', () => {

  before(() => {
    this.helperGetRandomIdStub = sandbox.stub(helper, 'getRandomId');
  });

  it('valid mock interaction', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
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
    };
    const interaction = new Interaction(raw, true);
    expect(interaction).to.deep.equals({
      "id": "random",
      "callCount": 0,
      "calls": [],
      "exercised": false,
      "consumer": '',
      "mock": true,
      "provider": undefined,
      "state": undefined,
      "uponReceiving": undefined,
      "willRespondWith": {
        "matchingRules": {},
        "body": {
          "id": 1,
          "name": "fake"
        },
        "headers": {
          "content-type": "application/json"
        },
        "status": 200,
        "delay": {
          "type": "NONE",
          "value": 0
        }
      },
      "withRequest": {
        "body": undefined,
        "headers": undefined,
        "method": "GET",
        "path": "/api/projects/1",
        "query": undefined,
        "matchingRules": {}
      },
      "expects": {
        "exercised": true,
        "callCount": undefined
      }
    });
  });

  it('valid mock interaction - with request query', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1',
        query: {
          id: 1,
          name: 'Jon'
        }
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
    };
    const interaction = new Interaction(raw, true);
    expect(interaction).to.deep.equals({
      "id": "random",
      "callCount": 0,
      "calls": [],
      "exercised": false,
      "consumer": '',
      "mock": true,
      "provider": undefined,
      "state": undefined,
      "uponReceiving": undefined,
      "willRespondWith": {
        "matchingRules": {},
        "body": {
          "id": 1,
          "name": "fake"
        },
        "headers": {
          "content-type": "application/json"
        },
        "status": 200,
        "delay": {
          "type": "NONE",
          "value": 0
        }
      },
      "withRequest": {
        "body": undefined,
        "headers": undefined,
        "method": "GET",
        "path": "/api/projects/1",
        "query": {
          "id": "1",
          "name": "Jon"
        },
        "matchingRules": {}
      },
      "expects": {
        "exercised": true,
        "callCount": undefined
      }
    });
  });

  it('valid mock interaction - with request query & matching rules', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1',
        query: {
          id: matcher.like(1),
          name: matcher.regex({ generate: 'Jon', matcher: '/\w+/g' })
        }
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
    };
    const interaction = new Interaction(raw, true);
    expect(interaction).to.deep.equals({
      "id": "random",
      "callCount": 0,
      "calls": [],
      "exercised": false,
      "consumer": '',
      "mock": true,
      "provider": undefined,
      "state": undefined,
      "uponReceiving": undefined,
      "willRespondWith": {
        "matchingRules": {},
        "body": {
          "id": 1,
          "name": "fake"
        },
        "headers": {
          "content-type": "application/json"
        },
        "status": 200,
        "delay": {
          "type": "NONE",
          "value": 0
        }
      },
      "withRequest": {
        "body": undefined,
        "headers": undefined,
        "method": "GET",
        "path": "/api/projects/1",
        "query": {
          "id": "1",
          "name": "Jon"
        },
        "matchingRules": {
          "$.query.id": {
            "match": "type"
          },
          "$.query.name": {
            "match": "regex",
            "regex": "/w+/g"
          }
        }
      },
      "expects": {
        "exercised": true,
        "callCount": undefined
      }
    });
  });

  it('valid mock interaction - with request body', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1',
        body: {
          id: 1,
          name: 'Jon'
        }
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
    };
    const interaction = new Interaction(raw, true);
    expect(interaction).to.deep.equals({
      "id": "random",
      "callCount": 0,
      "calls": [],
      "exercised": false,
      "consumer": '',
      "mock": true,
      "provider": undefined,
      "state": undefined,
      "uponReceiving": undefined,
      "willRespondWith": {
        "matchingRules": {},
        "body": {
          "id": 1,
          "name": "fake"
        },
        "headers": {
          "content-type": "application/json"
        },
        "status": 200,
        "delay": {
          "type": "NONE",
          "value": 0
        }
      },
      "withRequest": {
        "query": undefined,
        "headers": undefined,
        "method": "GET",
        "path": "/api/projects/1",
        "body": {
          "id": 1,
          "name": "Jon"
        },
        "matchingRules": {}
      },
      "expects": {
        "exercised": true,
        "callCount": undefined
      }
    });
  });

  it('valid mock interaction - with request body & matching rules', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1',
        body: {
          id: matcher.like(1),
          name: matcher.regex({ generate: 'Jon', matcher: '/\w+/g' })
        }
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
    };
    const interaction = new Interaction(raw, true);
    expect(interaction).to.deep.equals({
      "id": "random",
      "callCount": 0,
      "calls": [],
      "exercised": false,
      "consumer": '',
      "mock": true,
      "provider": undefined,
      "state": undefined,
      "uponReceiving": undefined,
      "willRespondWith": {
        "matchingRules": {},
        "body": {
          "id": 1,
          "name": "fake"
        },
        "headers": {
          "content-type": "application/json"
        },
        "status": 200,
        "delay": {
          "type": "NONE",
          "value": 0
        }
      },
      "withRequest": {
        "query": undefined,
        "headers": undefined,
        "method": "GET",
        "path": "/api/projects/1",
        "body": {
          "id": 1,
          "name": "Jon"
        },
        "matchingRules": {
          "$.body.id": {
            "match": "type"
          },
          "$.body.name": {
            "match": "regex",
            "regex": "/w+/g"
          }
        }
      },
      "expects": {
        "exercised": true,
        "callCount": undefined
      }
    });
  });

  it('valid mock interaction - function', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1'
      },
      willRespondWith: function () { }
    };
    const interaction = new Interaction(raw, true);
    expect(interaction.withRequest).deep.equals({
      "body": undefined,
      "headers": undefined,
      "method": "GET",
      "path": "/api/projects/1",
      "query": undefined,
      "matchingRules": {}
    });
  });

  it('valid mock interaction - fixed Delay', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
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
        },
        fixedDelay: 10
      }
    };
    const interaction = new Interaction(raw, true);
    expect(interaction).to.deep.equals({
      "id": "random",
      "callCount": 0,
      "calls": [],
      "exercised": false,
      "consumer": '',
      "mock": true,
      "provider": undefined,
      "state": undefined,
      "uponReceiving": undefined,
      "willRespondWith": {
        "matchingRules": {},
        "body": {
          "id": 1,
          "name": "fake"
        },
        "headers": {
          "content-type": "application/json"
        },
        "status": 200,
        "delay": {
          "type": "FIXED",
          "value": 10
        }
      },
      "withRequest": {
        "body": undefined,
        "headers": undefined,
        "method": "GET",
        "path": "/api/projects/1",
        "query": undefined,
        "matchingRules": {}
      },
      "expects": {
        "exercised": true,
        "callCount": undefined
      }
    });
  });

  it('valid mock interaction - random Delay', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
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
        },
        randomDelay: {
          min: 10,
          max: 100
        }
      }
    };
    const interaction = new Interaction(raw, true);
    expect(interaction).to.deep.equals({
      "id": "random",
      "callCount": 0,
      "calls": [],
      "exercised": false,
      "consumer": '',
      "mock": true,
      "provider": undefined,
      "state": undefined,
      "uponReceiving": undefined,
      "willRespondWith": {
        "matchingRules": {},
        "body": {
          "id": 1,
          "name": "fake"
        },
        "headers": {
          "content-type": "application/json"
        },
        "status": 200,
        "delay": {
          "type": "RANDOM",
          "subType": "UNIFORM",
          "min": 10,
          "max": 100
        }
      },
      "withRequest": {
        "body": undefined,
        "headers": undefined,
        "method": "GET",
        "path": "/api/projects/1",
        "query": undefined,
        "matchingRules": {}
      },
      "expects": {
        "exercised": true,
        "callCount": undefined
      }
    });
  });

  it('valid mock interaction - single on Call', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1'
      },
      willRespondWith: {
        onCall: {
          1: {
            status: 404
          }
        },
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    };
    const interaction = new Interaction(raw, true);
    expect(interaction).to.deep.equals({
      "id": "random",
      "callCount": 0,
      "calls": [],
      "exercised": false,
      "consumer": '',
      "mock": true,
      "provider": undefined,
      "state": undefined,
      "uponReceiving": undefined,
      "willRespondWith": {
        "matchingRules": {},
        "body": {
          "id": 1,
          "name": "fake"
        },
        "headers": {
          "content-type": "application/json"
        },
        "status": 200,
        "delay": {
          "type": "NONE",
          "value": 0
        },
        "1": {
          "matchingRules": {},
          "body": undefined,
          "delay": {
            "type": "NONE",
            "value": 0
          },
          "headers": undefined,
          "status": 404
        }
      },
      "withRequest": {
        "body": undefined,
        "headers": undefined,
        "method": "GET",
        "path": "/api/projects/1",
        "query": undefined,
        "matchingRules": {}
      },
      "expects": {
        "exercised": true,
        "callCount": undefined
      }
    });
  });

  it('valid mock interaction - multiple on Calls & no default', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1'
      },
      willRespondWith: {
        onCall: {
          0: {
            status: 404
          },
          1: {
            status: 200
          }
        }
      }
    };
    const interaction = new Interaction(raw, true);
    expect(interaction).to.deep.equals({
      "id": "random",
      "callCount": 0,
      "calls": [],
      "exercised": false,
      "consumer": '',
      "mock": true,
      "provider": undefined,
      "state": undefined,
      "uponReceiving": undefined,
      "willRespondWith": {
        "matchingRules": {},
        "body": undefined,
        "headers": undefined,
        "status": 404,
        "delay": {
          "type": "NONE",
          "value": 0
        },
        "0": {
          "matchingRules": {},
          "body": undefined,
          "delay": {
            "type": "NONE",
            "value": 0
          },
          "headers": undefined,
          "status": 404
        },
        "1": {
          "matchingRules": {},
          "body": undefined,
          "delay": {
            "type": "NONE",
            "value": 0
          },
          "headers": undefined,
          "status": 200
        }
      },
      "withRequest": {
        "body": undefined,
        "headers": undefined,
        "method": "GET",
        "path": "/api/projects/1",
        "query": undefined,
        "matchingRules": {}
      },
      "expects": {
        "exercised": true,
        "callCount": undefined
      }
    });
  });

  it('valid mock interaction - default response status', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
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
    };
    const interaction = new Interaction(raw, true);
    expect(interaction).to.deep.equals({
      "id": "random",
      "callCount": 0,
      "calls": [],
      "exercised": false,
      "consumer": '',
      "mock": true,
      "provider": undefined,
      "state": undefined,
      "uponReceiving": undefined,
      "willRespondWith": {
        "matchingRules": {},
        "body": {
          "id": 1,
          "name": "fake"
        },
        "headers": {
          "content-type": "application/json"
        },
        "status": 404,
        "delay": {
          "type": "NONE",
          "value": 0
        }
      },
      "withRequest": {
        "body": undefined,
        "headers": undefined,
        "method": "GET",
        "path": "/api/projects/1",
        "query": undefined,
        "matchingRules": {}
      },
      "expects": {
        "exercised": true,
        "callCount": undefined
      }
    });
  });

  it('valid mock interaction - no willRespondWith', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1'
      }
    };
    const interaction = new Interaction(raw, true);
    expect(interaction).to.deep.equals({
      "id": "random",
      "callCount": 0,
      "calls": [],
      "exercised": false,
      "consumer": '',
      "mock": true,
      "provider": undefined,
      "state": undefined,
      "uponReceiving": undefined,
      "willRespondWith": {
        "matchingRules": {},
        "body": undefined,
        "headers": undefined,
        "status": 404,
        "delay": {
          "type": "NONE",
          "value": 0
        }
      },
      "withRequest": {
        "body": undefined,
        "headers": undefined,
        "method": "GET",
        "path": "/api/projects/1",
        "query": undefined,
        "matchingRules": {}
      },
      "expects": {
        "exercised": true,
        "callCount": undefined
      }
    });
  });

  it('invalid mock interaction - no request method', () => {
    const raw = {
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
    };
    expect(function () { new Interaction(raw, true); }).to.throws('`withRequest.method` is required');
  });

  it('invalid mock interaction - no request method', () => {
    const raw = {
      withRequest: {
        method: 'get',
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
    };
    expect(function () { new Interaction(raw, true); }).to.throws('`withRequest.method` is invalid');
  });

  it('invalid mock interaction - no request path', () => {
    const raw = {
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
    };
    expect(function () { new Interaction(raw, true); }).to.throws('`withRequest.path` is required');
  });

  it('invalid mock interaction - query as null', () => {
    const raw = {
      withRequest: {
        method: 'GET',
        path: '/api/query',
        query: null
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
    };
    expect(function () { new Interaction(raw, true); }).to.throws('`withRequest.query` should be object');
  });

  it('invalid mock interaction - query as string', () => {
    const raw = {
      withRequest: {
        method: 'GET',
        path: '/api/query',
        query: 'some query'
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
    };
    expect(function () { new Interaction(raw, true); }).to.throws('`withRequest.query` should be object');
  });

  it('invalid mock interaction - query as empty string', () => {
    const raw = {
      withRequest: {
        method: 'GET',
        path: '/api/query',
        query: ''
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
    };
    expect(function () { new Interaction(raw, true); }).to.throws('`withRequest.query` should be object');
  });

  it('invalid mock interaction - query as array', () => {
    const raw = {
      withRequest: {
        method: 'GET',
        path: '/api/query',
        query: []
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
    };
    expect(function () { new Interaction(raw, true); }).to.throws('`withRequest.query` should be object');
  });

  it('invalid mock interaction - fixed delay is string', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
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
        },
        fixedDelay: "ten"
      }
    };
    expect(function () { new Interaction(raw, true); }).to.throws('`willRespondWith.fixedDelay` should be number');
  });

  it('invalid mock interaction - fixed delay is less than 0', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
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
        },
        fixedDelay: -22
      }
    };
    expect(function () { new Interaction(raw, true); }).to.throws('`willRespondWith.fixedDelay` should be greater than 0');
  });

  it('invalid mock interaction - random delay is string', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
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
        },
        randomDelay: "ten"
      }
    };
    expect(function () { new Interaction(raw, true); }).to.throws('`willRespondWith.randomDelay` should be object');
  });

  it('invalid mock interaction - random delay min is string', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
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
        },
        randomDelay: {
          min: ""
        }
      }
    };
    expect(function () { new Interaction(raw, true); }).to.throws('`willRespondWith.randomDelay.min` should be number');
  });

  it('invalid mock interaction - random delay max is string', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
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
        },
        randomDelay: {
          min: 10
        }
      }
    };
    expect(function () { new Interaction(raw, true); }).to.throws('`willRespondWith.randomDelay.max` should be number');
  });

  it('invalid mock interaction - random delay min is less than 0', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
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
        },
        randomDelay: {
          min: -10,
          max: 100
        }
      }
    };
    expect(function () { new Interaction(raw, true); }).to.throws('`willRespondWith.randomDelay.min` should be greater than 0');
  });

  it('invalid mock interaction - random delay max is less than 0', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
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
        },
        randomDelay: {
          min: 10,
          max: -100
        }
      }
    };
    expect(function () { new Interaction(raw, true); }).to.throws('`willRespondWith.randomDelay.max` should be greater than 0');
  });

  it('invalid mock interaction - random delay max is less than min', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
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
        },
        randomDelay: {
          min: 10,
          max: 5
        }
      }
    };
    expect(function () { new Interaction(raw, true); }).to.throws('`willRespondWith.randomDelay.min` should be less than `willRespondWith.randomDelay.max`');
  });

  it('invalid mock interaction - null', () => {
    expect(function () { new Interaction(null, true); }).to.throws('`interaction` is required');
  });

  it('invalid mock interaction - undefined', () => {
    expect(function () { new Interaction(undefined, true); }).to.throws('`interaction` is required');
  });

  it('invalid mock interaction - onCall - string keys', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1'
      },
      willRespondWith: {
        onCall: {
          "first": "ano one"
        }
      }
    };
    expect(function () { new Interaction(raw, true); }).throws('Invalid interaction response onCall provided');
  });

  after(() => {
    sandbox.restore();
  });

});

describe('Interaction - Pact', () => {

  before(() => {
    this.helperGetRandomIdStub = sandbox.stub(helper, 'getRandomId');
  });

  beforeEach(() => {
    config.pact.consumer = 'unit-test-consumer';
  });

  it('valid pact interaction', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
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
    };
    const interaction = new Interaction(raw, false);
    expect(interaction).to.deep.equals({
      "id": "random",
      "callCount": 0,
      "calls": [],
      "exercised": false,
      "consumer": 'unit-test-consumer',
      "mock": false,
      "provider": 'pro',
      "state": 'a state',
      "uponReceiving": 'description',
      "willRespondWith": {
        "matchingRules": {},
        "body": {
          "id": 1,
          "name": "fake"
        },
        "headers": {
          "content-type": "application/json"
        },
        "status": 200,
        "delay": {
          "type": "NONE",
          "value": 0
        }
      },
      "withRequest": {
        "body": undefined,
        "headers": undefined,
        "method": "GET",
        "path": "/api/projects/1",
        "query": undefined,
        "matchingRules": {}
      },
      "expects": {
        "exercised": true,
        "callCount": undefined
      }
    });
  });

  it('valid pact interaction - with custom consumer name', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
      consumer: 'custom-consumer',
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
    };
    const interaction = new Interaction(raw, false);
    expect(interaction).to.deep.equals({
      "id": "random",
      "callCount": 0,
      "calls": [],
      "exercised": false,
      "consumer": 'custom-consumer',
      "mock": false,
      "provider": 'pro',
      "state": 'a state',
      "uponReceiving": 'description',
      "willRespondWith": {
        "matchingRules": {},
        "body": {
          "id": 1,
          "name": "fake"
        },
        "headers": {
          "content-type": "application/json"
        },
        "status": 200,
        "delay": {
          "type": "NONE",
          "value": 0
        }
      },
      "withRequest": {
        "body": undefined,
        "headers": undefined,
        "method": "GET",
        "path": "/api/projects/1",
        "query": undefined,
        "matchingRules": {}
      },
      "expects": {
        "exercised": true,
        "callCount": undefined
      }
    });
  });

  it('invalid pact interaction - no provider name', () => {
    const raw = {
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
    };
    expect(function () { new Interaction(raw, false); }).to.throws('`provider` is required');
  });

  it('invalid pact interaction - no state name', () => {
    const raw = {
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
    };
    expect(function () { new Interaction(raw, false); }).to.throws('`state` is required');
  });

  it('invalid pact interaction - no upon receiving description', () => {
    const raw = {
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
    };
    expect(function () { new Interaction(raw, false); }).to.throws('`uponReceiving` is required');
  });

  it('invalid pact interaction - fixed delay', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
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
        },
        fixedDelay: 100
      }
    };
    expect(function () { new Interaction(raw, false); }).to.throws(`Pact interaction won't support delays`);
  });

  it('invalid pact interaction - random delay', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
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
        },
        randomDelay: { min: 100, max: 1000 }
      }
    };
    expect(function () { new Interaction(raw, false); }).to.throws(`Pact interaction won't support delays`);
  });

  it('invalid pact interaction - response function', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
      provider: 'pro',
      state: 'a state',
      uponReceiving: 'description',
      withRequest: {
        method: 'GET',
        path: '/api/projects/1'
      },
      willRespondWith: () => { }
    };
    expect(function () { new Interaction(raw, false); }).to.throws(`Pact interaction won't support function response`);
  });

  it('invalid pact interaction - no consumer name', () => {
    config.pact.consumer = '';
    const raw = {
      provider: 'some',
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
    };
    expect(function () { new Interaction(raw, false); }).to.throws('`consumer` is required => Add consumer through `pactum.consumer.setConsumerName()`');
  });

  after(() => {
    config.pact.consumer = '';
    sandbox.restore();
  });

});