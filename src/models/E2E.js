const Step = require('./Step');
const log = require('../helpers/logger');
const helper = require('../helpers/helper');
const reporter = require('../exports/reporter');

class E2E {

  constructor(name) {
    this.id = helper.getRandomId();
    this.name = name;
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
          helper.afterSpecReport(_clean, reporter);
          log.warn(`Skipping Clean Step - ${_step.name}`);
        }
      }
    }
    helper.afterTestReport(this, reporter);
    if (errors.length > 0) {
      throw errors[0];
    }
  }

}

function reportStep(steps) {
  if (steps.length > 0) {
    const lastStep = steps[steps.length - 1];
    helper.afterStepReport(lastStep, reporter);
  }
}

module.exports = E2E;