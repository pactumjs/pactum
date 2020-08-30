const expect = require('chai').expect;
const pactum = require('../../src/index');
const mock = require('../../src/exports/mock');

describe('Provider Verification - Pact Broker', () => {

  before(() => {
    return mock.start();
  });

  it('single interaction - valid - without authentication', () => {
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/pacts/provider/user-service/latest'
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
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/pacts/provider/user-service/consumer/ms/version/1.0.1'
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
    mock.addMockInteraction({
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
    mock.addMockInteraction({
      withRequest: {
        method: 'POST',
        path: '/pacts/provider/facade/consumer/ms/pact-version/96f74491025ab7b36a4d4314e82857903b0dc2f2/verification-results',
        headers: {
          'content-type': 'application/json'
        },
        body: { success: true, providerApplicationVersion: '1.2.3' }
      },
      willRespondWith: {
        status: 200
      }
    });
    return pactum.provider.validate({
      pactBrokerUrl: 'http://localhost:9393',
      providerBaseUrl: 'http://localhost:9393',
      provider: 'user-service',
      providerVersion: '1.2.3',
      publishVerificationResult: true
    });
  });

  it('single interaction - valid - with pact broker user & password', () => {
    mock.addMockInteraction({
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
    mock.addMockInteraction({
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
    mock.addMockInteraction({
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
    mock.addMockInteraction({
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

  it('single interaction - valid - with pact broker token', () => {
    mock.addMockInteraction({
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
    mock.addMockInteraction({
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
    mock.addMockInteraction({
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
    mock.addMockInteraction({
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
      pactBrokerToken: 'dXNlcjpwYXNz',
      providerBaseUrl: 'http://localhost:9393',
      provider: 'user-service',
      providerVersion: '1.2.3',
      publishVerificationResult: true
    });
  });

  it('single interaction - valid - without publishing results', () => {
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/pacts/provider/user-service/latest'
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
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/pacts/provider/user-service/consumer/ms/version/1.0.1'
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
    mock.addMockInteraction({
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
    return pactum.provider.validate({
      pactBrokerUrl: 'http://localhost:9393',
      providerBaseUrl: 'http://localhost:9393',
      provider: 'user-service',
      providerVersion: '1.2.3',
      publishVerificationResult: false
    });
  });

  it('single interaction - valid - with state handlers', () => {
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/pacts/provider/user-service/latest'
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
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/pacts/provider/user-service/consumer/ms/version/1.0.1'
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
                "path": "/api/v1/bank-info/intents",
                "query": "id=1"
              },
              "response": {
                "status": 200,
                "headers": {},
                "body": {
                  "id": 1
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
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/api/v1/bank-info/intents',
        query: {
          id: '1'
        }
      },
      willRespondWith: {
        status: 200,
        body: {
          "id": 1
        }
      }
    });
    mock.addMockInteraction({
      withRequest: {
        method: 'POST',
        path: '/pacts/provider/facade/consumer/ms/pact-version/96f74491025ab7b36a4d4314e82857903b0dc2f2/verification-results',
        headers: {
          'content-type': 'application/json'
        },
        body: { success: true, providerApplicationVersion: '1.2.3' }
      },
      willRespondWith: {
        status: 200
      }
    });
    return pactum.provider.validate({
      pactBrokerUrl: 'http://localhost:9393',
      providerBaseUrl: 'http://localhost:9393',
      provider: 'user-service',
      providerVersion: '1.2.3',
      publishVerificationResult: true,
      stateHandlers: {
        "it has intents": async function () { }
      }
    });
  });

  it('single interaction - valid - expect just status', () => {
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/pacts/provider/user-service/latest'
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
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/pacts/provider/user-service/consumer/ms/version/1.0.1'
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
                "path": "/api/v1/bank-info/intents",
                "query": "id=1"
              },
              "response": {
                "status": 200
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
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/api/v1/bank-info/intents',
        query: {
          id: '1'
        }
      },
      willRespondWith: {
        status: 200,
        body: {
          "id": 1
        }
      }
    });
    mock.addMockInteraction({
      withRequest: {
        method: 'POST',
        path: '/pacts/provider/facade/consumer/ms/pact-version/96f74491025ab7b36a4d4314e82857903b0dc2f2/verification-results',
        headers: {
          'content-type': 'application/json'
        },
        body: { success: true, providerApplicationVersion: '1.2.3' }
      },
      willRespondWith: {
        status: 200
      }
    });
    return pactum.provider.validate({
      pactBrokerUrl: 'http://localhost:9393',
      providerBaseUrl: 'http://localhost:9393',
      provider: 'user-service',
      providerVersion: '1.2.3',
      publishVerificationResult: true,
      stateHandlers: {
        "it has intents": async function () { }
      }
    });
  });

  it('single interaction - valid - expect headers', () => {
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/pacts/provider/user-service/latest'
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
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/pacts/provider/user-service/consumer/ms/version/1.0.1'
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
                "path": "/api/v1/bank-info/intents",
                "query": "id=1"
              },
              "response": {
                "status": 200,
                "headers": {
                  "content-type": "application/json"
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
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/api/v1/bank-info/intents',
        query: {
          id: '1'
        }
      },
      willRespondWith: {
        status: 200,
        headers: {
          "content-type": "application/json"
        },
        body: {
          "id": 1
        }
      }
    });
    mock.addMockInteraction({
      withRequest: {
        method: 'POST',
        path: '/pacts/provider/facade/consumer/ms/pact-version/96f74491025ab7b36a4d4314e82857903b0dc2f2/verification-results',
        headers: {
          'content-type': 'application/json'
        },
        body: { success: true, providerApplicationVersion: '1.2.3' }
      },
      willRespondWith: {
        status: 200
      }
    });
    return pactum.provider.validate({
      pactBrokerUrl: 'http://localhost:9393',
      providerBaseUrl: 'http://localhost:9393',
      provider: 'user-service',
      providerVersion: '1.2.3',
      publishVerificationResult: true,
      stateHandlers: {
        "it has intents": async function () { }
      }
    });
  });

  it('single interaction - valid - custom provider headers', () => {
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/pacts/provider/user-service/latest'
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
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/pacts/provider/user-service/consumer/ms/version/1.0.1'
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
                "path": "/api/v1/bank-info/intents",
                "query": "id=1"
              },
              "response": {
                "status": 200,
                "headers": {
                  "content-type": "application/json"
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
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/api/v1/bank-info/intents',
        query: {
          id: '1'
        },
        headers: {
          'some': 'value'
        }
      },
      willRespondWith: {
        status: 200,
        headers: {
          "content-type": "application/json"
        },
        body: {
          "id": 1
        }
      }
    });
    mock.addMockInteraction({
      withRequest: {
        method: 'POST',
        path: '/pacts/provider/facade/consumer/ms/pact-version/96f74491025ab7b36a4d4314e82857903b0dc2f2/verification-results',
        headers: {
          'content-type': 'application/json'
        },
        body: { success: true, providerApplicationVersion: '1.2.3' }
      },
      willRespondWith: {
        status: 200
      }
    });
    return pactum.provider.validate({
      pactBrokerUrl: 'http://localhost:9393',
      providerBaseUrl: 'http://localhost:9393',
      provider: 'user-service',
      providerVersion: '1.2.3',
      publishVerificationResult: true,
      stateHandlers: {
        "it has intents": async function () { }
      },
      customProviderHeaders: {
        'some': 'value'
      }
    });
  });

  it('single interaction - fail status', async () => {
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/pacts/provider/user-service/latest'
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
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/pacts/provider/user-service/consumer/ms/version/1.0.1'
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
                "path": "/api/v1/bank-info/intents",
                "query": "id=1"
              },
              "response": {
                "status": 200
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
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/api/v1/bank-info/intents',
        query: {
          id: '1'
        }
      },
      willRespondWith: {
        status: 500,
        body: {
          "id": 1
        }
      }
    });
    mock.addMockInteraction({
      withRequest: {
        method: 'POST',
        path: '/pacts/provider/facade/consumer/ms/pact-version/96f74491025ab7b36a4d4314e82857903b0dc2f2/verification-results',
        headers: {
          'content-type': 'application/json'
        },
        body: { success: false, providerApplicationVersion: '1.2.3' }
      },
      willRespondWith: {
        status: 200
      }
    });
    let err;
    try {
      await pactum.provider.validate({
        pactBrokerUrl: 'http://localhost:9393',
        providerBaseUrl: 'http://localhost:9393',
        provider: 'user-service',
        providerVersion: '1.2.3',
        publishVerificationResult: true,
        stateHandlers: {
          "it has intents": async function () { }
        }
      });
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Provider Verification Failed');
  });

  it('single interaction - fail headers', async () => {
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/pacts/provider/user-service/latest'
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
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/pacts/provider/user-service/consumer/ms/version/1.0.1'
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
                "path": "/api/v1/bank-info/intents",
                "query": "id=1"
              },
              "response": {
                "status": 200,
                "headers": {
                  "some": "value"
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
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/api/v1/bank-info/intents',
        query: {
          id: '1'
        }
      },
      willRespondWith: {
        status: 200,
        body: {
          "id": 1
        }
      }
    });
    mock.addMockInteraction({
      withRequest: {
        method: 'POST',
        path: '/pacts/provider/facade/consumer/ms/pact-version/96f74491025ab7b36a4d4314e82857903b0dc2f2/verification-results',
        headers: {
          'content-type': 'application/json'
        },
        body: { success: false, providerApplicationVersion: '1.2.3' }
      },
      willRespondWith: {
        status: 200
      }
    });
    let err;
    try {
      await pactum.provider.validate({
        pactBrokerUrl: 'http://localhost:9393',
        providerBaseUrl: 'http://localhost:9393',
        provider: 'user-service',
        providerVersion: '1.2.3',
        publishVerificationResult: true,
        stateHandlers: {
          "it has intents": async function () { }
        }
      });
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Provider Verification Failed');
  });

  it('single interaction - fail body', async () => {
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/pacts/provider/user-service/latest'
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
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/pacts/provider/user-service/consumer/ms/version/1.0.1'
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
                "path": "/api/v1/bank-info/intents",
                "query": "id=1"
              },
              "response": {
                "status": 200,
                "headers": {},
                "body": {
                  "name": "fake"
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
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/api/v1/bank-info/intents',
        query: {
          id: '1'
        }
      },
      willRespondWith: {
        status: 200,
        body: {
          "id": 1
        }
      }
    });
    mock.addMockInteraction({
      withRequest: {
        method: 'POST',
        path: '/pacts/provider/facade/consumer/ms/pact-version/96f74491025ab7b36a4d4314e82857903b0dc2f2/verification-results',
        headers: {
          'content-type': 'application/json'
        },
        body: { success: false, providerApplicationVersion: '1.2.3' }
      },
      willRespondWith: {
        status: 200
      }
    });
    let err;
    try {
      await pactum.provider.validate({
        pactBrokerUrl: 'http://localhost:9393',
        providerBaseUrl: 'http://localhost:9393',
        provider: 'user-service',
        providerVersion: '1.2.3',
        publishVerificationResult: true,
        stateHandlers: {
          "it has intents": async function () { }
        }
      });
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Provider Verification Failed');
  });

  afterEach(() => {
    mock.reset();
  });

  after(() => {
    return mock.stop();
  });

});

describe('Provider Verification - Local Pacts', () => {

  before(() => {
    return mock.start();
  });

  it('multiple interactions - valid', () => {
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/api/projects/1'
      },
      willRespondWith: {
        status: 200,
        body: {
          "id": 1,
          "name": "fake"
        }
      }
    });
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/api/projects/2'
      },
      willRespondWith: {
        status: 200,
        body: {
          "id": 1,
          "name": "fake",
          "gender": "M",
          "married": true,
          "favorite": {
            "books": [
              "Harry Porter"
            ]
          },
          "addresses": [
            {
              "street": "Road No. 60"
            }
          ]
        }
      }
    });
    return pactum.provider.validate({
      pactFilesOrDirs: [ './test/unit/data/billing-service-user-service.json' ],
      providerBaseUrl: 'http://localhost:9393',
      provider: 'user-service'
    });
  });

  afterEach(() => {
    mock.reset();
  });

  after(() => {
    return mock.stop();
  });

});

describe('Provider Verification - Invalid Options', () => {

  it('undefined', async () => {
    let err;
    try {
      await pactum.provider.validate();
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid provider options provided - undefined');
  });

  it('no provider base url', async () => {
    let err;
    try {
      await pactum.provider.validate({});
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid provider base url provided - undefined');
  });

  it('empty provider base url', async () => {
    let err;
    try {
      await pactum.provider.validate({ providerBaseUrl: '' });
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid provider base url provided - ');
  });

  it('no provider', async () => {
    let err;
    try {
      await pactum.provider.validate({
        providerBaseUrl: 'http'
      });
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid provider name provided - undefined');
  });

  it('empty provider', async () => {
    let err;
    try {
      await pactum.provider.validate({
        providerBaseUrl: 'http',
        provider: ''
      });
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid provider name provided - ');
  });

  it('no pact url or pact broker url', async () => {
    let err;
    try {
      await pactum.provider.validate({
        providerBaseUrl: 'http',
        provider: 'some-service'
      });
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid pact-broker url (undefined) provided & invalid pact local files (undefined) provided');
  });

  it('empty pact broker url', async () => {
    let err;
    try {
      await pactum.provider.validate({
        providerBaseUrl: 'http',
        provider: 'some-service',
        pactBrokerUrl: ''
      });
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid pact-broker url () provided & invalid pact local files (undefined) provided');
  });

  it('string pactFilesOrDirs', async () => {
    let err;
    try {
      await pactum.provider.validate({
        providerBaseUrl: 'http',
        provider: 'some-service',
        pactFilesOrDirs: 's'
      });
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid array of pact files or folders (s) provided');
  });

  it('empty pactFilesOrDirs', async () => {
    let err;
    try {
      await pactum.provider.validate({
        providerBaseUrl: 'http',
        provider: 'some-service',
        pactFilesOrDirs: []
      });
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Empty array of pact files or folders provided');
  });

  it('publishVerificationResult without pact broker url', async () => {
    let err;
    try {
      await pactum.provider.validate({
        providerBaseUrl: 'http',
        provider: 'some-service',
        pactFilesOrDirs: [ '' ],
        publishVerificationResult: true
      });
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid pact broker url provided - undefined');
  });

  it('publishVerificationResult without provider version', async () => {
    let err;
    try {
      await pactum.provider.validate({
        providerBaseUrl: 'http',
        provider: 'some-service',
        pactFilesOrDirs: [ '' ],
        pactBrokerUrl: 'http',
        publishVerificationResult: true
      });
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid provider version provided - undefined');
  });

  it('publishVerificationResult with empty provider version', async () => {
    let err;
    try {
      await pactum.provider.validate({
        providerBaseUrl: 'http',
        provider: 'some-service',
        pactFilesOrDirs: [ '' ],
        pactBrokerUrl: 'http',
        publishVerificationResult: true,
        providerVersion: ''
      });
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid provider version provided - ');
  });

  it('string custom headers', async () => {
    let err;
    try {
      await pactum.provider.validate({
        providerBaseUrl: 'http',
        provider: 'some-service',
        pactFilesOrDirs: [ '' ],
        customProviderHeaders: ' a '
      });
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid custom headers provided -  a ');
  });

  it('string state handlers', async () => {
    let err;
    try {
      await pactum.provider.validate({
        providerBaseUrl: 'http',
        provider: 'some-service',
        pactFilesOrDirs: [ '' ],
        stateHandlers: ' a '
      });
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid state handlers provided -  a ');
  });

  it('string state handlers functions', async () => {
    let err;
    try {
      await pactum.provider.validate({
        providerBaseUrl: 'http',
        provider: 'some-service',
        pactFilesOrDirs: [ '' ],
        stateHandlers: {
          a: function() {},
          b: ''
        }
      });
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid state handlers function provided for - b');
  });

});