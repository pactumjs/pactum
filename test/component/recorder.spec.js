const pactum = require('../../src/index');
const request = pactum.request;

describe('Default Recorder', () => {

  before(() => {
    request.setDefaultRecorders('TraceId', 'req.headers.x-trace-id');
    request.setDefaultRecorders('Method', 'req.body.method');
    request.setDefaultRecorders('Connection', 'res.headers.connection');
    request.setDefaultRecorders('Path', 'res.body.path');
  });

  it('res header data to recorder', async () => {
    await pactum.spec()
      .useMockInteraction('default get')
      .get('http://localhost:9393/default/get')
      .expectStatus(200);
  });

  it('req header & res body to recorder', async () => {
    await pactum.spec()
      .useMockInteraction('default get')
      .get('http://localhost:9393/default/get')
      .withHeaders('x-trace-id', 'id')
      .expectStatus(200);
  });

  it('req body data to recorder', async () => {
    await pactum.spec()
      .useMockInteraction('default post')
      .post('http://localhost:9393/default/post')
      .withJson({
        method: 'POST',
        path: '/default/post'
      })
      .expectStatus(200);
  });

  after(() => {
    request.getDefaultRecorders().length = 0;
  });

});

describe('Recorder', () => {

  it('res header data to recorder', async () => {
    await pactum.spec()
      .useMockInteraction('default get')
      .get('http://localhost:9393/default/get')
      .records('Method', 'method')
      .records('Path', 'res.body.path')
      .expectStatus(200);
  });

  it('res header data to recorder using capture handler', async () => {
    pactum.handler.addCaptureHandler('GetMethod', ({ res }) => res.json.method);
    await pactum.spec()
      .useMockInteraction('default get')
      .get('http://localhost:9393/default/get')
      .records('Method', '#GetMethod')
      .records('Path', 'res.body.path')
      .expectStatus(200);
  });

  after(() => {
    request.getDefaultRecorders().length = 0;
  });

});