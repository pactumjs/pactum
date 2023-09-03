const { like, eachLike, lte, lt, gt, gte, notEquals } = require('pactum-matchers');
const pactum = require('../../src/index');
const expect = require('chai').expect;
const fs = require('fs');

describe('Expects', () => {

  before(() => {
    const isUser = function (ctx) {
      const user = ctx.res.json;
      expect(user).deep.equals({ id: 1 });
    };
    pactum.handler.addExpectHandler('isUser', isUser);

    const hasAddress = function ({ res, data }) {
      const address = res.json;
      expect(address.type).equals(data);
    };
    pactum.handler.addExpectHandler('hasAddress', hasAddress);
  });

  it('custom expect handler', async () => {

    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/users/1'
        },
        response: {
          status: 200,
          body: {
            id: 1
          }
        }
      })
      .get('http://localhost:9393/api/users/1')
      .expect('isUser')
      .expectStatus(200);
  });

  it('ad hoc expect handler', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/users/1'
        },
        response: {
          status: 200,
          body: {
            id: 1
          }
        }
      })
      .get('http://localhost:9393/api/users/1')
      .expect(({ res }) => {
        expect(res.json).deep.equals({ id: 1 });
      })
      .expectStatus(200);
  });

  it('unknown custom expect handler', async () => {
    let err;
    try {
      await pactum.spec()
        .get('http://localhost:9393/api/users/1')
        .expect('isAddress')
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Expect Handler Not Found - 'isAddress'`);
  });

  it('failed custom expect handler with data', async () => {
    let err;
    try {
      await pactum.spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/api/address/1'
          },
          response: {
            status: 200,
            body: {
              type: 'WORK'
            }
          }
        })
        .get('http://localhost:9393/api/address/1')
        .expect('hasAddress', 'HOME')
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`expected 'WORK' to equal 'HOME'`);
  });

  it('failed ad hoc expect handler', async () => {
    let err;
    try {
      await pactum.spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/api/users/1'
          },
          response: {
            status: 200,
            body: {
              id: 1
            }
          }
        })
        .get('http://localhost:9393/api/users/1')
        .expect((res) => { expect(res.json).deep.equals({ id: 2 }); })
        .expectStatus(200)
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

  it('failed status code', async () => {
    let err;
    try {
      await pactum.spec()
        .get('http://localhost:9393/api/users/1')
        .expectStatus(200)
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('HTTP status 404 !== 200');
  });

  it('header key not found', async () => {
    let err;
    try {
      await pactum.spec()
        .get('http://localhost:9393/api/users/1')
        .expectHeader('x-header', 'value')
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Header 'x-header' not present in HTTP response`);
  });

  it('header value not found', async () => {
    let err;
    try {
      await pactum.spec()
        .get('http://localhost:9393/api/users/1')
        .expectHeader('connection', 'value')
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Header value 'value' did not match for header 'connection': 'close'`);
  });

  it('header value not found - RegEx', async () => {
    let err;
    try {
      await pactum.spec()
        .get('http://localhost:9393/api/users/1')
        .expectHeader('connection', /value/)
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Header regex (/value/) did not match for header 'connection': 'close'`);
  });

  it('header contains key not found', async () => {
    let err;
    try {
      await pactum.spec()
        .get('http://localhost:9393/api/users/1')
        .expectHeaderContains('x-header', 'value')
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Header 'x-header' not present in HTTP response`);
  });

  it('header contains value not found', async () => {
    let err;
    try {
      await pactum.spec()
        .get('http://localhost:9393/api/users/1')
        .expectHeaderContains('connection', 'value')
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Header value 'value' did not match for header 'connection': 'close'`);
  });

  it('header contains value not found - RegEx', async () => {
    let err;
    try {
      await pactum.spec()
        .get('http://localhost:9393/api/users/1')
        .expectHeaderContains('connection', /value/)
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Header regex (/value/) did not match for header 'connection': 'close'`);
  });

  it('failed body', async () => {
    let err;
    try {
      await pactum.spec()
        .get('http://localhost:9393/api/users/1')
        .expectBody('Hello World')
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err.message).contains('Interaction Not Found');
  });

  it('failed body contains - string', async () => {
    let err;
    try {
      await pactum.spec()
        .get('http://localhost:9393/api/users/1')
        .expectBodyContains('Hello World')
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Value 'Hello World' not found in response body`);
  });

  it('failed body contains - object', async () => {
    let err;
    try {
      await pactum.spec()
        .get('http://localhost:9393/api/users/1')
        .expectBodyContains({ msg: 'Hello World' })
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Value '{"msg":"Hello World"}' not found in response body`);
  });

  it('failed body contains - RegEx', async () => {
    let err;
    try {
      await pactum.spec()
        .get('http://localhost:9393/api/users/1')
        .expectBodyContains(/Hello World/)
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Value '/Hello World/' not found in response body`);
  });

  it('failed json like', async () => {
    let err;
    try {
      await pactum.spec()
        .get('http://localhost:9393/api/users/1')
        .expectJsonLike({ id: 1 })
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Json doesn't have type 'object' at '$' but found 'string'`);
  });

  it('failed json schema', async () => {
    let err;
    try {
      await pactum.spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/api/users/1'
          },
          response: {
            status: 200,
            body: {
              id: 1
            }
          }
        })
        .get('http://localhost:9393/api/users/1')
        .expectJsonSchema({
          "required": ["userId", "id"]
        })
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

  it('failed json schema at', async () => {
    let err;
    try {
      await pactum.spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/api/users/1'
          },
          response: {
            status: 200,
            body: {
              id: 1
            }
          }
        })
        .get('http://localhost:9393/api/users/1')
        .expectJsonSchema('id', {
          "type": "string"
        })
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

  it('failed json match', async () => {
    let err;
    try {
      await pactum.spec()
        .get('http://localhost:9393/api/users/1')
        .expectJsonMatch(like({ id: 1 }))
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Json doesn't have type 'object' at '$' but found 'string'`);
  });

  it('network error', async () => {
    let err;
    try {
      await pactum.spec()
        .get('http://localhost:9394/api/users/1')
        .expectJsonSchema({
          "required": ["userId", "id"]
        })
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

  it('interaction not exercised error', async () => {
    let err;
    try {
      await pactum.spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/api'
          },
          response: {
            status: 200
          }
        })
        .get('http://localhost:9393/api/users/1')
        .expectStatus(200)
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err.message).contains('Interaction not exercised');
  });

  it('interaction not exercised error - with headers, body & matching', async () => {
    let err;
    try {
      await pactum.spec()
        .useInteraction({
          request: {
            method: 'POST',
            path: '/api',
            headers: {
              token: ''
            },
            body: {
              id: like(1)
            }
          },
          response: {
            status: 200
          }
        })
        .get('http://localhost:9393/api/users/1')
        .expectStatus(200)
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err.message).contains('Interaction not exercised');
  });

  it('interaction exercised error', async () => {
    let err;
    try {
      await pactum.spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/api'
          },
          response: {
            status: 200
          },
          expects: {
            exercised: false
          }
        })
        .get('http://localhost:9393/api')
        .expectStatus(200)
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err.message).contains('Interaction exercised');
  });

  it('interaction call count error', async () => {
    let err;
    try {
      await pactum.spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/api'
          },
          response: {
            status: 200
          },
          expects: {
            callCount: 2
          }
        })
        .get('http://localhost:9393/api')
        .expectStatus(200)
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err.message).contains('Interaction call count 1 !== 2');
  });

  it('json query - on root object', () => {
    return pactum.spec()
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

  it('json query - on root array', () => {
    return pactum.spec()
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
        .expectJson('people[country=NZ].name', 'Matt')
        .expectJson('people[*].name', ['Matt', 'Pete'])
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

  it('json query like - on root object', () => {
    return pactum.spec()
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

  it('failed response time', async () => {
    let err;
    try {
      await pactum.spec()
        .get('http://localhost:9393/api/users/1')
        .expectResponseTime(-1)
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err.message).contains(`Request took longer than -1ms`);
  });

  it('json match at', async () => {
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
      .expectJsonMatch('people[*].name', eachLike('Matt'));
  });

  it('json match at - fails', async () => {
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
        .expectJsonMatch('people[*].name', eachLike(12))
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

  it('json strict match at', async () => {
    await pactum.spec()
      .useInteraction('get people')
      .get('http://localhost:9393/api/people')
      .expectStatus(200)
      .expectJsonMatchStrict('people[*].name', eachLike('Matt'));
  });

  it('json match strict at - fails', async () => {
    let err;
    try {
      await pactum.spec()
        .useInteraction('get people')
        .get('http://localhost:9393/api/people')
        .expectStatus(200)
        .expectJsonMatchStrict('people[*].name', eachLike(12))
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

  it('json strict match', async () => {
    await pactum.spec()
      .useInteraction('get people')
      .get('http://localhost:9393/api/people')
      .expectStatus(200)
      .expectJsonMatchStrict({
        people: [
          { name: 'Matt', country: 'NZ' },
          { name: 'Pete', country: 'AU' },
          { name: 'Mike', country: 'NZ' }
        ]
      });
  });

  it('json match strict - fails', async () => {
    let err;
    try {
      await pactum.spec()
        .useInteraction('get people')
        .get('http://localhost:9393/api/people')
        .expectStatus(200)
        .expectJsonMatchStrict({})
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

  it('json snapshot - with multiple matchers', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/users/1'
        },
        response: {
          status: 200,
          body: {
            id: 'random-id',
            name: 'snow',
            age: 12,
            createdAt: '2020-10-10'
          }
        }
      })
      .name('json snapshot - with multiple matchers')
      .get('http://localhost:9393/api/users/1')
      .expectStatus(200)
      .expectJsonSnapshot({
        id: like('id')
      })
      .expectJsonSnapshot({
        createdAt: like('2020-02-02')
      });
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/users/1'
        },
        response: {
          status: 200,
          body: {
            id: 'random-id',
            name: 'snow',
            age: 12,
            createdAt: '2020-10-10'
          }
        }
      })
      .name('json snapshot - with multiple matchers')
      .get('http://localhost:9393/api/users/1')
      .expectStatus(200)
      .expectJsonSnapshot({
        id: like('id'),
        createdAt: like('2020-02-02')
      });
    fs.unlinkSync(`.pactum/snapshots/json snapshot - with multiple matchers.json`);
  });

  it('json snapshot - with matchers - fails with extra property', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/users/1'
        },
        response: {
          status: 200,
          body: {
            id: 'random-id',
            name: 'snow'
          }
        }
      })
      .name('json snapshot - with matchers')
      .get('http://localhost:9393/api/users/1')
      .expectStatus(200)
      .expectJsonSnapshot({
        id: like('id')
      });
    let err;
    try {
      await pactum.spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/api/users/1'
          },
          response: {
            status: 200,
            body: {
              id: 'random-id',
              name: 'snow',
              age: 2
            }
          }
        })
        .name('json snapshot - with matchers')
        .get('http://localhost:9393/api/users/1')
        .expectStatus(200)
        .expectJsonSnapshot({
          id: like('id')
        })
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    fs.unlinkSync(`.pactum/snapshots/json snapshot - with matchers.json`);
    expect(err).not.undefined;
  });

  it('json snapshot - with matchers - fails with matcher', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/users/1'
        },
        response: {
          status: 200,
          body: {
            id: 'random-id',
            name: 'snow'
          }
        }
      })
      .name('json snapshot - with matchers')
      .get('http://localhost:9393/api/users/1')
      .expectStatus(200)
      .expectJsonSnapshot({
        id: like('id')
      });
    let err;
    try {
      await pactum.spec()
        .useInteraction('get user with id 1')
        .name('json snapshot - with matchers')
        .get('http://localhost:9393/api/users/1')
        .expectStatus(200)
        .expectJsonSnapshot({
          id: like('id')
        })
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    fs.unlinkSync(`.pactum/snapshots/json snapshot - with matchers.json`);
    expect(err).not.undefined;
  });

  it('json snapshot - with matchers - fails with matcher - update snapshot', async () => {
    let err1, err2;
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/users/1'
        },
        response: {
          status: 200,
          body: {
            id: 'random-id',
            name: 'snow'
          }
        }
      })
      .name('json snapshot - with matchers')
      .get('http://localhost:9393/api/users/1')
      .expectStatus(200)
      .expectJsonSnapshot({
        id: like('id')
      });
    try {
      await pactum.spec()
        .useInteraction('get user with id 1')
        .name('json snapshot - with matchers')
        .get('http://localhost:9393/api/users/1')
        .expectStatus(200)
        .expectJsonSnapshot({
          id: like('id')
        })
        .useLogLevel('ERROR');
    } catch (error) {
      err1 = error;
    }
    try {
      await pactum.spec()
        .useInteraction('get user with id 1')
        .name('json snapshot - with matchers')
        .get('http://localhost:9393/api/users/1')
        .expectStatus(200)
        .expectJsonSnapshot({
          id: like(1)
        })
        .useLogLevel('ERROR');
    } catch (error) {
      err2 = error;
    }
    await pactum.spec()
      .useInteraction('get user with id 1')
      .name('json snapshot - with matchers')
      .get('http://localhost:9393/api/users/1')
      .expectStatus(200)
      .expectJsonSnapshot({
        id: like(1)
      })
      .updateSnapshot();
    await pactum.spec()
      .useInteraction('get user with id 1')
      .name('json snapshot - with matchers')
      .get('http://localhost:9393/api/users/1')
      .expectStatus(200)
      .expectJsonSnapshot({
        id: like(1)
      });
    fs.unlinkSync(`.pactum/snapshots/json snapshot - with matchers.json`);
    expect(err1).not.undefined;
    expect(err2).not.undefined;
  });

  it('json snapshot - with invalid matchers', async () => {
    let e;
    try {
      await pactum.spec()
      .useInteraction('get people')
      .name('json snapshot - with invalid matchers')
      .get('http://localhost:9393/api/people')
      .expectStatus(200)
      .useLogLevel('ERROR')
      .expectJsonSnapshot({
        id: like('id')
      })
      .expectJsonSnapshot({
        createdAt: like('2020-02-02')
      });
    } catch (error) {
      e = error;
    }
    expect(e).not.undefined;
  });

  it('error - empty', async () => {
    await pactum.spec()
      .get('http://localhost:9392')
      .expectError();
  });

  it('error - with string', async () => {
    await pactum.spec()
      .get('http://localhost:9392')
      .expectError('ECONNREFUSED');
  });

  it('error - with object', async () => {
    await pactum.spec()
      .get('http://localhost:9392')
      .expectError({ code: 'ECONNREFUSED' });
  });

  it('error - empty - fails', async () => {
    let err;
    try {
      await pactum.spec()
        .useInteraction('default get')
        .get('http://localhost:9393/default/get')
        .expectError()
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

  it('error - with string - fails', async () => {
    let err;
    try {
      await pactum.spec()
        .get('http://localhost:9392')
        .expectError('ECONNRESET')
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

  it('error - with object - fails', async () => {
    let err;
    try {
      await pactum.spec()
        .get('http://localhost:9392')
        .expectError({ code: 'ECONNRESET' })
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

  it('json schema with options', async () => {
    await pactum.spec()
      .useInteraction('default get')
      .get('http://localhost:9393/default/get')
      .expectJsonSchema({
        type: 'object',
        properties: {
          method: {
            type: 'string',
            format: 'only-get'
          }
        }
      }, {
        formats: {
          'only-get': /^GET$/
        }
      });
  });

  it('json schema at with options', async () => {
    await pactum.spec()
      .useInteraction('default get')
      .get('http://localhost:9393/default/get')
      .expectJsonSchema('method', {
        type: 'string',
        format: 'only-get'
      }, {
        formats: {
          'only-get': /^GET$/
        }
      });
  });

  it('json length', async () => {
    await pactum.spec()
      .useInteraction('default users')
      .get('http://localhost:9393/default/users')
      .expectJsonLength(3);
  });

  it('json length - fail', async () => {
    let err;
    try {
      await pactum.spec()
        .useInteraction('default users')
        .get('http://localhost:9393/default/users')
        .expectJsonLength(2)
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

  it('json length - fail - invalid', async () => {
    let err;
    try {
      await pactum.spec()
        .useInteraction('default get')
        .get('http://localhost:9393/default/get')
        .expectJsonLength(2)
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

  it('json length query', async () => {
    await pactum.spec()
      .useInteraction('get people')
      .get('http://localhost:9393/api/people')
      .expectJsonLength('people', 3);
  });

  it('json length query - LTE - EQ check', async () => {
    await pactum.spec()
      .useInteraction('get people')
      .get('http://localhost:9393/api/people')
      .expectJsonLength('people', lte(3));
  });

  it('json length query - LTE - LT check', async () => {
    await pactum.spec()
      .useInteraction('get people')
      .get('http://localhost:9393/api/people')
      .expectJsonLength('people', lte(5));
  });

  it('json length query - LT', async () => {
    await pactum.spec()
      .useInteraction('get people')
      .get('http://localhost:9393/api/people')
      .expectJsonLength('people', lt(4));
  });

  it('json length query - GT', async () => {
    await pactum.spec()
      .useInteraction('get people')
      .get('http://localhost:9393/api/people')
      .expectJsonLength('people', gt(2));
  });

  it('json length query - GTE - EQ check', async () => {
    await pactum.spec()
      .useInteraction('get people')
      .get('http://localhost:9393/api/people')
      .expectJsonLength('people', gte(3));
  });

  it('json length query - GTE - GT check', async () => {
    await pactum.spec()
      .useInteraction('get people')
      .get('http://localhost:9393/api/people')
      .expectJsonLength('people', gte(1));
  });

  it('json length query - NOT_EQUALS', async () => {
    await pactum.spec()
      .useInteraction('get people')
      .get('http://localhost:9393/api/people')
      .expectJsonLength('people', notEquals(4));
  });

  it('json length - fail', async () => {
    let err;
    try {
      await pactum.spec()
        .useInteraction('get people')
        .get('http://localhost:9393/api/people')
        .expectJsonLength('people', 2)
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

  it('json length query - fail - invalid operation', async () => {
    try {
      await pactum.spec()
        .useInteraction('get people')
        .get('http://localhost:9393/api/people')
        .expectJsonLength('people', like(2))
        .useLogLevel('ERROR');
    } catch (error) {
      expect(error.message).equal("Invalid compare operation LIKE, allowed operations: LTE,GTE,LT,GT,NOT_EQUALS");
    }
  });

  it('json length - fail - invalid', async () => {
    let err;
    try {
      await pactum.spec()
        .useInteraction('get people')
        .get('http://localhost:9393/api/people')
        .expectJsonLength('people[0]', 2)
        .useLogLevel('ERROR');
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

  it('json length query - fail - LTE assertion error', async () => {
    try {
      await pactum.spec()
        .useInteraction('get people')
        .get('http://localhost:9393/api/people')
        .expectJsonLength('people', lte(2))
        .useLogLevel('ERROR');
    } catch (error) {
      expect(error.message).equal("JSON Length 3 not LTE 2");
    }
  });

});