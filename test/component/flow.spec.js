const pactum = require('../../src/index');
const expect = require('chai').expect;

describe('Flow', () => {

  it('GET - without query', async () => {
    await pactum.flow('first flow')
      .useInteraction('default flow get')
      .get('http://localhost:9393/default/get')
      .expectStatus(200)
      .toss();
  });

  it('no flow name', async () => {
    let err;
    try {
      await pactum.flow()
      .get('http://localhost:9393/default/get')
      .expectStatus(200);
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

  it('empty flow name', async () => {
    let err;
    try {
      await pactum.flow('')
      .get('http://localhost:9393/default/get')
      .expectStatus(200);
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

});