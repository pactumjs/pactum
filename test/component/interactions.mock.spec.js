const expect = require('chai').expect;
const pactum = require('../../src/index');
const { like, eachLike } = require('pactum-matchers');

describe('Mock Interactions - Query', () => {

  it('ignoring all query params', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/mock/query'
        },
        willRespondWith: {
          status: 200
        }
      })
      .get('http://localhost:9393/mock/query')
      .withQueryParams('id', 1)
      .withQueryParams('name', 'snow')
      .expectStatus(200);
  });

  it('ignoring few query params', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/mock/query',
          query: {
            id: 1
          }
        },
        willRespondWith: {
          status: 200
        }
      })
      .get('http://localhost:9393/mock/query')
      .withQueryParams('id', 1)
      .withQueryParams('name', 'snow')
      .expectStatus(200);
  });

  it('ignoring few query params - with like', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/mock/query',
          query: like({
            id: 2
          })
        },
        willRespondWith: {
          status: 200
        }
      })
      .get('http://localhost:9393/mock/query')
      .withQueryParams('id', 1)
      .withQueryParams('name', 'snow')
      .expectStatus(200);
  });

  it('all query params with like', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/mock/query',
          query: like({
            id: 2,
            name: 'fall'
          })
        },
        willRespondWith: {
          status: 200
        }
      })
      .get('http://localhost:9393/mock/query')
      .withQueryParams('id', 1)
      .withQueryParams('name', 'snow')
      .expectStatus(200);
  });

  it('additional query params with like', async () => {
    let err;
    try {
      await pactum.spec()
        .useMockInteraction({
          withRequest: {
            method: 'GET',
            path: '/mock/query',
            query: like({
              id: 2,
              name: 'fall',
              country: 'winter'
            })
          },
          willRespondWith: {
            status: 200
          }
        })
        .get('http://localhost:9393/mock/query')
        .withQueryParams('id', 1)
        .withQueryParams('name', 'snow')
        .expectStatus(200);
    } catch (error) {
      err = error;
    }
    expect(err).not.to.be.undefined;
  });

  it('expecting queries', async () => {
    let err;
    try {
      await pactum.spec()
        .useMockInteraction({
          withRequest: {
            method: 'GET',
            path: '/mock/query',
            query: like({
              id: 2,
              name: 'fall',
              country: 'winter'
            })
          },
          willRespondWith: {
            status: 200
          }
        })
        .get('http://localhost:9393/mock/query')
        .expectStatus(200);
    } catch (error) {
      err = error;
    }
    expect(err).not.to.be.undefined;
  });

});

describe('Mock Interactions - Path Params', () => {

  it('including single path param', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/users/{user}',
          pathParams: {
            user: 'snow'
          }
        },
        willRespondWith: {
          status: 200
        }
      })
      .get('http://localhost:9393/api/users/{username}')
      .withPathParams('username', 'snow')
      .expectStatus(200);
  });

  it('including multiple path param', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/project/{project}/repo/{repo}/pr/{pr}',
          pathParams: {
            project: 'QA',
            repo: 'automation',
            pr: '1'
          }
        },
        willRespondWith: {
          status: 200
        }
      })
      .get('http://localhost:9393/api/project/{project}/repo/{repo}/pr/{pr}')
      .withPathParams('project', 'QA')
      .withPathParams('repo', 'automation')
      .withPathParams({ pr: 1 })
      .expectStatus(200);
  });

  it('including multiple path param with like matcher', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/project/{project}/repo/{repo}/pr/{pr}',
          pathParams: {
            project: 'QA',
            repo: 'automation',
            pr: like('10')
          }
        },
        willRespondWith: {
          status: 200
        }
      })
      .get('http://localhost:9393/api/project/{project}/repo/{repo}/pr/{pr}')
      .withPathParams('project', 'QA')
      .withPathParams('repo', 'automation')
      .withPathParams({ pr: 1 })
      .expectStatus(200);
  });

  it('unequal path parts length', async () => {
    let err;
    try {
      await pactum.spec()
        .useMockInteraction({
          withRequest: {
            method: 'GET',
            path: '/api/project/{project}/repo/{repo}/pr/{pr}',
            pathParams: {
              project: 'QA',
              repo: 'automation',
              pr: '1'
            }
          },
          willRespondWith: {
            status: 200
          }
        })
        .get('http://localhost:9393/api/projects/{project}/repo/{repo}')
        .withPathParams('project', 'QA')
        .withPathParams('repo', 'automation')
        .withPathParams({ pr: 1 })
        .expectStatus(200);
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

  it('unequal path parts', async () => {
    let err;
    try {
      await pactum.spec()
        .useMockInteraction({
          withRequest: {
            method: 'GET',
            path: '/api/project/{project}/repo/{repo}/pr/{pr}',
            pathParams: {
              project: 'QA',
              repo: 'automation',
              pr: '1'
            }
          },
          willRespondWith: {
            status: 200
          }
        })
        .get('http://localhost:9393/api/projects/{project}/repo/{repo}/pr/{pr}')
        .withPathParams('project', 'QA')
        .withPathParams('repo', 'automation')
        .withPathParams({ pr: 1 })
        .expectStatus(200);
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

});

describe('Mock Interactions - Headers', () => {

  it('expecting an header', async () => {
    let err;
    try {
      await pactum.spec()
        .useMockInteraction({
          withRequest: {
            method: 'GET',
            path: '/mock/header',
            headers: {
              'x': 'y'
            }
          },
          willRespondWith: {
            status: 200
          }
        })
        .get('http://localhost:9393/mock/header')
        .expectStatus(200);
    } catch (error) {
      err = error;
    }
    expect(err).not.to.be.undefined;
  });

});

describe('Mock Interactions - Body', () => {

  it('ignoring body', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/mock/body'
        },
        willRespondWith: {
          status: 200
        }
      })
      .post('http://localhost:9393/mock/body')
      .withJson({
        id: 1,
        name: 'Jon',
        married: true
      })
      .expectStatus(200);
  });

  it('ignoring few properties in body', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/mock/body',
          body: {
            id: 1
          }
        },
        willRespondWith: {
          status: 200
        }
      })
      .post('http://localhost:9393/mock/body')
      .withJson({
        id: 1,
        name: 'Jon',
        married: true
      })
      .expectStatus(200);
  });

  it('ignoring few properties in body - with like', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/mock/body',
          body: like({
            id: 3,
            married: false
          })
        },
        willRespondWith: {
          status: 200
        }
      })
      .post('http://localhost:9393/mock/body')
      .withJson({
        id: 1,
        name: 'Jon',
        married: true
      })
      .expectStatus(200);
  });

  it('ignoring few properties in body - with each like', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/mock/body',
          body: eachLike({
            id: 3,
            married: false
          })
        },
        willRespondWith: {
          status: 200
        }
      })
      .post('http://localhost:9393/mock/body')
      .withJson([
        {
          id: 1,
          name: 'Jon',
          married: true
        },
        {
          id: 2,
          name: 'Snow',
          married: false
        }
      ])
      .expectStatus(200);
  });

  it('expecting extra properties in body', async () => {
    let err;
    try {
      await pactum.spec()
        .useMockInteraction({
          withRequest: {
            method: 'POST',
            path: '/mock/body',
            body: {
              id: 3,
              married: false,
              country: 'True North'
            }
          },
          willRespondWith: {
            status: 200
          }
        })
        .post('http://localhost:9393/mock/body')
        .withJson({
          id: 1,
          name: 'Jon',
          married: true
        })
        .expectStatus(200);
    } catch (error) {
      err = error;
    }
    expect(err).not.to.be.undefined;
  });

  it('expecting extra properties in body - with like', async () => {
    let err;
    try {
      await pactum.spec()
        .useMockInteraction({
          withRequest: {
            method: 'POST',
            path: '/mock/body',
            body: like({
              id: 3,
              married: false,
              country: 'True North'
            })
          },
          willRespondWith: {
            status: 200
          }
        })
        .post('http://localhost:9393/mock/body')
        .withJson({
          id: 1,
          name: 'Jon',
          married: true
        })
        .expectStatus(200);
    } catch (error) {
      err = error;
    }
    expect(err).not.to.be.undefined;
  });

});

describe('Mock Interactions - Wait', () => {

  it('ignoring all query params', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/mock/query'
        },
        willRespondWith: {
          status: 200
        }
      })
      .get('http://localhost:9393/mock/query')
      .withQueryParams('id', 1)
      .withQueryParams('name', 'snow')
      .wait(1)
      .expectStatus(200);
  });

});

describe('Mock Interactions - Follow Redirects', () => {

  it('with Follow Redirects', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/mock/redirect'
        },
        willRespondWith: {
          status: 301,
          headers: {
            'location': 'http://localhost:9393/mock/actual'
          }
        }
      })
      .useMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/mock/actual'
        },
        willRespondWith: {
          status: 200
        }
      })
      .get('http://localhost:9393/mock/redirect')
      .withFollowRedirects(true)
      .expectStatus(200);
  });

  it('without Follow Redirects', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/mock/redirect'
        },
        willRespondWith: {
          status: 301,
          headers: {
            'location': 'http://localhost:9393/mock/actual'
          }
        }
      })
      .get('http://localhost:9393/mock/redirect')
      .expectStatus(301);
  });

  it('with Follow Redirects as false', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/mock/redirect'
        },
        willRespondWith: {
          status: 301,
          headers: {
            'location': 'http://localhost:9393/mock/actual'
          }
        }
      })
      .get('http://localhost:9393/mock/redirect')
      .withFollowRedirects(false)
      .expectStatus(301);
  });

  it('with default Follow Redirects', async () => {
    pactum.request.setDefaultFollowRedirects(true);
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/mock/redirect'
        },
        willRespondWith: {
          status: 301,
          headers: {
            'location': 'http://localhost:9393/mock/actual'
          }
        }
      })
      .useMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/mock/actual'
        },
        willRespondWith: {
          status: 200
        }
      })
      .get('http://localhost:9393/mock/redirect')
      .expectStatus(200);
  });

  it('with Follow Redirects as false & default as true', async () => {
    pactum.request.setDefaultFollowRedirects(true);
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/mock/redirect'
        },
        willRespondWith: {
          status: 301,
          headers: {
            'location': 'http://localhost:9393/mock/actual'
          }
        }
      })
      .get('http://localhost:9393/mock/redirect')
      .withFollowRedirects(false)
      .expectStatus(301);
  });


  afterEach(() => {
    pactum.request.setDefaultFollowRedirects(false);
  });

});