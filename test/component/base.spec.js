const pactum = require('../../src/index');
const handler = pactum.handler;

function addDefaultMockHandlers() {
  handler.addInteractionHandler('default get', () => {
    return {
      request: {
        method: 'GET',
        path: '/default/get'
      },
      response: {
        status: 200,
        body: {
          method: 'GET',
          path: '/default/get'
        }
      }
    };
  });
  handler.addInteractionHandler('default post', () => {
    return {
      request: {
        method: 'POST',
        path: '/default/post',
        body: {
          method: 'POST',
          path: '/default/post'
        }
      },
      response: {
        status: 200
      }
    };
  });
  handler.addInteractionHandler('get people', () => {
    return {
      request: {
        method: 'GET',
        path: '/api/people'
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
    };
  });
  handler.addInteractionHandler('get user with id 1', () => {
    return {
      request: {
        method: 'GET',
        path: '/api/users/1'
      },
      response: {
        status: 200,
        body: {
          id: 1,
          name: 'snow'
        }
      }
    };
  });
  handler.addInteractionHandler('default flow get', () => {
    return {
      provider: 'some-provider',
      flow: 'get default',
      request: {
        method: 'GET',
        path: '/default/get'
      },
      response: {
        status: 200,
        body: {
          method: 'GET',
          path: '/default/get'
        }
      }
    };
  });
}

before(async () => {
  addDefaultMockHandlers();
  await pactum.mock.start();
});

after(async () => {
  await pactum.mock.stop();
});