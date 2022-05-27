const { spec } = require('../../src/index');
const { like } = require('pactum-matchers');
const { expect } = require('chai');

describe('Form', () => {

  it('single pair of form data', async () => {
    await spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/projects',
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          form: {
            'user': 'drake'
          }
        },
        response: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/projects')
      .withForm({ 'user': 'drake' })
      .expectStatus(200);
  });

  it('multiple pairs of form data', async () => {
    await spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/projects',
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          form: {
            'user': 'drake',
            'age': '10'
          }
        },
        response: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/projects')
      .withForm({ 'user': 'drake', 'age': 10 })
      .expectStatus(200);
  });

  it('using matchers', async () => {
    await spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/projects',
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          form: {
            'user': like('drake')
          }
        },
        response: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/projects')
      .withForm({ 'user': 'brake' })
      .expectStatus(200);
  });

  it('fails to match', async () => {
    let err;
    try {
      await spec()
        .useInteraction({
          request: {
            method: 'POST',
            path: '/api/projects',
            headers: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            form: {
              'user': 'drake'
            }
          },
          response: {
            status: 200
          }
        })
        .post('http://localhost:9393/api/projects')
        .withForm({ 'user': 'drake', 'age': 10 })
        .useLogLevel('SILENT')
        .expectStatus(200);
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

  it('disabling strict', async () => {
    await spec()
      .useInteraction({
        strict: false,
        request: {
          method: 'POST',
          path: '/api/projects',
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          form: {
            'user': 'drake'
          }
        },
        response: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/projects')
      .withForm({ 'user': 'drake', 'age': 10 })
      .expectStatus(200);
  });

});