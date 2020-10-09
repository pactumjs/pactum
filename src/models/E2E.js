const Step = require('./Step');

class E2E {

  constructor(name) {
    this.name = name;
    this.steps = [];
  }

  step(name) {
    const _step = new Step(name);
    this.steps.push(_step);
    return _step;
  }

  async clean() {
    for (let i = 0; i < this.steps.length; i++) {
      const _step = this.steps[i];
      const _clean = _step._spec._clean;
      if (_clean) {
        await _clean.clean();
      }
    }
  }

}

module.exports = E2E;