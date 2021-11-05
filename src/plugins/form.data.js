const BasePlugin = require('./plugin.base');

class FormData extends BasePlugin {
  get() {
    return this.adapter.get();
  }
}

module.exports = new FormData();