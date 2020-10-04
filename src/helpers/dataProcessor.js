const override = require('deep-override');
const jq = require('json-query');

const stash = require('../exports/stash');
const handler = require('../exports/handler');
const logger = require('./logger');
const config = require('../config');

const DATA_REF_PATTERN = /(@DATA:\w+::[^@]+@)/g;
const DATA_REF_TYPE_PATTERN = /(@DATA:\w+::)/g;
const DATA_REF_VALUE_PATTERN = /(::.*[^@])/g;

const dataProcessor = {

  map: {},
  template: {},

  processMaps() {
    if (!config.data.ref.map.processed) {
      const orgMap = stash.getDataMap();
      this.map = JSON.parse(JSON.stringify(orgMap));
      this.map = this.processDataRefs(this.map);
      config.data.ref.map.processed = true;
      if (Object.keys(this.map).length > 0) {
        config.data.ref.map.enabled = true;
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
    const ref = config.data.ref;
    if (ref.map.enabled || ref.fun.enabled || ref.spec.enabled) {
      data = this.processDataRefs(data);
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

  processDataRefs(data) {
    if (typeof data === 'string') {
      return this.getDataRefValue(data);
    }
    if (typeof data === 'object') {
      for (prop in data) {
        data[prop] = this.processDataRefs(data[prop]);
      }
    }
    return data;
  },

  getDataRefValue(raw) {
    const dataRefMatches = raw.match(DATA_REF_PATTERN);
    if (dataRefMatches) {
      const values = [];
      for (let i = 0; i < dataRefMatches.length; i++) {
        const dataRefMatch = dataRefMatches[i];
        const refType = dataRefMatch.match(DATA_REF_TYPE_PATTERN)[0].replace('::', '');
        const refValue = dataRefMatch.match(DATA_REF_VALUE_PATTERN)[0].replace('::', '');
        if (refType === '@DATA:MAP') {
          const value = jq(refValue, { data: this.map }).value;
          values.push(typeof value === 'undefined' ? raw : value);
        }
        if (refType === '@DATA:FUN') {
          const [handlerName, ...args] = refValue.split(',');
          const handlerFun = handler.getDataFunHandler(handlerName);
          values.push(handlerFun({ data: args }));
        }
        if (refType === '@DATA:SPEC') {
          const value = jq(refValue, { data: stash.getDataSpecs() }).value;
          values.push(typeof value === 'undefined' ? raw : value);
        }
      }
      if (values.length === 1 && raw.length === dataRefMatches[0].length) {
        return values[0];
      }
      for (let i = 0; i < dataRefMatches.length; i++) {
        raw = raw.replace(dataRefMatches[i], values[i]);
      }
    }
    return raw;
  }

};

module.exports = dataProcessor;