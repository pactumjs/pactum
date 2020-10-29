const pactum = require('../../src/index');
const stash = pactum.stash;

describe('Templates & Maps', () => {

  before(() => {
    stash.loadData('./test/data');
    stash.addDataTemplate({
      'User.NewUser': {
        FirstName: 'Jon',
        LastName: 'Snow',
        Country: '$M{User.Country}',
        Addresses: []
      },
      'User.Address': {
        Castle: 'WinterFell',
        Realm: 'The North'
      }
    });
    stash.addDataMap({
      User: {
        FirstName: 'Jon',
        LastName: 'Snow',
        Country: 'North'
      },
      Castle: {
        Wall: 'Castle Black'
      }
    });
    stash.addDataMap([]);
    stash.addDataTemplate([]);
    pactum.handler.addDataFunHandler('GetZero', () => 0);
    pactum.handler.addDataFunHandler('GetAuthToken', () => 'Basic xyz');
    pactum.handler.addDataFunHandler('GetNumber', (ctx) => ctx.args[0]);
    pactum.handler.addDataFunHandler('GetSum', (ctx) => parseInt(ctx.args[0]) + parseInt(ctx.args[1]));
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
          Age: '$F{GetZero}',
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
                Castle: '$M{Castle.Wall}'
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
            age: 0,
            mass: 10
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
      .withQueryParams('age', '$F{GetNumber:0}')
      .withQueryParams('mass', '$F{GetSum:3,7}')
      .withHeaders('Authorization', '$F{GetAuthToken}')
      .expectStatus(200);
  });

  it('mock using data reference in query & headers', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/users',
          query: {
            name: '$M{User.FirstName}'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Authorization': '$F{GetAuthToken}'
          },
          body: {
            '@DATA:TEMPLATE@': 'User.NewUser'
          }
        }
      })
      .get('http://localhost:9393/api/users')
      .withQueryParams({ name: 'Jon' })
      .expectHeader('authorization', 'Basic xyz')
      .expectJson({
        FirstName: 'Jon',
        LastName: 'Snow',
        Country: 'North',
        Addresses: []
      });
  });

  it('post new army from a template in fs', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/api/army',
          body: {
            "Name": "Golden Army",
            "Count": 10000,
            "Alliance": "Stark",
            "Cavalry": "$M{Unknown}"
          }
        },
        willRespondWith: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/army')
      .withJson({
        '@DATA:TEMPLATE@': 'Army:New',
        '@OVERRIDES@': {
          'Cavalry': '$M{Unknown}'
        }
      })
      .expectStatus(200);
  });

  it('expect schema from a template in fs', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/army'
        },
        willRespondWith: {
          status: 200,
          body: {
            "Name": "Golden Army",
            "Count": 10000,
            "Alliance": "Stark"
          }
        }
      })
      .get('http://localhost:9393/api/army')
      .expectStatus(200)
      .expectJsonSchema({
        '@DATA:TEMPLATE@': 'Schema:Army'
      });
  });

  after(() => {
    stash.clearDataTemplates();
    stash.clearDataMaps();
  });

});