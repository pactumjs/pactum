const fs = require('fs');
const pt = require('path');
const log = require('../plugins/logger');
const { PactumConfigurationError } = require('../helpers/errors');
const config = require('../config');
const jq = require('json-query');

let dataMap = {};
let dataTemplate = {};
let dataStore = {};

const stash = {

  loadData(path = './data') {
    if (!fs.existsSync(path)) {
      log.error(`path not found - ${path}`);
      log.warn(`Current Working Dir: ${process.cwd()}`);
      throw new PactumConfigurationError('`path` not found');
    }
    const stats = fs.lstatSync(path);
    if (!stats.isDirectory()) {
      log.error(`path should be a directory - ${path}`);
      throw new PactumConfigurationError('`path` should be a directory');
    }
    const dir = fs.readdirSync(path);
    dir.forEach(file => {
      if (file === 'maps') {
        const maps = fs.readdirSync(pt.resolve(path, file));
        maps.forEach(map => this.addDataMap(JSON.parse(fs.readFileSync(pt.resolve(path, file, map)))));
      }
      if (file === 'templates') {
        const templates = fs.readdirSync(pt.resolve(path, file));
        templates.forEach(template => this.addDataTemplate(JSON.parse(fs.readFileSync(pt.resolve(path, file, template)))));
      }
      if (file.endsWith('.template.json')) {
        this.addDataTemplate(JSON.parse(fs.readFileSync(pt.resolve(path, file))));
      }
      if (file.endsWith('.map.json')) {
        this.addDataMap(JSON.parse(fs.readFileSync(pt.resolve(path, file))));
      }
    });
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