const BasePlugin = require('./plugin.base');

class JsonLikeValidator extends BasePlugin {
  validate(actual, expected, opts) {
    return this.adapter.validate(actual, expected, opts);
  }
}

module.exports = new JsonLikeValidator();