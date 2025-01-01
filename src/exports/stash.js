const { loadDataManagement } = require('../helpers/file.utils');
const config = require('../config');
const jq = require('json-query');

let dataMap = {};
let dataTemplate = {};
let dataStore = {};

const stash = {

  loadData(path = './data') {
    const { templates, maps } = loadDataManagement(path);
    for (const template of templates) {
      this.addDataTemplate(template);
    }
    for (const map of maps) {
      this.addDataMap(map);
    }
  },

  addDataMap(key, value) {
    if (value) {
      Object.assign(dataMap, { [key]: value });
    } else {
      if (!Array.isArray(key)) {
        key = [key];
      }
      key.forEach(map => Object.assign(dataMap, map));
    }
    config.data.ref.map.processed = false;
  },

  getDataMap(path) {
    if (path) {
      return jq(path, { data: dataMap }).value;
    }
    return dataMap;
  },

  clearDataMaps() {
    dataMap = {};
    config.data.ref.map.processed = false;
    config.data.ref.map.enabled = false;
  },

  addDataTemplate(key, value) {
    if (value) {
      Object.assign(dataTemplate, { [key]: value });
    } else {
      if (!Array.isArray(key)) {
        key = [key];
      }
      key.forEach(template => Object.assign(dataTemplate, template));
    }
    config.data.template.processed = false;
  },

  getDataTemplate(path) {
    if (path) {
      return jq(path, { data: dataTemplate }).value;
    }
    return dataTemplate;
  },

  clearDataTemplates() {
    dataTemplate = {};
    config.data.template.processed = false;
    config.data.template.enabled = false;
  },

  addDataStore(key, value) {
    if (value) {
      Object.assign(dataStore, { [key]: value });
    } else {
      Object.assign(dataStore, key);
    }
    config.data.ref.spec.enabled = true;
  },

  getDataStore(path) {
    if (path) {
      return jq(path, { data: dataStore }).value;
    }
    return dataStore;
  },

  clearDataStores() {
    dataStore = {};
    config.data.ref.spec.enabled = false;
  },

  getStoreKey(key) {
    return `$S{${key}}`;
  },

  getMapKey(key) {
    return `$M{${key}}`;
  },

  getFunctionKey(key) {
    return `$F{${key}}`;
  },

  setDirectOverride(value) {
    config.data.template.direct_override = value;
  }

};

module.exports = stash;