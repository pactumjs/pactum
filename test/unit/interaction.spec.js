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
    };
    const interaction = new Interaction(rawInteraction, true);
    expect(interaction).to.deep.equals({
      "id": "random",
      "count": 0,
      "consumer": '',
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

  it('valid mock interaction - with request query', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteraction = {
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
    const interaction = new Interaction(rawInteraction, true);
    expect(interaction).to.deep.equals({
      "id": "random",
      "count": 0,
      "consumer": '',
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
        "rawQuery": {
          "id": 1,
          "name": 'Jon'
        },
        "matchingRules": {}
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
          "path": "/api/projects/1",
          "query": {
            "id": "1",
            "name": "Jon"
          }
        }
      }
    });
  });

  it('valid mock interaction - with request query & matching rules', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteraction = {
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
    const interaction = new Interaction(rawInteraction, true);
    expect(interaction).to.deep.equals({
      "id": "random",
      "count": 0,
      "consumer": '',
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
        "rawQuery": {
          "id": {
            "contents": 1,
            "json_class": "Pact::SomethingLike",
            "value": 1
          },
          "name": {
            "data": {
              "generate": "Jon",
              "matcher": {
                "json_class": "Regexp",
                "o": 0,
                "s": "/w+/g"
              }
            },
            "json_class": "Pact::Term",
            "value": "Jon"
          }
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
          "path": "/api/projects/1",
          "query": {
            "id": "1",
            "name": "Jon"
          }
        }
      }
    });
  });

  it('valid mock interaction - with request body', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteraction = {
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
    const interaction = new Interaction(rawInteraction, true);
    expect(interaction).to.deep.equals({
      "id": "random",
      "count": 0,
      "consumer": '',
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
        "rawBody": {
          "id": 1,
          "name": 'Jon'
        },
        "matchingRules": {}
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
          "path": "/api/projects/1",
          "body": {
            "id": 1,
            "name": "Jon"
          }
        }
      }
    });
  });

  it('valid mock interaction - with request body & matching rules', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteraction = {
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
    const interaction = new Interaction(rawInteraction, true);
    expect(interaction).to.deep.equals({
      "id": "random",
      "count": 0,
      "consumer": '',
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
        "rawBody": {
          "id": {
            "contents": 1,
            "json_class": "Pact::SomethingLike",
            "value": 1
          },
          "name": {
            "data": {
              "generate": "Jon",
              "matcher": {
                "json_class": "Regexp",
                "o": 0,
                "s": "/w+/g"
              }
            },
            "json_class": "Pact::Term",
            "value": "Jon"
          }
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
          "path": "/api/projects/1",
          "body": {
            "id": 1,
            "name": "Jon"
          }
        }
      }
    });
  });

  it('valid mock interaction - function', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteraction = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1'
      },
      willRespondWith: function () { }
    };
    const interaction = new Interaction(rawInteraction, true);
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
        },
        fixedDelay: 10
      }
    };
    const interaction = new Interaction(rawInteraction, true);
    expect(interaction).to.deep.equals({
      "id": "random",
      "count": 0,
      "consumer": '',
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
      "rawInteraction": {
        "willRespondWith": {
          "body": {
            "id": 1,
            "name": "fake"
          },
          "headers": {
            "content-type": "application/json"
          },
          "status": 200,
          "fixedDelay": 10
        },
        "withRequest": {
          "method": "GET",
          "path": "/api/projects/1"
        }
      },
    });
  });

  it('valid mock interaction - random Delay', () => {
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
        },
        randomDelay: {
          min: 10,
          max: 100
        }
      }
    };
    const interaction = new Interaction(rawInteraction, true);
    expect(interaction).to.deep.equals({
      "id": "random",
      "count": 0,
      "consumer": '',
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
      "rawInteraction": {
        "willRespondWith": {
          "body": {
            "id": 1,
            "name": "fake"
          },
          "headers": {
            "content-type": "application/json"
          },
          "status": 200,
          "randomDelay": {
            "min": 10,
            "max": 100
          }
        },
        "withRequest": {
          "method": "GET",
          "path": "/api/projects/1"
        }
      },
    });
  });

  it('valid mock interaction - single on Call', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteraction = {
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
    const interaction = new Interaction(rawInteraction, true);
    expect(interaction).to.deep.equals({
      "id": "random",
      "count": 0,
      "consumer": '',
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
        "status": 200,
        "delay": {
          "type": "NONE",
          "value": 0
        },
        "1": {
          "body": undefined,
          "delay": {
            "type": "NONE",
            "value": 0
          },
          "headers": undefined,
          "rawBody": undefined,
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
      "rawInteraction": {
        "willRespondWith": {
          "body": {
            "id": 1,
            "name": "fake"
          },
          "headers": {
            "content-type": "application/json"
          },
          "status": 200,
          "onCall": {
            "1": {
              "status": 404
            }
          }
        },
        "withRequest": {
          "method": "GET",
          "path": "/api/projects/1"
        }
      },
    });
  });

  it('valid mock interaction - multiple on Calls & no default', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteraction = {
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
    const interaction = new Interaction(rawInteraction, true);
    expect(interaction).to.deep.equals({
      "id": "random",
      "count": 0,
      "consumer": '',
      "mock": true,
      "provider": undefined,
      "state": undefined,
      "uponReceiving": undefined,
      "willRespondWith": {
        "body": "Response Not Found",
        "rawBody": "Response Not Found",
        "headers": undefined,
        "status": 404,
        "delay": {
          "type": "NONE",
          "value": 0
        },
        "0": {
          "body": undefined,
          "delay": {
            "type": "NONE",
            "value": 0
          },
          "headers": undefined,
          "rawBody": undefined,
          "status": 404
        },
        "1": {
          "body": undefined,
          "delay": {
            "type": "NONE",
            "value": 0
          },
          "headers": undefined,
          "rawBody": undefined,
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
      "rawInteraction": {
        "willRespondWith": {
          "body": "Response Not Found",
          "status": 404,
          "onCall": {
            "0": {
              "status": 404
            },
            "1": {
              "status": 200
            }
          }
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
    };
    expect(function () { new Interaction(rawInteraction, true); }).to.throws('Invalid interaction request method provided - undefined');
  });

  it('invalid mock interaction - no request method', () => {
    const rawInteraction = {
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
    expect(function () { new Interaction(rawInteraction, true); }).to.throws('Invalid interaction request method provided - get');
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
    };
    expect(function () { new Interaction(rawInteraction, true); }).to.throws('Invalid interaction request path provided - undefined');
  });

  it('invalid mock interaction - query as null', () => {
    const rawInteraction = {
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
    expect(function () { new Interaction(rawInteraction, true); }).to.throws('`withRequest.query` should be object');
  });

  it('invalid mock interaction - query as string', () => {
    const rawInteraction = {
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
    expect(function () { new Interaction(rawInteraction, true); }).to.throws('`withRequest.query` should be object');
  });

  it('invalid mock interaction - query as empty string', () => {
    const rawInteraction = {
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
    expect(function () { new Interaction(rawInteraction, true); }).to.throws('`withRequest.query` should be object');
  });

  it('invalid mock interaction - query as array', () => {
    const rawInteraction = {
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
    expect(function () { new Interaction(rawInteraction, true); }).to.throws('`withRequest.query` should be object');
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
    };
    expect(function () { new Interaction(rawInteraction, true); }).to.throws('Invalid interaction response status provided - undefined');
  });

  it('invalid mock interaction - fixed delay is string', () => {
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
        },
        fixedDelay: "ten"
      }
    };
    expect(function () { new Interaction(rawInteraction, true); }).to.throws('Invalid interaction response Fixed Delay provided - ten');
  });

  it('invalid mock interaction - fixed delay is less than 0', () => {
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
        },
        fixedDelay: -22
      }
    };
    expect(function () { new Interaction(rawInteraction, true); }).to.throws('Interaction response Fixed Delay should be greater than 0');
  });

  it('invalid mock interaction - random delay is string', () => {
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
        },
        randomDelay: "ten"
      }
    };
    expect(function () { new Interaction(rawInteraction, true); }).to.throws('Invalid Random Delay provided- ten');
  });

  it('invalid mock interaction - random delay min is string', () => {
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
        },
        randomDelay: {
          min: ""
        }
      }
    };
    expect(function () { new Interaction(rawInteraction, true); }).to.throws('Invalid min value provided in Random Delay -');
  });

  it('invalid mock interaction - random delay max is string', () => {
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
        },
        randomDelay: {
          min: 10
        }
      }
    };
    expect(function () { new Interaction(rawInteraction, true); }).to.throws('Invalid max value provided in Random Delay - undefined');
  });

  it('invalid mock interaction - random delay min is less than 0', () => {
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
        },
        randomDelay: {
          min: -10,
          max: 100
        }
      }
    };
    expect(function () { new Interaction(rawInteraction, true); }).to.throws('Min value in Random Delay should be greater than 0');
  });

  it('invalid mock interaction - random delay max is less than 0', () => {
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
        },
        randomDelay: {
          min: 10,
          max: -100
        }
      }
    };
    expect(function () { new Interaction(rawInteraction, true); }).to.throws('Max value in Random Delay should be greater than 0');
  });

  it('invalid mock interaction - random delay max is less than 0', () => {
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
        },
        randomDelay: {
          min: 10,
          max: 5
        }
      }
    };
    expect(function () { new Interaction(rawInteraction, true); }).to.throws('Min value in Random Delay should be less than Max Value');
  });

  it('invalid mock interaction - null response', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteraction = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1'
      },
      willRespondWith: null
    };
    expect(function () { new Interaction(rawInteraction, true); }).to.throws('Invalid interaction response provided - null');
  });

  it('invalid mock interaction - null', () => {
    expect(function () { new Interaction(null, true); }).to.throws('Invalid interaction provided - null');
  });

  it('invalid mock interaction - undefined', () => {
    expect(function () { new Interaction(undefined, true); }).to.throws('Invalid interaction provided - undefined');
  });

  it('invalid mock interaction - onCall - string keys', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteraction = {
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
    expect(function () { new Interaction(rawInteraction, true); }).throws('Invalid interaction response onCall provided');
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
    };
    const interaction = new Interaction(rawInteraction, false);
    expect(interaction).to.deep.equals({
      "id": "random",
      "count": 0,
      "consumer": 'unit-test-consumer',
      "mock": false,
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

  it('valid pact interaction - with custom consumer name', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteraction = {
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
    const interaction = new Interaction(rawInteraction, false);
    expect(interaction).to.deep.equals({
      "id": "random",
      "count": 0,
      "consumer": 'custom-consumer',
      "mock": false,
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
      "rawInteraction": {
        "consumer": "custom-consumer",
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
    };
    expect(function () { new Interaction(rawInteraction, false); }).to.throws('Invalid provider name provided - undefined');
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
    };
    expect(function () { new Interaction(rawInteraction, false); }).to.throws('Invalid state provided - undefined');
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
    };
    expect(function () { new Interaction(rawInteraction, false); }).to.throws('Invalid upon receiving description provided - undefined');
  });

  it('invalid pact interaction - fixed delay', () => {
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
        },
        fixedDelay: 100
      }
    };
    expect(function () { new Interaction(rawInteraction, false); }).to.throws(`Pact interaction won't support delays`);
  });

  it('invalid pact interaction - random delay', () => {
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
        },
        randomDelay: { min: 100, max: 1000 }
      }
    };
    expect(function () { new Interaction(rawInteraction, false); }).to.throws(`Pact interaction won't support delays`);
  });

  it('invalid pact interaction - response function', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteraction = {
      provider: 'pro',
      state: 'a state',
      uponReceiving: 'description',
      withRequest: {
        method: 'GET',
        path: '/api/projects/1'
      },
      willRespondWith: () => { }
    };
    expect(function () { new Interaction(rawInteraction, false); }).to.throws(`Pact interaction won't support function response`);
  });

  it('invalid pact interaction - no consumer name', () => {
    config.pact.consumer = '';
    const rawInteraction = {
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
    expect(function () { new Interaction(rawInteraction, false); }).to.throws('Consumer Name should be set before adding a pact interaction -> pactum.pact.setConsumerName()');
  });

  after(() => {
    config.pact.consumer = '';
    sandbox.restore();
  });

});