const config = {
  mock: {
    port: process.env.PACTUM_MOCK_PORT || 9393
  },
  pact: {
    consumer: process.env.PACTUM_PACT_CONSUMER_NAME || '',
    dir: process.env.PACTUM_PACT_DIR || './pacts/'
  },
  request: {
    baseUrl: '',
    timeout: 3000,
    headers: {}
  }
};

module.exports = config;