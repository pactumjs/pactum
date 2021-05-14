const reporter = require('../exports/reporter');
const helper = require('../helpers/helper');

const rlc = {

  afterSpecReport(spec) {
    if (reporter.get().length > 0) {
      const data = {};
      data.id = spec.id;
      data.flow = spec.flow;
      data.name = spec._name,
      data.status = spec.status,
      data.failure = spec.failure,
      data.start = spec.start,
      data.end = helper.getCurrentTime(),
      data.request = {
        url: spec._request.url,
        method: spec._request.method,
        path: spec._request.path,
        pathParams: spec._request.pathParams,
        queryParams: spec._request.queryParams,
        headers: spec._request.headers,
        body: spec._request.body
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
  },

  afterInteraction(interaction) {
    reporter.afterInteraction(interaction);
  }

};

module.exports = rlc;