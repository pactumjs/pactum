const expect = require('chai').expect;
const pactum = require('../../src/index');
const handler = pactum.handler;

before(() => {
  handler.addMockInteractionHandler('get user', () => {
    return {
      withRequest: {
        method: 'GET',
        path: '/api/users/1'
      },
      willRespondWith: {
        status: 200,
        body: {
          id: 1
        }
      }
    }
  });
  handler.addMockInteractionHandler('save user', () => {
    return {
      withRequest: {
        method: 'POST',
        path: '/api/users'
      },
      willRespondWith: {
        status: 200
      }
    }
  });
  handler.addMockInteractionHandler('delete user', () => {
    return {
      withRequest: {
        method: 'DELETE',
        path: '/api/users/1'
      },
      willRespondWith: {
        status: 200
      }
    }
  });
});

describe('E2E - All Passed', () => {

  before(() => {
    this.e2e = pactum.e2e('Add User');
  });

  it('save user', async () => {
    await this.e2e.step('Save User')
      .spec()
      .useMockInteraction('save user')
      .post('http://localhost:9393/api/users')
      .expectStatus(200)
      .clean()
      .useMockInteraction('delete user')
      .delete('http://localhost:9393/api/users/1')
      .expectStatus(200);
  });

  it('get user', async () => {
    await this.e2e.step('Get User')
      .spec()
      .useMockInteraction('get user')
      .get('http://localhost:9393/api/users/1')
      .expectStatus(200);
  });

  it('clean up', async () => {
    await this.e2e.cleanup();
  });

});

describe('E2E - First Step Failed', () => {

  before(() => {
    this.e2e = pactum.e2e('Add User');
  });

  it('save user', async () => {
    try {
      await this.e2e.step('Save User')
        .spec()
        .useMockInteraction('save user')
        .post('http://localhost:9393/api/users')
        .expectStatus(400)
        .clean()
        .useMockInteraction('delete user')
        .delete('http://localhost:9393/api/users/1')
        .expectStatus(200);
    } catch (error) {
      expect(error).not.undefined;
    }
  });

  it('get user', async () => {
    await this.e2e.step('Get User')
      .spec()
      .useMockInteraction('get user')
      .get('http://localhost:9393/api/users/1')
      .expectStatus(200);
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
      .useMockInteraction('save user')
      .post('http://localhost:9393/api/users')
      .expectStatus(200)
      .clean()
      .useMockInteraction('delete user')
      .delete('http://localhost:9393/api/users/1')
      .expectStatus(200);
  });

  it('save user two', async () => {
    await this.e2e.step('Save User One')
      .spec()
      .useMockInteraction('save user')
      .post('http://localhost:9393/api/users')
      .expectStatus(200)
      .clean()
      .useMockInteraction('delete user')
      .delete('http://localhost:9393/api/users/1')
      .expectStatus(400);
  });

  it('get user', async () => {
    await this.e2e.step('Get User')
      .spec()
      .useMockInteraction('get user')
      .get('http://localhost:9393/api/users/1')
      .expectStatus(200);
  });

  it('clean up', async () => {
    try {
      await this.e2e.cleanup();  
    } catch (error) {
      expect(error).not.undefined;      
    }
  });

});

describe('E2E - All Clean Ups Failed', () => {

  before(() => {
    this.e2e = pactum.e2e('Add Multiple Users');
  });

  it('save user one', async () => {
    await this.e2e.step('Save User One')
      .spec()
      .useMockInteraction('save user')
      .post('http://localhost:9393/api/users')
      .expectStatus(200)
      .clean()
      .useMockInteraction('delete user')
      .delete('http://localhost:9393/api/users/1')
      .expectStatus(400);
  });

  it('save user two', async () => {
    await this.e2e.step('Save User One')
      .spec()
      .useMockInteraction('save user')
      .post('http://localhost:9393/api/users')
      .expectStatus(200)
      .clean()
      .useMockInteraction('delete user')
      .delete('http://localhost:9393/api/users/1')
      .expectStatus(400);
  });

  it('get user', async () => {
    await this.e2e.step('Get User')
      .spec()
      .useMockInteraction('get user')
      .get('http://localhost:9393/api/users/1')
      .expectStatus(200);
  });

  it('clean up', async () => {
    try {
      await this.e2e.cleanup();  
    } catch (error) {
      expect(error).not.undefined;      
    }
  });

});