const Spec = require('./Spec');
const log = require('../helpers/logger');

class CleanStep extends Spec {

  constructor(name, data, spec) {
    super(name, data);
    this.spec = spec;
  }

  // this is for supporting - `await step().spec().clean()`
  toss() {
    return this.spec.toss();
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
      this.step.statuses.push('SKIPPED');
      return;
    }
    try {
      await super.toss();
      this.status = 'PASSED';
      this.step.statuses.push('PASSED');  
    } catch (error) {
      this.status = 'FAILED';
      this.step.statuses.push('FAILED');
      throw error; 
    }
  }

}

class Step {

  constructor(name, bail) {
    this.name = name;
    this.bail = bail;
    this.statuses = [];
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

  async toss() {
    for (let i = 0; i < this.specs.length; i++) {
      await this.specs[i].toss();
    }
  }

}

module.exports = Step;