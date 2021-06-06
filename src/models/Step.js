const Spec = require('./Spec');
const log = require('../plugins/logger');
const helper = require('../helpers/helper');
const rlc = require('../helpers/reporter.lifeCycle');

class CleanStep extends Spec {

  constructor(name, data, spec) {
    super(name, data);
    this.spec = spec;
  }

  // this is for supporting - `await step().spec().clean()`
  toss() {
    if (this.spec instanceof StepSpec) {
      return this.spec.toss();
    } else {
      log.warn('Should not await on clean spec');
      return Promise.resolve();
    }
  }

  clean() {
    return super.toss();
  }

}

class StepSpec extends Spec {

  constructor(name, data, step) {
    super(name, data);
    this.step = step;
    this.bail = step.bail;
  }

  clean(name, data) {
    const _clean = new CleanStep(name, data, this);
    this.step.cleans.push(_clean);
    return _clean;
  }

  async toss() {
    if (this.bail) {
      log.warn(`Skipping Spec in Step - ${this.step.name}`);
      this.status = 'SKIPPED';
      rlc.afterSpecReport(this);
      return;
    }
    await super.toss();
  }

}

class Step {

  constructor(name, bail) {
    this.id = helper.getRandomId();
    this.name = name;
    this.bail = bail;
    this.specs = [];
    this.cleans = [];
  }

  spec(name, data) {
    const _spec = new StepSpec(name, data, this);
    this.specs.push(_spec);
    return _spec;
  }

  clean(name, data) {
    const _spec = new CleanStep(name, data, this);
    this.cleans.push(_spec);
    return _spec;
  }

}

module.exports = Step;