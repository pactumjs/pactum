const expect = require('chai').expect;
const sandbox = require('sinon').createSandbox();
const { like, regex } = require('pactum-matchers');

const Interaction = require('../../src/models/Interaction.model');
const helper = require('../../src/helpers/helper');

describe('Interaction', () => {

  before(() => {
    this.helperGetRandomIdStub = sandbox.stub(helper, 'getRandomId');
  });

  it('valid mock interaction', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
      request: {
        method: 'GET',
        path: '/api/projects/1'
      },
      response: {
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
      "strict": true,
      "response": {
        "matchingRules": {},
        "body": {
          "id": 1,
          "name": "fake"
        },
        "headers": {
          "content-type": "application/json"
        },
        "status": 200
      },
      "request": {
        "method": "GET",
        "path": "/api/projects/1",
        "queryParams": {},
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
      request: {
        method: 'GET',
        path: '/api/projects/1',
        queryParams: {
          id: 1,
          name: 'Jon'
        }
      },
      response: {
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
      "strict": true,
      "response": {
        "matchingRules": {},
        "body": {
          "id": 1,
          "name": "fake"
        },
        "headers": {
          "content-type": "application/json"
        },
        "status": 200
      },
      "request": {
        "method": "GET",
        "path": "/api/projects/1",
        "queryParams": {
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
      request: {
        method: 'GET',
        path: '/api/projects/1',
        queryParams: {
          id: like(1),
          name: regex('Jon', '/\w+/g')
        }
      },
      response: {
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
      "strict": true,
      "response": {
        "matchingRules": {},
        "body": {
          "id": 1,
          "name": "fake"
        },
        "headers": {
          "content-type": "application/json"
        },
        "status": 200
      },
      "request": {
        "method": "GET",
        "path": "/api/projects/1",
        "queryParams": {
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
      request: {
        method: 'GET',
        path: '/api/projects/1',
        body: {
          id: 1,
          name: 'Jon'
        }
      },
      response: {
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
      "strict": true,
      "response": {
        "matchingRules": {},
        "body": {
          "id": 1,
          "name": "fake"
        },
        "headers": {
          "content-type": "application/json"
        },
        "status": 200
      },
      "request": {
        "queryParams": {},

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
      request: {
        method: 'GET',
        path: '/api/projects/1',
        body: {
          id: like(1),
          name: regex('Jon', '/\w+/g')
        }
      },
      response: {
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
      "strict": true,
      "response": {
        "matchingRules": {},
        "body": {
          "id": 1,
          "name": "fake"
        },
        "headers": {
          "content-type": "application/json"
        },
        "status": 200
      },
      "request": {
        "queryParams": {},

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
      request: {
        method: 'GET',
        path: '/api/projects/1'
      },
      response: function () { }
    };
    const interaction = new Interaction(raw, true);
    expect(interaction.request).deep.equals({


      "method": "GET",
      "path": "/api/projects/1",
      "queryParams": {},
      "matchingRules": {}
    });
  });

  it('valid mock interaction - fixed Delay', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
      request: {
        method: 'GET',
        path: '/api/projects/1'
      },
      response: {
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
      "strict": true,
      "response": {
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
      "request": {


        "method": "GET",
        "path": "/api/projects/1",
        "queryParams": {},
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
      request: {
        method: 'GET',
        path: '/api/projects/1'
      },
      response: {
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
      "strict": true,
      "response": {
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
      "request": {


        "method": "GET",
        "path": "/api/projects/1",
        "queryParams": {},
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
      request: {
        method: 'GET',
        path: '/api/projects/1'
      },
      response: {
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
      "strict": true,
      "response": {
        "matchingRules": {},
        "body": {
          "id": 1,
          "name": "fake"
        },
        "headers": {
          "content-type": "application/json"
        },
        "status": 200,
        "1": {
          "matchingRules": {},
          "status": 404,
          "body": undefined,
          "headers": undefined
        }
      },
      "request": {
        "method": "GET",
        "path": "/api/projects/1",
        "queryParams": {},
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
      request: {
        method: 'GET',
        path: '/api/projects/1'
      },
      response: {
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
      "strict": true,
      "response": {
        "matchingRules": {},
        "status": 404,
        "body": undefined,
        "headers": undefined,
        "0": {
          "matchingRules": {},
          "body": undefined,
          "headers": undefined,
          "status": 404
        },
        "1": {
          "matchingRules": {},
          "body": undefined,
          "headers": undefined,
          "status": 200
        }
      },
      "request": {
        "method": "GET",
        "path": "/api/projects/1",
        "queryParams": {},
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
      request: {
        method: 'GET',
        path: '/api/projects/1'
      },
      response: {
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
      "strict": true,
      "response": {
        "matchingRules": {},
        "body": {
          "id": 1,
          "name": "fake"
        },
        "headers": {
          "content-type": "application/json"
        },
        "status": 404
      },
      "request": {
        "method": "GET",
        "path": "/api/projects/1",
        "queryParams": {},
        "matchingRules": {}
      },
      "expects": {
        "exercised": true,
        "callCount": undefined
      }
    });
  });

  it('valid mock interaction - no response', () => {
    this.helperGetRandomIdStub.returns('random');
    const raw = {
      request: {
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
      "strict": true,
      "response": {
        "matchingRules": {},
        "body": undefined,
        "headers": undefined,
        "status": 404
      },
      "request": {
        "method": "GET",
        "path": "/api/projects/1",
        "queryParams": {},
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
      request: {
        path: '/api/projects/1'
      },
      response: {
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
    expect(function () { new Interaction(raw, true); }).to.throws('`request.method` is required');
  });

  it('invalid mock interaction - no request method', () => {
    const raw = {
      request: {
        method: 'get',
        path: '/api/projects/1'
      },
      response: {
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
    expect(function () { new Interaction(raw, true); }).to.throws('`request.method` is invalid');
  });

  it('invalid mock interaction - no request path', () => {
    const raw = {
      request: {
        method: 'GET'
      },
      response: {
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
    expect(function () { new Interaction(raw, true); }).to.throws('`request.path` is required');
  });

  it('invalid mock interaction - query as null', () => {
    const raw = {
      request: {
        method: 'GET',
        path: '/api/query',
        queryParams: null
      },
      response: {
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
    expect(function () { new Interaction(raw, true); }).to.throws('`request.queryParams` should be object');
  });

  it('invalid mock interaction - query as string', () => {
    const raw = {
      request: {
        method: 'GET',
        path: '/api/query',
        queryParams: 'some query'
      },
      response: {
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
    expect(function () { new Interaction(raw, true); }).to.throws('`request.queryParams` should be object');
  });

  it('invalid mock interaction - query as empty string', () => {
    const raw = {
      request: {
        method: 'GET',
        path: '/api/query',
        queryParams: ''
      },
      response: {
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
    expect(function () { new Interaction(raw, true); }).to.throws('`request.queryParams` should be object');
  });

  it('invalid mock interaction - query as array', () => {
    const raw = {
      request: {
        method: 'GET',
        path: '/api/query',
        queryParams: []
      },
      response: {
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
    expect(function () { new Interaction(raw, true); }).to.throws('`request.queryParams` should be object');
  });

  it('invalid mock interaction - null', () => {
    expect(function () { new Interaction(null, true); }).to.throws('`interaction` is required');
  });

  it('invalid mock interaction - undefined', () => {
    expect(function () { new Interaction(undefined, true); }).to.throws('`interaction` is required');
  });

  it('invalid mock interaction - array response', () => {
    expect(function () { new Interaction({ request: { method: 'GET', path: '/s'}, response: [] }, true); }).to.throws('`response` is required');
  });

  it('invalid mock interaction - invalid status', () => {
    expect(function () { new Interaction({ request: { method: 'GET', path: '/s'}, response: { status: 'sad'} }, true); }).to.throws('`response.status` is required');
  });

  after(() => {
    sandbox.restore();
  });

});