const fs = require('fs');
const path = require('path');

const specs = [];
const steps = [];
const tests = [];

const jr = {

  name: 'JsonReporter',
  path: './reports',
  file: 'report.json',

  afterSpec(spec) {
    specs.push(spec);
  },

  afterStep(step) {
    steps.push(step);
  },

  afterTest(test) {
    tests.push(test);
  },

  end() {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      for (let j = 0; j < step.specs.length; j++) {
        const specId = step.specs[j];
        step.specs[j] = specs.find(spec => spec.id === specId);
      }
      for (let j = 0; j < step.cleans.length; j++) {
        const specId = step.cleans[j];
        step.cleans[j] = specs.find(spec => spec.id === specId);
      }
    }
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      for (let j = 0; j < test.steps.length; j++) {
        const stepId = test.steps[j];
        test.steps[j] = steps.find(step => step.id === stepId);
      }
    }
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path, { recursive: true });
    }
    fs.writeFileSync(path.resolve(this.path, this.file), JSON.stringify({ tests, steps, specs }, null, 2));
  },

  reset() {
    tests.length = 0;
    steps.length = 0;
    specs.length = 0;
  }

}

module.exports = jr;