const { spec } = require('../../src/index');
const { like } = require('pactum-matchers');
const { expect } = require('chai');

describe('Interactions - Clone', () => {

  const user = {
    name: like('guest')
  };

  it('should clone the data', async () => {
    await spec()
      .useInteraction({
        clone: true,
        request: {
          method: 'POST',
          path: '/api/users',
          body: user
        },
        response: {
          status: 200,
          body: user
        }
      })
      .post('http://localhost:9393/api/users')
      .withJson({
        name: 'guest'
      })
      .expectStatus(200);
    expect(user).deep.equals({ name: { value: 'guest', pactum_type: 'LIKE' } });
  });


});