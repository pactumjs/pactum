const pactum = require('../../src/index');
const reporter = pactum.reporter;
const request = pactum.request;
const jr = require('../../src/plugins/json.reporter');

describe('Default Recorder', () => {

  before(() => {
    jr.reset();
    request.setDefaultRecorders('TraceId', 'req.headers.x-trace-id');
    request.setDefaultRecorders('Method', 'req.body.method');
    request.setDefaultRecorders('Connection', 'res.headers.connection');
    request.setDefaultRecorders('Path', 'res.body.path');
    reporter.enableJsonReporter('./reports', 'default-recorder-reporter.json');
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
    reporter.end();
    reporter.get().length = 0;
  });

});

describe('Recorder', () => {

  before(() => {
    jr.reset();
    reporter.enableJsonReporter('./reports', 'spec-recorder-reporter.json');
  });

  it('res header data to recorder', async () => {
    await pactum.spec()
      .useMockInteraction('default get')
      .get('http://localhost:9393/default/get')
      .records('Method', 'method')
      .records('Path', 'res.body.path')
      .expectStatus(200);
  });

  after(() => {
    request.getDefaultRecorders().length = 0;
    reporter.end();
    reporter.get().length = 0;
  });

});