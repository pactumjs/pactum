const expect = require('chai').expect;
const pactum = require('../../src/index');
const handler = pactum.handler;

describe('E2E', () => {

  before(() => {
    handler.addInteractionHandler('get user', () => {
      return {
        request: {
          method: 'GET',
          path: '/api/users/1'
        },
        response: {
          status: 200,
          body: {
            id: 1
          }
        }
      };
    });
    handler.addInteractionHandler('save user', () => {
      return {
        request: {
          method: 'POST',
          path: '/api/users'
        },
        response: {
          status: 200
        }
      };
    });
    handler.addInteractionHandler('delete user', () => {
      return {
        request: {
          method: 'DELETE',
          path: '/api/users/1'
        },
        response: {
          status: 200
        }
      };
    });
    handler.addSpecHandler('User.AddUser', (ctx) => {
      const spec = ctx.spec;
      spec.useInteraction('save user');
      spec.post('http://localhost:9393/api/users');
      spec.expectStatus(200);
    });
    handler.addSpecHandler('User.DeleteUser', (ctx) => {
      const spec = ctx.spec;
      spec.useInteraction('delete user');
      spec.delete('http://localhost:9393/api/users/1');
      spec.expectStatus(200);
    });
    handler.addSpecHandler('User.GetUser', (ctx) => {
      const spec = ctx.spec;
      spec.useInteraction('get user');
      spec.get('http://localhost:9393/api/users/1');
      spec.expectStatus(200);
    });
  });

  describe('E2E - All Passed', () => {

    before(() => {
      this.e2e = pactum.e2e('Add User All Passed');
    });

    it('save user', async () => {
      await this.e2e.step('Save User')
        .spec()
        .useInteraction('save user')
        .post('http://localhost:9393/api/users')
        .expectStatus(200)
        .clean()
        .useInteraction('delete user')
        .delete('http://localhost:9393/api/users/1')
        .expectStatus(200);
    });

    it('get user', async () => {
      await this.e2e.step('Get User')
        .spec()
        .useInteraction('get user')
        .get('http://localhost:9393/api/users/1')
        .expectStatus(200);
    });

    it('clean up', async () => {
      await this.e2e.cleanup();
    });

  });

  describe('E2E - First Step Failed', () => {

    before(() => {
      this.e2e = pactum.e2e('Add User First Step Failed');
    });

    it('save user', async () => {
      let err;
      try {
        await this.e2e.step('Save User')
          .spec()
          .useInteraction('save user')
          .post('http://localhost:9393/api/users')
          .expectStatus(400)
          .clean()
          .useInteraction('delete user')
          .delete('http://localhost:9393/api/users/1')
          .expectStatus(200);
      } catch (error) {
        err = error;
      }
      expect(err).not.undefined;
    });

    it('should skip this `e2e.step`', async () => {
      await this.e2e.step('Get User')
        .spec()
        .useInteraction('get user')
        .get('http://localhost:9393/api/users/1')
        .expectStatus(400);
    });

    it('clean up', async () => {
      await this.e2e.cleanup();
    });

  });

  describe('E2E - One Clean Up Failed', () => {

    before(() => {
      this.e2e = pactum.e2e('Add Multiple Users');
    });

    it('save user one', async () => {
      await this.e2e.step('Save User One')
        .spec()
        .useInteraction('save user')
        .post('http://localhost:9393/api/users')
        .expectStatus(200)
        .clean()
        .useInteraction('delete user')
        .delete('http://localhost:9393/api/users/1')
        .expectStatus(200);
    });

    it('save user two', async () => {
      await this.e2e.step('Save User One')
        .spec()
        .useInteraction('save user')
        .post('http://localhost:9393/api/users')
        .expectStatus(200)
        .clean()
        .useInteraction('delete user')
        .delete('http://localhost:9393/api/users/1')
        .expectStatus(400);
    });

    it('get user', async () => {
      await this.e2e.step('Get User')
        .spec()
        .useInteraction('get user')
        .get('http://localhost:9393/api/users/1')
        .expectStatus(200);
    });

    it('clean up', async () => {
      let err;
      try {
        await this.e2e.cleanup();
      } catch (error) {
        err = error;
      }
      expect(err).not.undefined;
    });

  });

  describe('E2E - All Clean Ups Failed', () => {

    before(() => {
      this.e2e = pactum.e2e('Add Multiple Users');
    });

    it('save user one', async () => {
      await this.e2e.step('Save User One')
        .spec()
        .useInteraction('save user')
        .post('http://localhost:9393/api/users')
        .expectStatus(200)
        .clean()
        .useInteraction('delete user')
        .delete('http://localhost:9393/api/users/1')
        .expectStatus(400);
    });

    it('save user two', async () => {
      await this.e2e.step('Save User Two')
        .spec()
        .useInteraction('save user')
        .post('http://localhost:9393/api/users')
        .expectStatus(200)
        .clean()
        .useInteraction('delete user')
        .delete('http://localhost:9393/api/users/1')
        .expectStatus(400);
    });

    it('get user', async () => {
      await this.e2e.step('Get User')
        .spec()
        .useInteraction('get user')
        .get('http://localhost:9393/api/users/1')
        .expectStatus(200);
    });

    it('clean up', async () => {
      let err;
      try {
        await this.e2e.cleanup();
      } catch (error) {
        err = error;
      }
      expect(err).not.undefined;
    });

  });

  describe('E2E - Using Spec Handlers', () => {

    before(() => {
      this.e2e = pactum.e2e('Add User All Clean Ups Failed');
    });

    it('save user', async () => {
      await this.e2e
        .step('Save User')
        .spec('User.AddUser')
        .clean('User.DeleteUser');
    });

    it('get user', async () => {
      await this.e2e
        .step('Get User')
        .spec('User.GetUser');
    });

    it('clean up', async () => {
      await this.e2e.cleanup();
    });

  });

  describe('E2E - Multiple Specs in a single Step', () => {

    before(() => {
      this.e2e = pactum.e2e('Add User Multiple Specs');
    });

    it('save & get & delete user', async () => {
      const step = this.e2e.step('User Workflow');
      await step.spec('User.AddUser');
      await step.spec('User.GetUser');
      await step.spec('User.DeleteUser');
    });

  });

  describe('E2E - Multiple Specs in a single Step & a clean', () => {

    before(() => {
      this.e2e = pactum.e2e('Add User Single Step & Clean');
    });

    it('save & get & delete user', async () => {
      const step = this.e2e.step('User Workflow');
      await step.spec('User.AddUser');
      await step.spec('User.GetUser');
      await step.clean('User.DeleteUser');
    });

    it('cleanup', async () => {
      await this.e2e.cleanup();
    });

  });

  describe('E2E - One step fails in a step', () => {

    before(() => {
      this.e2e = pactum.e2e('Add User One Step Fails');
    });

    it('save & get & delete user', async () => {
      let err;
      try {
        const step = this.e2e.step('User Workflow');
        await step.spec('User.AddUser');
        await step.spec('User.GetUser').expectStatus(400);
        await step.spec('User.DeleteUser');
      } catch (error) {
        err = error;
      }
      expect(err).not.undefined;
    });

    it('should skip this `e2e.step`', async () => {
      const step = this.e2e.step('User Workflow');
      await step.spec('User.AddUser');
      await step.spec('User.GetUser').expectStatus(400);
      step.clean('User.DeleteUser');
    });

    it('cleanup', async () => {
      await this.e2e.cleanup();
    });

  });

  describe('E2E - With Initializers & Cleanups', () => {

    before(async () => {
      handler.addInitializeHandler('Authorize', () => { });
      handler.addCleanupHandler('UnAuthorize', () => { });
      this.e2e = pactum.e2e('E2E with Initializers & Cleanups');
      await this.e2e.init();
    });

    it('save user', async () => {
      await this.e2e
        .step('Save User')
        .spec('User.AddUser')
        .clean('User.DeleteUser');
    });

    it('get user', async () => {
      await this.e2e
        .step('Get User')
        .spec('User.GetUser');
    });

    it('clean up', async () => {
      await this.e2e.cleanup();
    });

  });

  describe('E2E - With Initializer Fails', () => {

    before(async () => {
      handler.addInitializeHandler('Authorize', () => { throw 'Failed'; });
      handler.addCleanupHandler('UnAuthorize', () => { });
      this.e2e = pactum.e2e('E2E with Initializers & Cleanups');
    });

    it('init failed', async () => {
      let err;
      try {
        await this.e2e.init();
      } catch (error) {
        err = error;
      }
      expect(err).not.undefined;
    });

    it('clean up', async () => {
      await this.e2e.cleanup();
    });

  });

  describe('E2E - With Initializer Fails', () => {

    before(async () => {
      handler.addInitializeHandler('Authorize', () => { });
      handler.addCleanupHandler('UnAuthorize', () => { throw 'Failed'; });
      this.e2e = pactum.e2e('E2E with Initializers & Cleanups');
    });

    it('clean up failed', async () => {
      let err;
      try {
        await this.e2e.cleanup();
      } catch (error) {
        err = error;
      }
      expect(err).not.undefined;
    });

  });

  after(() => {
    handler.addInitializeHandler('Authorize', () => { });
    handler.addCleanupHandler('UnAuthorize', () => { });
  });

});