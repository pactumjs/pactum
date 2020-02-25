const pactum = require('../../src/index');

describe('Provider Verification', () => {

  before(() => {
    return pactum.mock.start();
  });

  it('single interaction', () => {
    pactum.mock.addDefaultMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/pacts/provider/user-service/latest',
        headers: {
          authorization: 'Basic dXNlcjpwYXNz'
        }
      },
      willRespondWith: {
        status: 200,
        body: {
          "_links": {
            "pb:pacts": [
              {
                "href": "https://test.pact.dius.com.au/pacts/provider/facade/consumer/ms/version/1.0.1",
                "title": "Pact between ms (1.0.1) and facade",
                "name": "ms"
              }
            ]
          }
        }
      }
    });
    pactum.mock.addDefaultMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/pacts/provider/user-service/consumer/ms/version/1.0.1',
        headers: {
          authorization: 'Basic dXNlcjpwYXNz'
        }
      },
      willRespondWith: {
        status: 200,
        body: {
          "consumer": {
            "name": "ms"
          },
          "provider": {
            "name": "facade"
          },
          "interactions": [
            {
              "description": "a request to retrieve intent list",
              "providerState": "it has intents",
              "request": {
                "method": "GET",
                "path": "/api/v1/bank-info/intents"
              },
              "response": {
                "status": 200,
                "headers": {},
                "body": [
                  {
                    "useIntentionCode": "AAA",
                    "useIntentionDescFr": "Achat maison",
                    "useIntentionDescEn": "Buying of a house"
                  }
                ],
                "matchingRules": {
                  "$.body": {
                    "min": 1
                  },
                  "$.body[*].*": {
                    "match": "type"
                  },
                  "$.body[*].useIntentionCode": {
                    "match": "type"
                  },
                  "$.body[*].useIntentionDescFr": {
                    "match": "type"
                  },
                  "$.body[*].useIntentionDescEn": {
                    "match": "type"
                  }
                }
              }
            }
          ],
          "metadata": {
            "pactSpecification": {
              "version": "3.0.0"
            }
          },
          "createdAt": "2018-07-03T19:40:41+00:00",
          "_links": {
            "pb:publish-verification-results": {
              "title": "Publish verification results",
              "href": "https://test.pact.dius.com.au/pacts/provider/facade/consumer/ms/pact-version/96f74491025ab7b36a4d4314e82857903b0dc2f2/verification-results"
            }
          }
        }
      }
    });
    pactum.mock.addDefaultMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/api/v1/bank-info/intents'
      },
      willRespondWith: {
        status: 200,
        body: [
          {
            "useIntentionCode": "A",
            "useIntentionDescFr": "B",
            "useIntentionDescEn": "Buying of a house"
          },
          {
            "useIntentionCode": "C",
            "useIntentionDescFr": "D",
            "useIntentionDescEn": "Buying of a farm"
          }
        ]
      }
    });
    pactum.mock.addDefaultMockInteraction({
      withRequest: {
        method: 'POST',
        path: '/pacts/provider/facade/consumer/ms/pact-version/96f74491025ab7b36a4d4314e82857903b0dc2f2/verification-results',
        headers: {
          'content-type': 'application/json',
          authorization: 'Basic dXNlcjpwYXNz'
        },
        body: { success: true, providerApplicationVersion: '1.2.3' }
      },
      willRespondWith: {
        status: 200
      }
    });
    return pactum.provider.validate({
      pactBrokerUrl: 'http://localhost:9393',
      pactBrokerUsername: 'user',
      pactBrokerPassword: 'pass',
      providerBaseUrl: 'http://localhost:9393',
      provider: 'user-service',
      providerVersion: '1.2.3',
      publishVerificationResult: true
    });
  });

  afterEach(() => {
    pactum.mock.clearDefaultInteractions();
  });

  after(() => {
    return pactum.mock.stop();
  });
});