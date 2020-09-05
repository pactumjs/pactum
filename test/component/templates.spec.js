const pactum = require('../../src/index');

describe('Templates & Maps', () => {

  before(() => {
    pactum.loader.loadDataTemplate({
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
    pactum.loader.loadDataMap({
      User: {
        FirstName: 'Jon',
        LastName: 'Snow',
        Country: 'North'
      },
      Castle: {
        Wall: 'Castle Black'
      }
    })
  });

  it('new user with pure template', async () => {
    await pactum
      .addMockInteraction({
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
    await pactum
      .addMockInteraction({
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
    await pactum
      .addMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/api/users',
          body: {
            FirstName: 'Jon',
            LastName: 'Snow',
            Country: 'North',
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
    await pactum
      .addMockInteraction({
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

  after(() => {
    pactum.loader.clearDataTemplates();
    pactum.loader.clearDataMaps();
  });

});