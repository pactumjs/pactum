const pactum = require('../../src/index');
const handler = pactum.handler;

describe('E2E', () => {

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
    this.e2e = pactum.e2e('Add User');
  });

  it('save user', async () => {
    this.e2e.step('Save User')
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
    this.e2e.step('Get User')
      .spec()
      .useMockInteraction('get user')
      .get('http://localhost:9393/api/users/1')
      .expectStatus(200);
  });

  after(async () => {
    await this.e2e.clean();
  });

});