const config = require('../../src/config');
const pactum = require('../../src/index');
const { addInteractionHandler } = pactum.handler;
const { expect } = require('chai');

describe('Non CRUD Requests', () => {

  before(() => {
    addInteractionHandler('get bg', () => {
      return {
        background: true,
        request: {
          method: 'GET',
          path: '/api/bg'
        },
        response: {
          status: 200
        }
      }
    });
    config.response.wait.duration = 10;
    config.response.wait.polling = 1;
  });

  it('should exercise bg interaction without wait', async () => {
    await pactum.spec()
      .useInteraction('get bg')
      .get('http://localhost:9393/api/bg')
      .expectStatus(200);
  });

  it('should exercise bg interaction with default wait', async () => {
    await pactum.spec()
      .useInteraction('get bg')
      .get('http://localhost:9393/api/bg')
      .expectStatus(200)
      .wait();
  });

  it('should fail with response exceptions when bg interactions are present', async () => {
    let err;
    try {
      await pactum.spec()
        .useLogLevel('ERROR')
        .useInteraction('get bg')
        .get('http://localhost:9393/api/bg/fake')
        .expectStatus(200);
    } catch (error) {
      err = error
    }
    expect(err.message).equals('HTTP status 404 !== 200');
  });

  it('should fail when bg interactions are not exercised without any waits', async () => {
    let err;
    try {
      await pactum.spec()
        .useLogLevel('ERROR')
        .useInteraction('get bg')
        .get('http://localhost:9393/api/bg/fake')
        .expectStatus(404);
    } catch (error) {
      err = error
    }
    expect(err.message).equals('Interaction not exercised: GET - /api/bg');
  });

  it('should fail when bg interactions are not exercised with default waits', async () => {
    let err;
    try {
      await pactum.spec()
        .useLogLevel('ERROR')
        .useInteraction('get bg')
        .get('http://localhost:9393/api/bg/fake')
        .expectStatus(404)
        .wait();
    } catch (error) {
      err = error
    }
    expect(err.message).equals('Interaction not exercised: GET - /api/bg');
  });

  it('should fail when bg interactions are not exercised with custom wait with duration', async () => {
    let err;
    try {
      await pactum.spec()
        .useLogLevel('ERROR')
        .useInteraction('get bg')
        .get('http://localhost:9393/api/bg/fake')
        .expectStatus(404)
        .wait(20);
    } catch (error) {
      err = error
    }
    expect(err.message).equals('Interaction not exercised: GET - /api/bg');
  });

  it('should fail when bg interactions are not exercised with custom wait with duration and polling', async () => {
    let err;
    try {
      await pactum.spec()
        .useLogLevel('ERROR')
        .useInteraction('get bg')
        .get('http://localhost:9393/api/bg/fake')
        .expectStatus(404)
        .wait(20, 7);
    } catch (error) {
      err = error
    }
    expect(err.message).equals('Interaction not exercised: GET - /api/bg');
  });

});