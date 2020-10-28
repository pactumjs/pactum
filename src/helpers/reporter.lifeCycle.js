const reporter = require('../exports/reporter');

const rlc = {

  afterSpecReport(spec) {
    const data = {};
    data.id = spec.id;
    data.info = {
      id: spec.id,
      name: spec._name,
      status: spec.status,
      failure: spec.failure,
      start: spec.start,
      end: Date.now().toString(),
    };
    data.request = {
      method: spec._request.method,
      path: spec._request.url,
      headers: spec._request.headers,
      body: spec._request.data
    };
    if (spec._response) {
      data.response = {
        statusCode: spec._response.statusCode,
        headers: spec._response.headers,
        body: spec._response.json || '',
        responseTime: spec._response.responseTime
      }
    }
    data.recorded = spec.recorded;
    reporter.afterSpec(data);
  },

  afterStepReport(step) {
    const data = {
      id: step.id,
      name: step.name,
      specs: step.specs.map(spec => spec.id),
      cleans: step.cleans.map(spec => spec.id)
    }
    reporter.afterStep(data);
  },

  afterTestReport(test) {
    const data = {
      id: test.id,
      name: test.name,
      steps: test.steps.map(step => step.id)
    }
    reporter.afterTest(data);
  }

}

module.exports = rlc;