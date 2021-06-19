const Step = require('./Step');
const log = require('../plugins/logger');
const helper = require('../helpers/helper');
const rlc = require('../helpers/reporter.lifeCycle');

class E2E {

  constructor(options) {
    this.id = helper.getRandomId();
    if (typeof options === 'string') {
      this.name = options;
      this.params = {};
    } else {
      this.name = options.name;
      this.params = options.params;
    }
    this.steps = [];
  }

  step(name) {
    reportStep(this.steps);
    const bail = this.steps.some(_step => _step.specs.some(spec => spec.status === 'FAILED'));
    const _step = new Step(name, bail);
    this.steps.push(_step);
    return _step;
  }

  async cleanup() {
    reportStep(this.steps);
    const errors = [];
    for (let i = this.steps.length - 1; i >= 0; i--) {
      const _step = this.steps[i];
      const cleans = _step.cleans;
      for (let j = cleans.length - 1; j >= 0; j--) {
        const _clean = cleans[j];
        if (_step.specs.every(spec => spec.status === 'PASSED')) {
          try {
            await _clean.clean();
          } catch (error) {
            errors.push(error);
          }
        } else {
          _clean.status = 'SKIPPED';
          rlc.afterSpecReport(_clean);
          log.warn(`Skipping Clean Step - ${_step.name}`);
        }
      }
    }
    rlc.afterTestReport(this);
    if (errors.length > 0) {
      throw errors[0];
    }
  }

}

function reportStep(steps) {
  if (steps.length > 0) {
    const lastStep = steps[steps.length - 1];
    rlc.afterStepReport(lastStep);
  }
}

module.exports = E2E;