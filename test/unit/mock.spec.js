const expect = require('chai').expect;
const sandbox = require('sinon').createSandbox();

const Server = require('../../src/models/server');

const mock = require('../../src/exports/mock');
const helper = require('../../src/helpers/helper');
const config = require('../../src/config');

describe('Mock', () => {

  before(() => {
    config.pact.consumer = 'unit-test-consumer';
  });

  beforeEach(() => {
    this.serverStartStub = sandbox.stub(Server.prototype, 'start');
    this.serverStopStub = sandbox.stub(Server.prototype, 'stop');
    this.serverAddMockInteractionStub = sandbox.stub(Server.prototype, 'addMockInteraction');
    this.serverAddPactInteractionStub = sandbox.stub(Server.prototype, 'addPactInteraction');
    this.serverRemoveInteractionStub = sandbox.stub(Server.prototype, 'removeInteraction');
    this.helperGetRandomIdStub = sandbox.stub(helper, 'getRandomId');
  });

  it('start', async () => {
    await mock.start();
    expect(this.serverStartStub.callCount).equals(1, 'should start the server');
  });

  it('start with port', async () => {
    await mock.start(3000);
    expect(this.serverStartStub.callCount).equals(1, 'should start the server');
  });

  it('start with invalid port', async () => {
    expect(() => mock.start({})).throws('Invalid port number provided');
  });

  it('stop', async () => {
    await mock.stop();
    expect(this.serverStopStub.callCount).equals(1, 'should stop the server');
  });

  it('addMockInteraction - valid', () => {
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
    const id = mock.addMockInteraction(rawInteraction);
    expect(id).to.equals('random');
    expect(this.serverAddMockInteractionStub.callCount).equals(1, 'should add a default mock interaction');
  });

  it('addMockInteraction - invalid', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteraction = {};
    expect(() => { mock.addMockInteraction(rawInteraction); }).throws('Invalid interaction request provided - undefined');
  });

  it('addPactInteraction - valid', () => {
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
    const id = mock.addPactInteraction(rawInteraction);
    expect(id).to.equals('random');
    expect(this.serverAddPactInteractionStub.callCount).equals(1, 'should add a default pact interaction');
  });

  it('addPactInteraction - invalid', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteraction = {};
    expect(() => { mock.addPactInteraction(rawInteraction); }).throws('Invalid provider name provided - undefined');
  });

  it('removeInteraction - invalid interaction id - null', () => {
    expect(() => { mock.removeInteraction(null); }).throws('Invalid interaction id - null');
  });

  it('removeInteraction - invalid interaction id', () => {
    expect(() => { mock.removeInteraction(''); }).throws('Invalid interaction id - ');
  });

  it('removeInteraction - invalid interaction id - undefined', () => {
    expect(() => { mock.removeInteraction(); }).throws('Invalid interaction id - undefined');
  });

  it('removeInteraction', () => {
    mock.removeInteraction('id');
    expect(this.serverRemoveInteractionStub.callCount).equals(1, 'should remove default mock interaction');
    expect(this.serverRemoveInteractionStub.args[0]).deep.equals(['id']);
  });

  it('addMockInteractions - single - valid', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteractions = [{
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
    }];
    const id = mock.addMockInteractions(rawInteractions);
    expect(id).to.deep.equals(['random']);
    expect(this.serverAddMockInteractionStub.callCount).equals(1, 'should add a default mock interaction');
  });

  it('addMockInteractions - multiples - valid', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteractions = [
      {
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
      },
      {
        withRequest: {
          method: 'GET',
          path: '/api/projects/2'
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            id: 1,
            name: 'bake'
          }
        }
      }
    ];
    const id = mock.addMockInteractions(rawInteractions);
    expect(id).to.deep.equals(['random', 'random']);
    expect(this.serverAddMockInteractionStub.callCount).equals(2, 'should add two default mock interactions');
  });

  it('addMockInteractions - invalid', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteraction = {};
    expect(() => { mock.addMockInteractions(rawInteraction); }).throws('Invalid mock interactions array passed');
  });

  it('addPactInteractions - single - valid', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteractions = [{
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
    }];
    const id = mock.addPactInteractions(rawInteractions);
    expect(id).to.deep.equals(['random']);
    expect(this.serverAddPactInteractionStub.callCount).equals(1, 'should add a default pact interaction');
  });

  it('addPactInteractions - multiples - valid', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteractions = [
      {
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
      },
      {
        provider: 'pro',
        state: 'a state',
        uponReceiving: 'description',
        withRequest: {
          method: 'GET',
          path: '/api/projects/2'
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            id: 1,
            name: 'bake'
          }
        }
      }
    ];
    const id = mock.addPactInteractions(rawInteractions);
    expect(id).to.deep.equals(['random', 'random']);
    expect(this.serverAddPactInteractionStub.callCount).equals(2, 'should add two default pact interactions');
  });

  it('addPactInteractions - invalid', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteraction = {};
    expect(() => { mock.addPactInteractions(rawInteraction); }).throws('Invalid pact interactions array passed');
  });

  afterEach(() => {
    sandbox.restore();
  });

  after(() => {
    config.pact.consumer = '';
    config.mock.port = 9393;
  });

});