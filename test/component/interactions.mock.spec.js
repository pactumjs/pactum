const expect = require('chai').expect;
const pactum = require('../../src/index');
const { like, eachLike } = require('pactum-matchers');

describe('Interactions - Not Strict - Query', () => {

  it('ignoring all query params', async () => {
    await pactum.spec()
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/mock/query'
        },
        response: {
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
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/mock/query',
          queryParams: {
            id: 1
          }
        },
        response: {
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
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/mock/query',
          queryParams: like({
            id: 2
          })
        },
        response: {
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
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/mock/query',
          queryParams: like({
            id: 2,
            name: 'fall'
          })
        },
        response: {
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
        .useInteraction({
          request: {
            method: 'GET',
            path: '/mock/query',
            queryParams: like({
              id: 2,
              name: 'fall',
              country: 'winter'
            })
          },
          response: {
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
        .useInteraction({
          request: {
            method: 'GET',
            path: '/mock/query',
            queryParams: like({
              id: 2,
              name: 'fall',
              country: 'winter'
            })
          },
          response: {
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

describe('Interactions - Not Strict - Path Params', () => {

  it('including single path param', async () => {
    await pactum.spec()
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/api/users/{user}',
          pathParams: {
            user: 'snow'
          }
        },
        response: {
          status: 200
        }
      })
      .get('http://localhost:9393/api/users/{username}')
      .withPathParams('username', 'snow')
      .expectStatus(200);
  });

  it('including multiple path param', async () => {
    await pactum.spec()
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/api/project/{project}/repo/{repo}/pr/{pr}',
          pathParams: {
            project: 'QA',
            repo: 'automation',
            pr: '1'
          }
        },
        response: {
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
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/api/project/{project}/repo/{repo}/pr/{pr}',
          pathParams: {
            project: 'QA',
            repo: 'automation',
            pr: like('10')
          }
        },
        response: {
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
        .useInteraction({
          strict: false,
          request: {
            method: 'GET',
            path: '/api/project/{project}/repo/{repo}/pr/{pr}',
            pathParams: {
              project: 'QA',
              repo: 'automation',
              pr: '1'
            }
          },
          response: {
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
        .useInteraction({
          strict: false,
          request: {
            method: 'GET',
            path: '/api/project/{project}/repo/{repo}/pr/{pr}',
            pathParams: {
              project: 'QA',
              repo: 'automation',
              pr: '1'
            }
          },
          response: {
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

describe('Interactions - Not Strict - Headers', () => {

  it('expecting an header', async () => {
    let err;
    try {
      await pactum.spec()
        .useInteraction({
          strict: false,
          request: {
            method: 'GET',
            path: '/mock/header',
            headers: {
              'x': 'y'
            }
          },
          response: {
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

describe('Interactions - Not Strict - Body', () => {

  it('ignoring body', async () => {
    await pactum.spec()
      .useInteraction({
        strict: false,
        request: {
          method: 'POST',
          path: '/mock/body'
        },
        response: {
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
      .useInteraction({
        strict: false,
        request: {
          method: 'POST',
          path: '/mock/body',
          body: {
            id: 1
          }
        },
        response: {
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
      .useInteraction({
        strict: false,
        request: {
          method: 'POST',
          path: '/mock/body',
          body: like({
            id: 3,
            married: false
          })
        },
        response: {
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
      .useInteraction({
        strict: false,
        request: {
          method: 'POST',
          path: '/mock/body',
          body: eachLike({
            id: 3,
            married: false
          })
        },
        response: {
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
        .useInteraction({
          strict: false,
          request: {
            method: 'POST',
            path: '/mock/body',
            body: {
              id: 3,
              married: false,
              country: 'True North'
            }
          },
          response: {
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
        .useInteraction({
          strict: false,
          request: {
            method: 'POST',
            path: '/mock/body',
            body: like({
              id: 3,
              married: false,
              country: 'True North'
            })
          },
          response: {
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

describe('Interactions - Not Strict - Wait', () => {

  it('ignoring all query params', async () => {
    await pactum.spec()
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/mock/query'
        },
        response: {
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

describe('Interactions - Not Strict - Follow Redirects', () => {

  it('with Follow Redirects - boolean config', async () => {
    await pactum.spec()
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/mock/redirect'
        },
        response: {
          status: 301,
          headers: {
            'location': 'http://localhost:9393/mock/actual'
          }
        }
      })
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/mock/actual'
        },
        response: {
          status: 200
        }
      })
      .get('http://localhost:9393/mock/redirect')
      .withFollowRedirects(true)
      .expectStatus(200);
  });

  it('with Follow Redirects - count config', async () => {
    await pactum.spec()
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/mock/redirect'
        },
        response: {
          status: 301,
          headers: {
            'location': 'http://localhost:9393/mock/intermediate/1'
          }
        }
      })
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/mock/intermediate/1'
        },
        response: {
          status: 301,
          headers: {
            'location': 'http://localhost:9393/mock/intermediate/2'
          }
        }
      })
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/mock/intermediate/2'
        },
        response: {
          status: 301,
          headers: {
            'location': 'http://localhost:9393/mock/intermediate/3'
          }
        }
      })
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/mock/intermediate/3'
        },
        response: {
          status: 301,
          headers: {
            'location': 'http://localhost:9393/mock/actual'
          }
        }
      })
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/mock/actual'
        },
        response: {
          status: 200
        }
      })
      .get('http://localhost:9393/mock/redirect')
      .withFollowRedirects(4)
      .expectStatus(200);
  });

  it('without Follow Redirects', async () => {
    await pactum.spec()
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/mock/redirect'
        },
        response: {
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
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/mock/redirect'
        },
        response: {
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
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/mock/redirect'
        },
        response: {
          status: 301,
          headers: {
            'location': 'http://localhost:9393/mock/actual'
          }
        }
      })
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/mock/actual'
        },
        response: {
          status: 200
        }
      })
      .get('http://localhost:9393/mock/redirect')
      .expectStatus(200);
  });

  it('with default Follow Redirects - count config', async () => {
    pactum.request.setDefaultFollowRedirects(1);
    await pactum.spec()
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/mock/redirect'
        },
        response: {
          status: 301,
          headers: {
            'location': 'http://localhost:9393/mock/actual'
          }
        }
      })
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/mock/actual'
        },
        response: {
          status: 200
        }
      })
      .get('http://localhost:9393/mock/redirect')
      .expectStatus(200);
  });

  it('with Follow Redirects as false & default as true', async () => {
    pactum.request.setDefaultFollowRedirects(true);
    await pactum.spec()
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/mock/redirect'
        },
        response: {
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

  it('with Follow Redirects as 0 & default as 1', async () => {
    pactum.request.setDefaultFollowRedirects(1);
    await pactum.spec()
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/mock/redirect'
        },
        response: {
          status: 301,
          headers: {
            'location': 'http://localhost:9393/mock/actual'
          }
        }
      })
      .get('http://localhost:9393/mock/redirect')
      .withFollowRedirects(0)
      .expectStatus(301);
  });

  it('with Follow Redirects as 1 & default as 0', async () => {
    pactum.request.setDefaultFollowRedirects(0);
    await pactum.spec()
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/mock/redirect'
        },
        response: {
          status: 301,
          headers: {
            'location': 'http://localhost:9393/mock/actual'
          }
        }
      })
      .useInteraction({
        strict: false,
        request: {
          method: 'GET',
          path: '/mock/actual'
        },
        response: {
          status: 200
        }
      })
      .get('http://localhost:9393/mock/redirect')
      .withFollowRedirects(1)
      .expectStatus(200);
  });

  afterEach(() => {
    pactum.request.setDefaultFollowRedirects(false);
  });

});

describe('Interactions - Response - Headers', () => {

  it('with custom content-type headers', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/custom/header'
        },
        response: {
          status: 200,
          headers: {
            'content-type': 'any'
          },
          body: {
            message: 'hello'
          }
        }
      })
      .get('http://localhost:9393/custom/header')
      .expectStatus(200)
      .expectHeader('content-type', 'any')
      .expectJson('message', 'hello');
  });

});