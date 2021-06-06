const { utils } = require('pactum-matchers');

function getMatchingRules(data, path, rules) {
  const _rules = rules || {};
  utils.setMatchingRules(_rules, data, path);
  return _rules;
}

function getRawValue(data) {
  return utils.getValue(data);
}

function validate(actual, expected, rules, path, strict) {
  return utils.compare(actual, expected, rules, path, strict).message;
}

module.exports = {
  getMatchingRules,
  getRawValue,
  validate
};