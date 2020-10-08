const helper = require('../helpers/helper');
const Compare = require('../helpers/compare');

const jmv = {

  getMatchingRules(data, path, rules) {
    const _rules = rules || {};
    helper.setMatchingRules(_rules, data, path);
    return _rules;
  },

  getRawValue(data) {
    return helper.setValueFromMatcher(data);
  },

  validate(actual, expected, rules, path) {
    const compare = new Compare();
    return compare.jsonMatch(actual, expected, rules, path).message;
  }

}

module.exports = jmv;