const Step = require('./Step');
const log = require('../helpers/logger');

class E2E {

  constructor(name) {
    this.name = name;
    this.steps = [];
  }

  step(name) {
    const bail = this.steps.some(_step => _step.statuses.some(status => status === 'FAILED'));
    const _step = new Step(name, bail);
    this.steps.push(_step);
    return _step;
  }

  async cleanup() {
    const errors = [];
    for (let i = this.steps.length - 1; i >= 0; i--) {
      const _step = this.steps[i];
      const cleans = _step.cleans;
      for (let j = cleans.length - 1; j >= 0; j--) {
        const _clean = cleans[j];
        if (_step.statuses.every(status => status === 'PASSED')) {
          try {
            await _clean.clean();
            _clean.status = 'PASSED';
          } catch (error) {
            _clean.status = 'FAILED';
            errors.push(error);
          }
        } else {
          log.warn(`Skipping Clean Step - ${_step.name}`);
        }
      }
    }
    if (errors.length > 0) {
      throw errors[0];
    }
  }

}

module.exports = E2E;