const BasePlugin = require('./plugin.base');

class JsonMatchValidator extends BasePlugin {
  getMatchingRules(data, path, rules) {
    return this.adapter.getMatchingRules(data, path, rules);
  }
  getRawValue(data) {
    return this.adapter.getRawValue(data);
  }
  validate(actual, expected, rules, path, strict) {
    return this.adapter.validate(actual, expected, rules, path, strict);
  }
}

module.exports = new JsonMatchValidator();