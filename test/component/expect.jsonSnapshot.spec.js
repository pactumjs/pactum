const { like } = require('pactum-matchers');
const { spec } = require('../../src/index');
const fs = require('fs');
const ce = require('chai').expect;

describe('expectations - json snapshot', () => {

  describe('builder style - expectJsonSnapshot', () => {

    before(async () => {
      await spec()
        .useInteraction('get people')
        .name('json snapshot - deep equal')
        .get('http://localhost:9393/api/people')
        .expectStatus(200)
        .expectJsonSnapshot();
      await spec()
        .useInteraction('get user with id 1')
        .name('json snapshot - with matchers')
        .get('http://localhost:9393/api/users/1')
        .expectStatus(200)
        .expectJsonSnapshot({
          id: like(1)
        });
    });

    after(async () => {
      fs.unlinkSync(`.pactum/snapshots/json snapshot - deep equal.json`);
      fs.unlinkSync(`.pactum/snapshots/json snapshot - with matchers.json`);
    });

    it('should validate snapshot successfully', async () => {
      await spec()
        .useInteraction('get people')
        .name('json snapshot - deep equal')
        .get('http://localhost:9393/api/people')
        .expectStatus(200)
        .expectJsonSnapshot();
    });

    it('should not validate snapshot successfully when response does not match', async () => {
      let err;
      try {
        await pactum.spec()
          .useInteraction('get user with id 1')
          .name('json snapshot - deep equal')
          .get('http://localhost:9393/api/users/1')
          .expectStatus(200)
          .expectJsonSnapshot()
          .useLogLevel('ERROR');
      } catch (error) {
        err = error;
      }
      ce(err).not.undefined;
    });

    it('should validate snapshot successfully with matchers', async () => {
      await spec()
        .useInteraction('get user with id 1')
        .name('json snapshot - with matchers')
        .get('http://localhost:9393/api/users/1')
        .expectStatus(200)
        .expectJsonSnapshot({
          id: like(1)
        });
    });

  });

  describe('bdd style - jsonSnapshot', () => {

    before(async () => {
      await spec()
        .useInteraction('get people')
        .name('json snapshot - deep equal')
        .get('http://localhost:9393/api/people')
        .expectStatus(200)
        .expectJsonSnapshot();
      await spec()
        .useInteraction('get user with id 1')
        .name('json snapshot - with matchers')
        .get('http://localhost:9393/api/users/1')
        .expectStatus(200)
        .expectJsonSnapshot({
          id: like(1)
        });
    });

    after(async () => {
      fs.unlinkSync(`.pactum/snapshots/json snapshot - deep equal.json`);
      fs.unlinkSync(`.pactum/snapshots/json snapshot - with matchers.json`);
    });

    it('should validate snapshot successfully', async () => {
      const http = spec();
      http.useInteraction('get people');
      http.get('http://localhost:9393/api/people');
      await http.toss();
      http.response().should.have.jsonSnapshot('json snapshot - deep equal');
    });

    it('should not validate snapshot successfully when response does not match', async () => {
      const http = spec();
      http.useInteraction('get user with id 1');
      http.get('http://localhost:9393/api/users/1');
      await http.toss();
      let err;
      try {
        http.response().should.have.jsonSnapshot('json snapshot - deep equal')
      } catch (error) {
        err = error;
      }
      ce(err).not.to.be.undefined;
    });

    it('should validate snapshot successfully with matchers', async () => {
      const http = spec();
      http.useInteraction('get user with id 1');
      http.get('http://localhost:9393/api/users/1');
      await http.toss();
      http.response().should.have.jsonSnapshot('json snapshot - with matchers', { id: like(1) });
    });

    it('should validate snapshot successfully with multiple matchers', async () => {
      const http = spec();
      http.useInteraction('get user with id 1');
      http.get('http://localhost:9393/api/users/1');
      await http.toss();
      http.response().should.have.jsonSnapshot('json snapshot - with matchers', { id: like(1) });
      http.response().should.have.jsonSnapshot('json snapshot - with matchers', { name: like('snow') });
    });

    it('should not validate snapshot successfully when matchers fail', async () => {
      const http = spec();
      http.useInteraction('get user with id 1');
      http.get('http://localhost:9393/api/users/1');
      await http.toss();
      let err;
      try {
        http.response().should.have.jsonSnapshot('json snapshot - with matchers', { id: like('1') })
      } catch (error) {
        err = error;
      }
      ce(err).not.to.be.undefined;
    });

  });

});