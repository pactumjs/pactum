const Spec = require('./Spec');

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

  constructor(name, data) {
    super(name, data);
    this._clean = null;
  }

  clean(name, data) {
    this._clean = new CleanStep(name, data, this);
    return this._clean;
  }

}

class Step {

  constructor(name) {
    this.name = name;
    this._spec = null;
  }

  spec(name, data) {
    this._spec = new StepSpec(name, data);
    return this._spec;
  }

}

module.exports = Step;