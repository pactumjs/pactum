const { spec, settings } = require('../../src');
const expect = require('chai').expect;

describe('Expects - expectJson', () => {

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
      .expectJson({
        method: 'GET',
        path: '/default/get'
      });
  });

  it('should validate json from file', async () => {
    await spec()
      .useInteraction('default get')
      .get('http://localhost:9393/default/get')
      .expectJson('default.get.response.json');
  });

  it('should fail with invalid path', async () => {
    let err;
    try {
      await spec()
        .useInteraction('default get')
        .get('http://localhost:9393/default/get')
        .expectJson('invalid-file.json');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`File Not Found - 'invalid-file.json'`);
  });

  it('json query - on root object', async () => {
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
      .expectJson('people[country=NZ].name', 'Matt')
      .expectJson('people[*].name', ['Matt', 'Pete', 'Mike']);
  });

  it('json query - on root array', async () => {
    await spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/users'
        },
        response: {
          status: 200,
          body: [
            { name: 'Matt', country: 'NZ' },
            { name: 'Pete', country: 'AU' },
            { name: 'Mike', country: 'NZ' }
          ]
        }
      })
      .get('http://localhost:9393/api/users')
      .expectStatus(200)
      .expectJson('[1].country', 'AU')
      .expectJson('[country=NZ].name', 'Matt')
      .expectJson('[*].name', ['Matt', 'Pete', 'Mike']);
  });

  it('json query - on root object - fails', async () => {
    let err;
    try {
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
        .expectJson('people[country=NZ].name', 'Matt')
        .expectJson('people[*].name', ['Matt', 'Pete'])
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

})