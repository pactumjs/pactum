const reporters = [];

const reporter = {

  add(rpt) {
    reporters.push(rpt);
  },

  get() {
    return reporters;
  },

  afterSpec(data) {
    reporters.forEach(rpt => { if (rpt['afterSpec']) rpt.afterSpec(data); });
  },

  afterStep(data) {
    reporters.forEach(rpt => { if (rpt['afterStep']) rpt.afterStep(data); });
  },

  afterTest(data) {
    reporters.forEach(rpt => { if (rpt['afterTest']) rpt.afterTest(data); });
  },

  afterInteraction(data) {
    reporters.forEach(rpt => { if (rpt['afterInteraction']) rpt.afterInteraction(data); });
  },

  async end() {
    for (let i = 0; i < reporters.length; i++) {
      const rpt = reporters[i];
      if (rpt['end']) await rpt.end();
    }
  }

};

module.exports = reporter;