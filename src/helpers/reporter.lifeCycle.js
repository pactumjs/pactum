const reporter = require('../exports/reporter');
const helper = require('../helpers/helper');

const rlc = {

  afterSpecReport(spec) {
    if (reporter.get().length > 0) {
      const data = {};
      data.id = spec.id;
      data.flow = spec.flow;
      data.info = {
        id: spec.id,
        name: spec._name,
        status: spec.status,
        failure: spec.failure,
        start: spec.start,
        end: helper.getCurrentTime(),
      };
      data.request = {
        url: spec._request.url,
        method: spec._request.method,
        path: spec._request.path,
        headers: spec._request.headers,
        body: spec._request.data
      };
      if (spec._response) {
        data.response = {
          statusCode: spec._response.statusCode,
          headers: spec._response.headers,
          body: spec._response.json || '',
          responseTime: spec._response.responseTime
        };
      }
      data.recorded = spec.recorded;
      data.interactions = spec.interactions;
      reporter.afterSpec(data);
    }
  },

  afterStepReport(step) {
    if (reporter.get().length > 0) {
      const data = {
        id: step.id,
        name: step.name,
        specs: step.specs.map(spec => spec.id),
        cleans: step.cleans.map(spec => spec.id)
      };
      reporter.afterStep(data);
    }

  },

  afterTestReport(test) {
    if (reporter.get().length > 0) {
      const data = {
        id: test.id,
        name: test.name,
        steps: test.steps.map(step => step.id)
      };
      reporter.afterTest(data);
    }
  }

};

module.exports = rlc;