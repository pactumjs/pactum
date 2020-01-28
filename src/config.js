const config = {
  mock: {
    port: process.env.PACTUM_MOCK_PORT || 9393
  },
  pact: {
    consumer: process.env.PACTUM_PACT_CONSUMER_NAME || '',
    dir: process.env.PACTUM_PACT_DIR || './pacts/'
  }
};

module.exports = config;