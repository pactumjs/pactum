const specs = [];

const jr = {

  name: 'JsonReporter',

  afterSpec(spec) {
    specs.push(spec);
  },

  afterStep(data) {
    console.log(data);
    // todo
  },

  afterTest(data) {
    console.log(data);
    // todo
  },

  end() {
    console.log('end');
  }

}

module.exports = jr;