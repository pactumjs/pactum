const expect = require('chai').expect;
const sandbox = require('sinon').createSandbox();

const Interaction = require('../../src/models/interaction');
const Matcher = require('../../src/models/matcher');
const helper = require('../../src/helpers/helper');

describe('Interaction', () => {

  before(() => {
    this.matcher = new Matcher();
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
        "fixedDelay": undefined
      },
      "withRequest": {
        "body": undefined,
        "headers": undefined,
        "ignoreBody": false,
        "ignoreQuery": false,
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
        "fixedDelay": undefined
      },
      "withRequest": {
        "body": undefined,
        "headers": undefined,
        "ignoreBody": false,
        "ignoreQuery": false,
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
          id: this.matcher.like(1),
          name: this.matcher.regex({ generate: 'Jon', matcher: '/\w+/g' })
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
        "fixedDelay": undefined
      },
      "withRequest": {
        "body": undefined,
        "headers": undefined,
        "ignoreBody": false,
        "ignoreQuery": false,
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
        "fixedDelay": undefined
      },
      "withRequest": {
        "query": undefined,
        "headers": undefined,
        "ignoreBody": false,
        "ignoreQuery": false,
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
          id: this.matcher.like(1),
          name: this.matcher.regex({ generate: 'Jon', matcher: '/\w+/g' })
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
        "fixedDelay": undefined
      },
      "withRequest": {
        "query": undefined,
        "headers": undefined,
        "ignoreBody": false,
        "ignoreQuery": false,
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
      "ignoreBody": false,
      "ignoreQuery": false,
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
        "fixedDelay": 10
      },
      "withRequest": {
        "body": undefined,
        "headers": undefined,
        "ignoreBody": false,
        "ignoreQuery": false,
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

  it('invalid mock interaction - fixed Delay is string', () => {
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

  it('invalid mock interaction - fixed Delay is less than 0', () => {
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
      "consumer": '',
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
        "fixedDelay": undefined
      },
      "withRequest": {
        "body": undefined,
        "headers": undefined,
        "ignoreBody": false,
        "ignoreQuery": false,
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
    };
    expect(function () { new Interaction(rawInteraction, false); }).to.throws(`Pact interaction won't support ignore query`);
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
    };
    expect(function () { new Interaction(rawInteraction, false); }).to.throws(`Pact interaction won't support ignore body`);
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

  after(() => {
    sandbox.restore();
  });

});