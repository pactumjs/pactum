const Spec = require('./Spec');
const log = require('../helpers/logger');

class CleanStep extends Spec {

  constructor(name, data, spec) {
    super(name, data);
    this.spec = spec;
  }

  toss() {
    return this.spec.toss();
  }

  clean() {
    return super.toss();
  }

}

class StepSpec extends Spec {

  constructor(name, data, bail) {
    super(name, data);
    this.bail = bail;
  }

  clean(name, data) {
    this._clean = new CleanStep(name, data, this);
    return this._clean;
  }

  async toss() {
    if (this.bail) {
      log.warn(`Skipping Step`);
      this.status = 'SKIPPED';
      return;
    }
    try {
      await super.toss();
      this.status = 'PASSED';  
    } catch (error) {
      this.status = 'FAILED';
      throw error; 
    }
  }

}

class Step {

  constructor(name, bail) {
    this.name = name;
    this.bail = bail;
  }

  spec(name, data) {
    this._spec = new StepSpec(name, data, this.bail);
    return this._spec;
  }

}

module.exports = Step;