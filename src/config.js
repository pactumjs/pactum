const config = {
  mock: {
    port: process.env.PACTUM_MOCK_PORT || 9393,
    host: process.env.PACTUM_MOCK_HOST || '0.0.0.0',
    remote: '',
    isHttps: false,
    httpsOpts: {
      key: '',
      cert: ''
    }
  },
  request: {
    baseUrl: process.env.PACTUM_REQUEST_BASE_URL || '',
    timeout: process.env.PACTUM_REQUEST_TIMEOUT ? parseInt(process.env.PACTUM_REQUEST_TIMEOUT) : 3000,
    headers: {},
    followRedirects: {
      enabled: false,
      count: 20
    },
    retry: {
      count: 1,
      delay: 1000
    },
    disable_use_interaction: process.env.PACTUM_DISABLE_USE_INTERACTION || false,
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
  redact_headers_list: ['authorization', 'cookie', 'x-api-key'],
  redact_headers_text: '[REDACTED]',
  disable_redact_headers: false,
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
      processed: false,
      direct_override: false,
    },
    dir: 'data'
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