const config = {
  mock: {
    port: process.env.PACTUM_MOCK_PORT || 9393
  },
  pact: {
    consumer: process.env.PACTUM_PACT_CONSUMER_NAME || '',
    dir: process.env.PACTUM_PACT_DIR || './pacts/'
  },
  request: {
    baseUrl: process.env.PACTUM_REQUEST_BASE_URL || '',
    timeout: process.env.PACTUM_REQUEST_TIMEOUT ? parseInt(process.env.PACTUM_REQUEST_TIMEOUT) : 3000,
    headers: {}
  }
};

module.exports = config;