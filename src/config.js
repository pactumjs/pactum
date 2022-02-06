const config = {
  mock: {
    port: process.env.PACTUM_MOCK_PORT || 9393,
    host: process.env.PACTUM_MOCK_HOST || '0.0.0.0',
    remote: ''
  },
  request: {
    baseUrl: process.env.PACTUM_REQUEST_BASE_URL || '',
    timeout: process.env.PACTUM_REQUEST_TIMEOUT ? parseInt(process.env.PACTUM_REQUEST_TIMEOUT) : 3000,
    headers: {},
    followRedirects: false,
    retry: {
      count: 1,
      delay: 1000
    }
  },
  response: {
    time: process.env.PACTUM_RESPONSE_TIME ? parseInt(process.env.PACTUM_RESPONSE_TIME) : null,
    status: process.env.PACTUM_RESPONSE_STATUS ? parseInt(process.env.PACTUM_RESPONSE_STATUS) : null,
    headers: {},
    expectHandlers: [],
    wait: {
      duration: 1000,
      polling: 100
    }
  },
  data: {
    ref: {
      map: {
        enabled: false,
        processed: false
      },
      fun: {
        enabled: false
      },
      spec: {
        enabled: false
      }
    },
    template: {
      enabled: false,
      processed: false
    }
  },
  strategy: {
    assert: {
      handler: {
        starts: '#'
      },
      expression: {
        includes: '$V'
      }
    },
    capture: {
      handler: {
        starts: '#'
      }
    }
  },
  snapshot: {
    dir: '.pactum/snapshots'
  },
  reporter : {
    autoRun: true
  }
};

module.exports = config;