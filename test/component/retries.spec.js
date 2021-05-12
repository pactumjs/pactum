const pactum = require('../../src/index');
const expect = require('chai').expect;

describe('Retries', () => {

  it('default retry', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1'
        },
        response: {
          onCall: {
            0: {
              status: 202
            },
            1: {
              status: 200
            }
          }
        },
        expects: {
          callCount: 2
        }
      })
      .get('http://localhost:9393/api/projects/1')
      .retry()
      .expectStatus(200)
      .toss();
  });

  it('retry with custom count', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1'
        },
        response: {
          onCall: {
            0: {
              status: 202
            },
            1: {
              status: 202
            },
            2: {
              status: 200
            }
          }
        },
        expects: {
          callCount: 3
        }
      })
      .get('http://localhost:9393/api/projects/1')
      .retry(2)
      .expectStatus(200)
      .toss();
  });

  it('retry with custom count & delay', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1'
        },
        response: {
          onCall: {
            0: {
              status: 202
            },
            1: {
              status: 200
            }
          }
        },
        expects: {
          callCount: 2
        }
      })
      .get('http://localhost:9393/api/projects/1')
      .retry(3, 1)
      .expectStatus(200)
      .toss();
  });

  it('retry strategy', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1'
        },
        response: {
          onCall: {
            0: {
              status: 202
            },
            1: {
              status: 200
            }
          }
        },
        expects: {
          callCount: 2
        }
      })
      .get('http://localhost:9393/api/projects/1')
      .retry({
        delay: 1,
        count: 1,
        strategy: ({ res }) => res.statusCode === 200
      })
      .expectStatus(200)
      .toss();
  });

  it('should not retry with default retry options', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1'
        },
        response: {
          onCall: {
            0: {
              status: 200
            }
          }
        },
        expects: {
          callCount: 1
        }
      })
      .get('http://localhost:9393/api/projects/1')
      .retry({
        strategy: ({ res }) => res.statusCode === 200
      })
      .expectStatus(200)
      .toss();
  });

  it('custom retry strategy', async () => {
    pactum.handler.addRetryHandler('RetryTill200', ({ res }) => res.statusCode === 200);
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1'
        },
        response: {
          onCall: {
            0: {
              status: 202
            },
            1: {
              status: 200
            }
          }
        }
      })
      .get('http://localhost:9393/api/projects/1')
      .retry({
        delay: 1,
        count: 1,
        strategy: 'RetryTill200'
      })
      .expectStatus(200)
      .toss();
  });

  it('unknown retry strategy', async () => {
    let err;
    try {
      await pactum.spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/api/projects/1'
          },
          response: {
            onCall: {
              0: {
                status: 202
              },
              1: {
                status: 200
              }
            }
          }
        })
        .get('http://localhost:9393/api/projects/1')
        .retry({
          delay: 1,
          count: 1,
          strategy: 'RetryTill400'
        })
        .expectStatus(200)
        .toss();
    } catch (error) {
      err = error;
    }
    expect(err.message).contains(`Retry Handler Not Found - 'RetryTill400'`);
  });

});

describe('Wait', () => {

  it('valid wait with spec', async () => {
    const spec = pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/status'
        },
        response: {
          onCall: {
            0: {
              status: 202
            },
            1: {
              status: 200
            }
          }
        },
        expects: {
          callCount: 2
        }
      })
      .get('http://localhost:9393/api/status')
      .retry({
        delay: 1,
        count: 1,
        strategy: ({ res }) => res.statusCode === 200
      })
      .expectStatus(200)
      .toss();

    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/wait'
        },
        response: {
          status: 200
        }
      })
      .get('http://localhost:9393/api/wait')
      .wait(spec)
      .expectStatus(200);
  });

  it('invalid wait with spec', async () => {
    const spec = pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/status'
        },
        response: {
          onCall: {
            0: {
              status: 202
            },
            1: {
              status: 400
            }
          }
        },
        expects: {
          callCount: 2
        }
      })
      .get('http://localhost:9393/api/status')
      .retry({
        delay: 1,
        count: 1,
        strategy: ({ res }) => res.statusCode === 200
      })
      .expectStatus(200)
      .toss();
    let err;
    try {
      await pactum.spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/api/wait'
          },
          response: {
            status: 200
          }
        })
        .get('http://localhost:9393/api/wait')
        .wait(spec)
        .expectStatus(200);
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

});