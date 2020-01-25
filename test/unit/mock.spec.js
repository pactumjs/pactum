const expect = require('chai').expect;
const sandbox = require('sinon').createSandbox();

const Server = require('../../src/models/server');

const Mock = require('../../src/exports/mock');
const helper = require('../../src/helpers/helper');

describe('Mock', () => {

  beforeEach(() => {
    this.server = new Server();
    this.serverStartStub = sandbox.stub(Server.prototype, 'start');
    this.serverStopStub = sandbox.stub(Server.prototype, 'stop');
    this.serverAddDefaultMockInteractionStub = sandbox.stub(Server.prototype, 'addDefaultMockInteraction');
    this.serverRemoveDefaultMockInteractionStub = sandbox.stub(Server.prototype, 'removeDefaultMockInteraction');
    this.serverRemoveDefaultMockInteractionsStub = sandbox.stub(Server.prototype, 'removeDefaultMockInteractions');
    this.helperGetRandomIdStub = sandbox.stub(helper, 'getRandomId');
  });

  it('start - invalid port number - string', () => {
    const mock = new Mock(this.server);
    expect(() => { mock.start('2333'); }).throws('Invalid port number given to start the mock server - 2333');
    expect(this.serverStartStub.callCount).equals(0, 'should not start the server');
  });

  it('start - invalid port number - null', () => {
    const mock = new Mock(this.server);
    expect(() => { mock.start(null); }).throws('Invalid port number given to start the mock server - null');
    expect(this.serverStartStub.callCount).equals(0, 'should not start the server');
  });

  it('start - no port number', async () => {
    const mock = new Mock(this.server);
    await mock.start();
    expect(this.serverStartStub.callCount).equals(1, 'should start the server');
    expect(this.serverStartStub.args[0]).deep.equals([9393]);
  });

  it('start - with port number', async () => {
    const mock = new Mock(this.server);
    await mock.start(30000);
    expect(this.serverStartStub.callCount).equals(1, 'should start the server');
    expect(this.serverStartStub.args[0]).deep.equals([30000]);
  });

  it('stop - invalid port number - string', () => {
    const mock = new Mock(this.server);
    expect(() => { mock.stop('2333'); }).throws('Invalid port number given to stop the mock server - 2333');
    expect(this.serverStopStub.callCount).equals(0, 'should not stop the server');
  });

  it('stop - invalid port number - null', () => {
    const mock = new Mock(this.server);
    expect(() => { mock.stop(null); }).throws('Invalid port number given to stop the mock server - null');
    expect(this.serverStopStub.callCount).equals(0, 'should not stop the server');
  });

  it('stop - no port number', async () => {
    const mock = new Mock(this.server);
    await mock.stop();
    expect(this.serverStopStub.callCount).equals(1, 'should stop the server');
    expect(this.serverStopStub.args[0]).deep.equals([9393]);
  });

  it('stop - with port number', async () => {
    const mock = new Mock(this.server);
    await mock.stop(30000);
    expect(this.serverStopStub.callCount).equals(1, 'should stop the server');
    expect(this.serverStopStub.args[0]).deep.equals([30000]);
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
    }
    const mock = new Mock(this.server);
    const id = mock.addDefaultMockInteraction(rawInteraction);
    expect(id).to.equals('random');
    expect(this.serverAddDefaultMockInteractionStub.callCount).equals(1, 'should add a default mock interaction');
  });

  it('addDefaultMockInteraction - invalid', () => {
    this.helperGetRandomIdStub.returns('random');
    const rawInteraction = {}
    const mock = new Mock(this.server);
    expect(() => { mock.addDefaultMockInteraction(rawInteraction); }).throws('Invalid interaction request provided - undefined');
  });

  it('removeDefaultMockInteraction - invalid interaction id', () => {
    const mock = new Mock(this.server);
    expect(() => { mock.removeDefaultMockInteraction(null); }).throws('Invalid interaction id - null');
  });

  it('removeDefaultMockInteraction - invalid interaction id', () => {
    const mock = new Mock(this.server);
    expect(() => { mock.removeDefaultMockInteraction(''); }).throws('Invalid interaction id - ');
  });

  it('removeDefaultMockInteraction - invalid interaction id', () => {
    const mock = new Mock(this.server);
    expect(() => { mock.removeDefaultMockInteraction(); }).throws('Invalid interaction id - undefined');
  });

  it('removeDefaultMockInteraction - invalid port number', () => {
    const mock = new Mock(this.server);
    expect(() => { mock.removeDefaultMockInteraction('id', '233'); }).throws('Invalid port number - 233');
  });

  it('removeDefaultMockInteraction', () => {
    const mock = new Mock(this.server);
    mock.removeDefaultMockInteraction('id');
    expect(this.serverRemoveDefaultMockInteractionStub.callCount).equals(1, 'should remove default mock interaction');
    expect(this.serverRemoveDefaultMockInteractionStub.args[0]).deep.equals(['id', 9393]);
  });

  it('removeDefaultMockInteraction - with port number', () => {
    const mock = new Mock(this.server);
    mock.removeDefaultMockInteraction('id', 2333);
    expect(this.serverRemoveDefaultMockInteractionStub.callCount).equals(1, 'should remove default mock interaction');
    expect(this.serverRemoveDefaultMockInteractionStub.args[0]).deep.equals(['id', 2333]);
  });

  it('removeDefaultMockInteractions', () => {
    const mock = new Mock(this.server);
    mock.removeDefaultMockInteractions();
    expect(this.serverRemoveDefaultMockInteractionsStub.callCount).equals(1, 'should remove default mock interactions');
    expect(this.serverRemoveDefaultMockInteractionsStub.args[0]).deep.equals([9393]);
  });

  it('removeDefaultMockInteractions - with port number', () => {
    const mock = new Mock(this.server);
    mock.removeDefaultMockInteractions(2333);
    expect(this.serverRemoveDefaultMockInteractionsStub.callCount).equals(1, 'should remove default mock interactions');
    expect(this.serverRemoveDefaultMockInteractionsStub.args[0]).deep.equals([2333]);
  });

  afterEach(() => {
    sandbox.restore();
  });

});