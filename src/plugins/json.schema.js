const BasePlugin = require('./plugin.base');

class JsonSchemaValidator extends BasePlugin {
  validate(schema, target) {
    return this.adapter.validate(schema, target);
  }
}

module.exports = new JsonSchemaValidator();