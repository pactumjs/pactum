const override = require('deep-override');
const jq = require('json-query');

const stash = require('../exports/stash');
const logger = require('./logger');
const config = require('../config');

const DATA_MAP_PATTERN = /(@DATA:\w+::[^@]+@)/g;
const DATA_MAP_TYPE_PATTERN = /(@DATA:\w+::)/g;
const DATA_MAP_VALUE_PATTERN = /(::.*[^@])/g;

const dataProcessor = {

  map: {},
  template: {},

  processMaps() {
    if (!config.data.map.processed) {
      const orgMap = stash.getDataMap();
      this.map = JSON.parse(JSON.stringify(orgMap));
      this.map = this.processDataMaps(this.map);
      config.data.map.processed = true;
      if (Object.keys(this.map).length > 0) {
        config.data.map.enabled = true;
      }
    }
  },

  processTemplates() {
    if (!config.data.template.processed) {
      const orgTemplate = stash.getDataTemplate();
      this.template = JSON.parse(JSON.stringify(orgTemplate));
      this.template = this.processDataTemplates(this.template);
      config.data.template.processed = true;
      if (Object.keys(this.template).length > 0) {
        config.data.template.enabled = true;
      }
    }
  },

  processData(data) {
    if (config.data.template.enabled) {
      data = this.processDataTemplates(data);
    }
    if (config.data.map.enabled) {
      data = this.processDataMaps(data);
    }
    return data;
  },

  processDataTemplates(data) {
    if (typeof data !== 'object') return data;
    if (!data) return data;
    const templateName = data['@DATA:TEMPLATE@'];
    const overrides = data['@OVERRIDES@'];
    if (templateName) {
      const templateValue = this.template[templateName];
      if (templateValue) {
        data = JSON.parse(JSON.stringify(templateValue));
        data = this.processDataTemplates(data);
        if (overrides) {
          override(data, overrides);
          data = this.processDataTemplates(data);
        }
      } else {
        logger.warn(`Template Not Found - ${templateName}`);
      }
    } else {
      for (prop in data) {
        data[prop] = this.processDataTemplates(data[prop]);
      }
    }
    return data;
  },

  processDataMaps(data) {
    if (typeof data === 'string') {
      return this.getDataMapValue(data);
    }
    if (typeof data === 'object') {
      for (prop in data) {
        data[prop] = this.processDataMaps(data[prop]);
      }
    }
    return data;
  },

  getDataMapValue(raw) {
    const dataMapMatches = raw.match(DATA_MAP_PATTERN);
    if (dataMapMatches) {
      for (let i = 0; i < dataMapMatches.length; i++) {
        const dataMapMatch = dataMapMatches[i];
        const mapType = dataMapMatch.match(DATA_MAP_TYPE_PATTERN)[0];
        const mapValue = dataMapMatch.match(DATA_MAP_VALUE_PATTERN)[0];
        if (mapType === '@DATA:MAP::') {
          return jq(mapValue.replace('::', ''), { data: this.map }).value;
        }
      }
    }
    return raw;
  }

};

module.exports = dataProcessor;