const { spec, settings } = require('../../src');
const expect = require('chai').expect;

describe('Expects - expectJsonLike', () => {

  before(() => {
    settings.setDataDirectory('test/data');
  });

  after(() => {
    settings.setDataDirectory('data');
  });

  it('should validate simple json', async () => {
    await spec()
      .useInteraction('default get')
      .get('http://localhost:9393/default/get')
      .expectJsonLike({
        method: 'GET',
        path: '/default/get'
      });
  });

  it('should validate json from file', async () => {
    await spec()
      .useInteraction('default get')
      .get('http://localhost:9393/default/get')
      .expectJsonLike('default.get.response.json');
  });

  it('should fail with invalid path', async () => {
    let err;
    try {
      await spec()
        .useInteraction('default get')
        .get('http://localhost:9393/default/get')
        .expectJsonLike('invalid-file.json');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`File Not Found - 'invalid-file.json'`);
  });

  it('failed json like', async () => {
    let err;
    try {
      await spec()
        .get('http://localhost:9393/api/users/1')
        .expectJsonLike({ id: 1 })
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Json doesn't have type 'object' at '$' but found 'string'`);
  });

  it('json query like - on root object', async () => {
    await spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/users'
        },
        response: {
          status: 200,
          body: {
            people: [
              { name: 'Matt', country: 'NZ' },
              { name: 'Pete', country: 'AU' },
              { name: 'Mike', country: 'NZ' }
            ]
          }
        }
      })
      .get('http://localhost:9393/api/users')
      .expectStatus(200)
      .expectJsonLike('people[*].name', ['Matt', 'Pete']);
  });

  it('json query like - fails', async () => {
    let err;
    try {
      await pactum.spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/api/users'
          },
          response: {
            status: 200,
            body: {
              people: [
                { name: 'Matt', country: 'NZ' },
                { name: 'Pete', country: 'AU' },
                { name: 'Mike', country: 'NZ' }
              ]
            }
          }
        })
        .get('http://localhost:9393/api/users')
        .expectStatus(200)
        .expectJsonLike('people[*].name', ['Matt', 'Pet'])
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

})