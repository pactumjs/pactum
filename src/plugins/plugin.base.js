class BasePlugin {
  constructor() {
    this.adapter = null;
  }
  setAdapter(adapter) {
    this.adapter = adapter;
  }
}

module.exports = BasePlugin;