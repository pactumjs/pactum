const { spec, stash, handler } = require('../../src/index');
const { includes } = require('pactum-matchers');
const FormData = require('form-data-lite');

describe('Multi Part FormData', () => {

  before(() => {
    handler.addInteractionHandler('post form data', () => {
      return {
        request: {
          method: 'POST',
          path: '/api/projects/form',
          headers: {
            'content-type': includes('multipart/form-data; boundary=-')
          },
          body: includes('age')
        },
        response: {
          status: 200
        }
      }
    });
    handler.addInteractionHandler('post form data with file', () => {
      return {
        request: {
          method: 'POST',
          path: '/api/projects/form',
          headers: {
            'content-type': includes('multipart/form-data; boundary=-')
          },
          body: includes('file')
        },
        response: {
          status: 200
        }
      }
    });
    stash.addDataTemplate({
      FORM: { 'user': 'drake', 'age': '10', 'job': 'leader' }
    });
  });

  after(() => {
    stash.clearDataTemplates();
  });

  it('submit form data as an object in a single method', async () => {
    await spec()
      .useInteraction('post form data')
      .post('http://localhost:9393/api/projects/form')
      .withMultiPartFormData({ 'user': 'drake', 'age': 10, 'job': 'leader' })
      .expectStatus(200);
  });

  it('submit form data as kv pair and object in a multiple method', async () => {
    await spec()
      .useInteraction('post form data')
      .post('http://localhost:9393/api/projects/form')
      .withMultiPartFormData('user', 'drake')
      .withMultiPartFormData({ 'age': 10, 'job': 'leader' })
      .expectStatus(200);
  });

  it('submit form data as using form-data object', async () => {
    const form = new FormData();
    form.append('user', 'drake');
    await spec()
      .useInteraction('post form data')
      .post('http://localhost:9393/api/projects/form')
      .withMultiPartFormData(form)
      .withMultiPartFormData({ 'age': 10, 'job': 'leader' })
      .expectStatus(200);
  });

  it('submit form data with file', async () => {
    await spec()
      .useInteraction('post form data with file')
      .post('http://localhost:9393/api/projects/form')
      .withMultiPartFormData({ 'user': 'drake', 'age': 10, 'job': 'leader' })
      .withFile('file', './test/component/base.spec.js', { contentType: 'application/js', filename: 'interactions.spec.js' })
      .expectStatus(200);
  });

  it('submit form data as a data template object', async () => {
    await spec()
      .useInteraction('post form data')
      .post('http://localhost:9393/api/projects/form')
      .withMultiPartFormData({ '@DATA:TEMPLATE@': 'FORM' })
      .expectStatus(200);
  });

});