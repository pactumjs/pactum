const config = require('../config');

let dataMap = {};
let dataTemplate = {};

const stash = {

  loadDataMaps(maps) {
    Object.assign(dataMap, maps);
    config.data.ref.map.processed = false;
  },

  getDataMap() {
    return dataMap;
  },

  clearDataMaps() {
    dataMap = {};
    config.data.ref.map.processed = false;
    config.data.ref.map.enabled = false;
  },

  loadDataTemplates(templates) {
    Object.assign(dataTemplate, templates);
    config.data.template.processed = false;
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