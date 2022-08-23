const { spec, stash, handler } = require('../../src/index');
const { like } = require('pactum-matchers');
const { expect } = require('chai');

describe('Form', () => {

  before(() => {
    handler.addInteractionHandler('post form data', () => {
      return {
        request: {
          method: 'POST',
          path: '/api/projects/form',
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          form: {
            'user': 'drake',
            'age': '10',
            'job': 'leader'
          }
        },
        response: {
          status: 200
        }
      }
    });
    stash.addDataTemplate({
      FORM: { 'user': 'drake', 'age': 10, 'job': 'leader' }
    });
  });

  after(() => {
    stash.clearDataTemplates();
  });

  it('submit form data as an object in a single method', async () => {
    await spec()
      .useInteraction('post form data')
      .post('http://localhost:9393/api/projects/form')
      .withForm({ 'user': 'drake', 'age': 10, 'job': 'leader' })
      .expectStatus(200);
  });

  it('submit form data as an object and kv pairs using independent methods', async () => {
    await spec()
      .useInteraction('post form data')
      .post('http://localhost:9393/api/projects/form')
      .withForm({ 'user': 'drake' })
      .withForm({ 'age': '10' })
      .withForm('job', 'leader')
      .expectStatus(200);
  });

  it('submit form data as an object using data template', async () => {
    await spec()
      .useInteraction('post form data')
      .post('http://localhost:9393/api/projects/form')
      .withForm({ '@DATA:TEMPLATE@': 'FORM' })
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