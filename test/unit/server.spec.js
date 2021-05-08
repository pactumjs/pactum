const expect = require('chai').expect;
const Server = require('../../src/models/server');

describe('Server', () => {

  it('starting server multiple times should not throw error', async () => {
    const server = new Server();
    await server.start();
    await server.start();
    await server.stop();
  });

  it('stopping server multiple times should not throw error', async () => {
    const server = new Server();
    await server.start();
    await server.stop();
    await server.stop();
  });

  it('removing invalid interaction should not throw error', async () => {
    const server = new Server();
    server.removeInteraction('abc');
  });

  it('get invalid interaction should return null', async () => {
    const server = new Server();
    const id = server.getInteraction('abc');
    expect(id).is.null;
  });

});