const expect = require('chai').expect;
const pactum = require('../../src/index');

describe('Provider Verification - Pact Broker', () => {

  before(() => {
    return pactum.mock.start();
  });

  it('single interaction - valid - without authentication', () => {
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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

  it('single interaction - valid - with pact broker token', () => {
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
      pactBrokerToken: 'dXNlcjpwYXNz',
      providerBaseUrl: 'http://localhost:9393',
      provider: 'user-service',
      providerVersion: '1.2.3',
      publishVerificationResult: true
    });
  });

  it('single interaction - valid - without publishing results', () => {
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    return pactum.provider.validate({
      pactBrokerUrl: 'http://localhost:9393',
      providerBaseUrl: 'http://localhost:9393',
      provider: 'user-service',
      providerVersion: '1.2.3',
      publishVerificationResult: false
    });
  });

  it('single interaction - valid - with state handlers', () => {
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.clearDefaultInteractions();
  });

  after(() => {
    return pactum.mock.stop();
  });

});

describe('Provider Verification - Local Pacts', () => {

  before(() => {
    return pactum.mock.start();
  });

  it('multiple interactions - valid', () => {
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.clearDefaultInteractions();
  });

  after(() => {
    return pactum.mock.stop();
  });

});