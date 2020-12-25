const expect = require('chai').expect;
const pactum = require('../../src/index');
const reporter = pactum.reporter;

const jr = {
  afterSpec() { },
  afterStep() { },
  afterTest() { },
  end() { }
};

describe('Reporter', () => {

  before(() => {
    reporter.add(jr);
  });

  describe('Specs', () => {

    it('passed', () => {
      return pactum.spec()
        .useInteraction('default get')
        .get('http://localhost:9393/default/get')
        .expectStatus(200);
    });

    it('failed', async () => {
      let err;
      try {
        await pactum.spec()
          .useInteraction('default get')
          .get('http://localhost:9393/ohh')
          .expectStatus(200);
      } catch (error) {
        err = error;
      }
      expect(err).not.undefined;
    });

  });

  describe('E2E', () => {
    this.test = pactum.e2e('e2e test');

    it('one step', () => {
      this.test.step('one step')
        .spec()
        .useInteraction('default get')
        .get('http://localhost:9393/default/get')
        .expectStatus(200);
    });

    it('cleanup', async () => {
      await this.test.cleanup();
    });

  });

  after(async () => {
    await reporter.end();
    reporter.get().length = 0;
  });

});