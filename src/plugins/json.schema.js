const BasePlugin = require('./plugin.base');

class JsonSchemaValidator extends BasePlugin {
  validate(schema, target, options) {
    return this.adapter.validate(schema, target, options);
  }
}

module.exports = new JsonSchemaValidator();