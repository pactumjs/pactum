const config = {
  mock: {
    port: process.env.PACTUM_MOCK_PORT || 9393,
    remote: ''
  },
  request: {
    baseUrl: process.env.PACTUM_REQUEST_BASE_URL || '',
    timeout: process.env.PACTUM_REQUEST_TIMEOUT ? parseInt(process.env.PACTUM_REQUEST_TIMEOUT) : 3000,
    headers: {},
    followRedirects: false
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