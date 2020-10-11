const jr = require('../plugins/json.reporter');

const reporters = [];

const reporter = {

  add(rpt) {
    reporters.push(rpt);
  },

  get() {
    return reporters;
  },

  afterSpec(data) {
    reporters.forEach(rpt => { if (rpt['afterSpec']) rpt.afterSpec(data) });
  },

  afterStep(data) {
    reporters.forEach(rpt => { if (rpt['afterStep']) rpt.afterStep(data) });
  },

  afterTest(data) {
    reporters.forEach(rpt => { if (rpt['afterTest']) rpt.afterTest(data) });
  },

  async end() {
    await reporters.forEach(async rpt => await rpt.end());
  },

  enableJsonReporter() {
    this.add(jr);
  }

};

module.exports = reporter;