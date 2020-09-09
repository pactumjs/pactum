const config = require('../config');

let dataMap = {};
let dataTemplate = {};

const stash = {

  loadDataMap(map) {
    Object.assign(dataMap, map);
    config.data.map.processed = false;
  },

  loadDataMaps(maps) {
    for (let i = 0; i < maps.length; i++) {
      this.loadDataMap(maps[i]);
    }
  },

  getDataMap() {
    return dataMap;
  },

  clearDataMaps() {
    dataMap = {};
    config.data.map.processed = false;
    config.data.map.enabled = false;
  },

  loadDataTemplate(template) {
    Object.assign(dataTemplate, template);
    config.data.template.processed = false;
  },

  loadDataTemplates(templates) {
    for (let i = 0; i < templates.length; i++) {
      this.loadDataTemplate(templates[i]);
    }
  },

  getDataTemplate() {
    return dataTemplate;
  },

  clearDataTemplates() {
    dataTemplate = {};
    config.data.template.processed = false;
    config.data.template.enabled = false;
  }

};

module.exports = stash;