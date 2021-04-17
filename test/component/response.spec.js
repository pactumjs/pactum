const pactum = require('../../src/index');
const { response } = pactum;
const config = require('../../src/config');
const { expect } = require('chai');

describe('Response', () => {

  it('with default expected response status', async () => {
    response.setDefaultExpectStatus(200);
    await pactum.spec()
      .useInteraction('default get')
      .get('http://localhost:9393/default/get');
  });

  it('with default expected response status - failure', async () => {
    response.setDefaultExpectStatus(200);
    let err;
    try {
      await pactum.spec()
        .get('http://localhost:9393/default/get');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('HTTP status 404 !== 200');
  });

  it('with default expected response status - override value', async () => {
    response.setDefaultExpectStatus(200);
    await pactum.spec()
      .get('http://localhost:9393/default/get')
      .expectStatus(404);
  });

  it('with default expected response time', async () => {
    response.setDefaultExpectResponseTime(1500);
    await pactum.spec()
      .useInteraction('default get')
      .get('http://localhost:9393/default/get');
  });

  it('with default expected response time - failure', async () => {
    response.setDefaultExpectResponseTime(-1);
    let err;
    try {
      await pactum.spec()
        .useInteraction('default get')
        .get('http://localhost:9393/default/get');
    } catch (error) {
      err = error;
    }
    expect(err.message).contains('Request took longer than -1ms');
  });

  it('with default expected response time - override value', async () => {
    response.setDefaultExpectResponseTime(-1);
    await pactum.spec()
      .useInteraction('default get')
      .get('http://localhost:9393/default/get')
      .expectResponseTime(1500);
  });

  it('with default expected response header', async () => {
    response.setDefaultExpectHeaders('connection', 'close');
    await pactum.spec()
      .useInteraction('default get')
      .get('http://localhost:9393/default/get');
  });

  it('with default expected response header - failure', async () => {
    response.setDefaultExpectHeaders('connection', 'open');
    let err;
    try {
      await pactum.spec()
        .useInteraction('default get')
        .get('http://localhost:9393/default/get');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Header value 'open' did not match for header 'connection': 'close'`);
  });

  it('with default expected response header - override value', async () => {
    response.setDefaultExpectHeaders('connection', 'open');
    await pactum.spec()
      .useInteraction('default get')
      .get('http://localhost:9393/default/get')
      .expectHeader('connection', 'close');
  });

  afterEach(() => {
    config.response.status = null;
    config.response.time = null;
    config.response.headers = {};
  });

});
