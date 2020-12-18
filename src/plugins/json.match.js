const { utils } = require('pactum-matchers');

const jmv = {

  getMatchingRules(data, path, rules) {
    const _rules = rules || {};
    utils.setMatchingRules(_rules, data, path);
    return _rules;
  },

  getRawValue(data) {
    return utils.getValue(data);
  },

  validate(actual, expected, rules, path, strict) {
    return utils.compare(actual, expected, rules, path, strict).message;
  }

};

module.exports = jmv;