const pactum = require('../../src/index');

describe('Templates & Maps', () => {

  before(() => {
    pactum.stash.loadDataTemplates({
      'User.NewUser': {
        FirstName: 'Jon',
        LastName: 'Snow',
        Country: '@DATA:MAP::User.Country@',
        Addresses: []
      },
      'User.Address': {
        Castle: 'WinterFell',
        Realm: 'The North'
      }
    });
    pactum.stash.loadDataMaps({
      User: {
        FirstName: 'Jon',
        LastName: 'Snow',
        Country: 'North'
      },
      Castle: {
        Wall: 'Castle Black'
      }
    });
    pactum.handler.addDataHandler('GetZero', () => 0);
    pactum.handler.addDataHandler('GetAuthToken', () => 'Basic xyz');
  });

  it('new user with pure template', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/api/users',
          body: {
            FirstName: 'Jon',
            LastName: 'Snow',
            Country: 'North',
            Addresses: []
          }
        },
        willRespondWith: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/users')
      .withJson({
        '@DATA:TEMPLATE@': 'User.NewUser'
      })
      .expectStatus(200);
  });

  it('new user with pure - override existing property', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/api/users',
          body: {
            FirstName: 'Jon',
            LastName: 'Dragon',
            Country: 'North',
            Addresses: []
          }
        },
        willRespondWith: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/users')
      .withJson({
        '@DATA:TEMPLATE@': 'User.NewUser',
        '@OVERRIDES@': {
          LastName: 'Dragon'
        }
      })
      .expectStatus(200);
  });

  it('new user with pure - override existing property with template & map', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/api/users',
          body: {
            FirstName: 'Jon',
            LastName: 'Snow',
            Country: 'North',
            Age: 0,
            Addresses: [
              {
                Castle: 'WinterFell',
                Realm: 'The North'
              }
            ]
          }
        },
        willRespondWith: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/users')
      .withJson({
        '@DATA:TEMPLATE@': 'User.NewUser',
        '@OVERRIDES@': {
          Age: '@DATA:FUN::GetZero@',
          Addresses: [
            {
              '@DATA:TEMPLATE@': 'User.Address'
            }
          ]
        }
      })
      .expectStatus(200);
  });

  it('new user with pure - nested override', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/api/users',
          body: {
            FirstName: 'Jon',
            LastName: 'Snow',
            Country: 'North',
            Addresses: [
              {
                Castle: 'Castle Black',
                Realm: 'The North'
              }
            ]
          }
        },
        willRespondWith: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/users')
      .withJson({
        '@DATA:TEMPLATE@': 'User.NewUser',
        '@OVERRIDES@': {
          Addresses: [
            {
              '@DATA:TEMPLATE@': 'User.Address',
              '@OVERRIDES@': {
                Castle: '@DATA:MAP::Castle.Wall@'
              }
            }
          ]
        }
      })
      .expectStatus(200);
  });

  it('data ref in query & headers', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/users',
          query: {
            age: 0
          },
          headers: {
            'Authorization': 'Basic xyz'
          }
        },
        willRespondWith: {
          status: 200
        }
      })
      .get('http://localhost:9393/api/users')
      .withQueryParam('age', '@DATA:FUN::GetZero@')
      .withHeader('Authorization', '@DATA:FUN::GetAuthToken@')
      .expectStatus(200);
  });

  after(() => {
    pactum.stash.clearDataTemplates();
    pactum.stash.clearDataMaps();
  });

});