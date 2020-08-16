const pactum = require('../../src/index');
const expect = require('chai').expect;

describe('Retries', () => {

  it('retry strategy', async () => {
    await pactum
      .addMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/projects/1'
        },
        willRespondWith: {
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
        strategy: (req, res) => res.statusCode !== 200
      })
      .expectStatus(200)
      .toss();
  });

  it('should not retry with default retry options', async () => {
    await pactum
      .addMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/projects/1'
        },
        willRespondWith: {
          onCall: {
            0: {
              status: 200
            }
          }
        }
      })
      .get('http://localhost:9393/api/projects/1')
      .retry({
        strategy: (req, res) => res.statusCode !== 200
      })
      .expectStatus(200)
      .toss();
  });

  it('custom retry strategy', async () => {
    pactum.handler.addRetryHandler('RetryTill200', (req, res) => res.statusCode !== 200);
    await pactum
      .addMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/projects/1'
        },
        willRespondWith: {
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
      await pactum
        .addMockInteraction({
          withRequest: {
            method: 'GET',
            path: '/api/projects/1'
          },
          willRespondWith: {
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
    expect(err.message).contains('Retry Handler Not Found - RetryTill400');
  });

});