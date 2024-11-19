const { expect } = require('chai');
const { spec, handler } = require('../../src/index');

describe('Response Handler', () => {

  it('response handler', async () => {
    let ran = false;
    handler.addResponseHandler('test', async (ctx) => {
      ran = true;
    });
    await spec()
      .get('http://localhost:9393/api/users/1')
      .useResponseHandler('test');
    expect(ran).equals(true);
  });

})