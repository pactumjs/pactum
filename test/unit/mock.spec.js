const expect = require('chai').expect;
const sandbox = require('sinon').createSandbox();

const Server = require('../../src/models/server');

const Mock = require('../../src/exports/mock');
const helper = require('../../src/helpers/helper');
const config = require('../../src/config');

describe('Mock', () => {

  before(() => {
    config.pact.consumer = 'unit-test-consumer';
  });

  beforeEach(() => {
    this.server = new Server();
    this.serverStartStub = sandbox.stub(Server.prototype, 'start');
    this.serverStopStub = sandbox.stub(Server.prototype, 'stop');
    this.serverAddMockInteractionStub = sandbox.stub(Server.prototype, 'addMockInteraction');
    this.serverAddPactInteractionStub = sandbox.stub(Server.prototype, 'addPactInteraction');
    this.serverRemoveInteractionStub = sandbox.stub(Server.prototype, 'removeInteraction');
    this.helperGetRandomIdStub = sandbox.stub(helper, 'getRandomId');
  });

  it('start', async () => {
    const mock = new Mock(this.server);
    await mock.start();
    expect(this.serverStartStub.callCount).equals(1, 'should start the server');
  });

  it('stop', async () => {
    const mock = new Mock(this.server);
    await mock.stop();
    expect(this.serverStopStub.callCount).equals(1, 'should stop the server');
  });

  it('addDefaultMockInteraction - valid', () => {
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
    const mock = new Mock(this.server);
    const id = mock.addDefaultMockInteraction(rawInteraction);
    expect(id).to.equals('random');
    expect(this.serverAddMockInteractionStub.callCount).equals(1, 'should add a default mock interaction');
  });

  it('addDefaultMockInteraction - invalid', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteraction = {};
    const mock = new Mock(this.server);
    expect(() => { mock.addDefaultMockInteraction(rawInteraction); }).throws('Invalid interaction request provided - undefined');
  });

  it('addDefaultPactInteraction - valid', () => {
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
    const mock = new Mock(this.server);
    const id = mock.addDefaultPactInteraction(rawInteraction);
    expect(id).to.equals('random');
    expect(this.serverAddPactInteractionStub.callCount).equals(1, 'should add a default pact interaction');
  });

  it('addDefaultPactInteraction - invalid', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteraction = {};
    const mock = new Mock(this.server);
    expect(() => { mock.addDefaultPactInteraction(rawInteraction); }).throws('Invalid provider name provided - undefined');
  });

  it('removeDefaultMockInteraction - invalid interaction id', () => {
    const mock = new Mock(this.server);
    expect(() => { mock.removeDefaultInteraction(null); }).throws('Invalid interaction id - null');
  });

  it('removeDefaultMockInteraction - invalid interaction id', () => {
    const mock = new Mock(this.server);
    expect(() => { mock.removeDefaultInteraction(''); }).throws('Invalid interaction id - ');
  });

  it('removeDefaultMockInteraction - invalid interaction id', () => {
    const mock = new Mock(this.server);
    expect(() => { mock.removeDefaultInteraction(); }).throws('Invalid interaction id - undefined');
  });

  it('removeDefaultInteraction', () => {
    const mock = new Mock(this.server);
    mock.removeDefaultInteraction('id');
    expect(this.serverRemoveInteractionStub.callCount).equals(1, 'should remove default mock interaction');
    expect(this.serverRemoveInteractionStub.args[0]).deep.equals(['id']);
  });

  it('clearDefaultInteractions - no interactions', () => {
    const mock = new Mock(this.server);
    mock.clearDefaultInteractions();
    expect(this.serverRemoveInteractionStub.callCount).equals(0, 'should not remove default interactions');
  });

  it('clearDefaultInteractions - no interactions', () => {
    const mock = new Mock(this.server);
    mock.interactionIds.add('1');
    mock.clearDefaultInteractions();
    expect(this.serverRemoveInteractionStub.callCount).equals(1, 'should not remove default interactions');
  });

  it('addDefaultMockInteractions - single - valid', () => {
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
    const mock = new Mock(this.server);
    const id = mock.addDefaultMockInteractions(rawInteractions);
    expect(id).to.deep.equals(['random']);
    expect(this.serverAddMockInteractionStub.callCount).equals(1, 'should add a default mock interaction');
  });

  it('addDefaultMockInteractions - multiples - valid', () => {
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
    const mock = new Mock(this.server);
    const id = mock.addDefaultMockInteractions(rawInteractions);
    expect(id).to.deep.equals(['random', 'random']);
    expect(this.serverAddMockInteractionStub.callCount).equals(2, 'should add two default mock interactions');
  });

  it('addDefaultMockInteractions - invalid', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteraction = {};
    const mock = new Mock(this.server);
    expect(() => { mock.addDefaultMockInteractions(rawInteraction); }).throws('Invalid mock interactions array passed');
  });

  it('addDefaultPactInteractions - single - valid', () => {
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
    const mock = new Mock(this.server);
    const id = mock.addDefaultPactInteractions(rawInteractions);
    expect(id).to.deep.equals(['random']);
    expect(this.serverAddPactInteractionStub.callCount).equals(1, 'should add a default pact interaction');
  });

  it('addDefaultPactInteractions - multiples - valid', () => {
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
    const mock = new Mock(this.server);
    const id = mock.addDefaultPactInteractions(rawInteractions);
    expect(id).to.deep.equals(['random', 'random']);
    expect(this.serverAddPactInteractionStub.callCount).equals(2, 'should add two default pact interactions');
  });

  it('addDefaultPactInteractions - invalid', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteraction = {};
    const mock = new Mock(this.server);
    expect(() => { mock.addDefaultPactInteractions(rawInteraction); }).throws('Invalid pact interactions array passed');
  });

  afterEach(() => {
    sandbox.restore();
  });

  after(() => {
    config.pact.consumer = '';
  });

});