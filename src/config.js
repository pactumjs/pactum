const config = {
  mock: {
    port: process.env.PACTUM_MOCK_PORT || 9393
  },
  pact: {
    consumer: process.env.PACT_CONSUMER_NAME || '',
    dir: process.env.PACT_DIR || './pacts/',
    brokerUrl : process.env.PACT_BROKER_URL || '',
    brokerUser: process.env.PACT_BROKER_USERNAME || '',
    brokerPass: process.env.PACT_BROKER_PASSWORD || ''
  },
  request: {
    baseUrl: process.env.PACTUM_REQUEST_BASE_URL || '',
    timeout: process.env.PACTUM_REQUEST_TIMEOUT ? parseInt(process.env.PACTUM_REQUEST_TIMEOUT) : 3000,
    headers: {}
  },
  data: {
    ref: {
      map: {
        enabled: false,
        processed: false
      },
      fun: {
        enabled: false
      }
    },
    template: {
      enabled: false,
      processed: false
    }
  }
};

module.exports = config;