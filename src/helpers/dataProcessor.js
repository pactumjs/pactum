const override = require('deep-override');
const jq = require('json-query');
const { klona } = require("klona");

const stash = require('../exports/stash');
const handler = require('../exports/handler');
const log = require('../plugins/logger');
const config = require('../config');

const DATA_REF_PATTERN = /(\$\w\{[^\}]+\})/g;

const dataProcessor = {

  map: {},
  template: {},

  processMaps() {
    if (!config.data.ref.map.processed) {
      const orgMap = stash.getDataMap();
      this.map = klona(orgMap);
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
      this.template = klona(orgTemplate);
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
    const removes = data['@REMOVES@'] || [];
    if (templateName) {
      const templateValue = this.template[templateName];
      if (templateValue) {
        data = klona(templateValue);
        data = this.processDataTemplates(data);
        if (overrides) {
          override(data, overrides);
          data = this.processDataTemplates(data);
        }
        removes.forEach(_key => delete data[_key]);
      } else {
        log.warn(`Template Not Found - ${templateName}`);
      }
    } else {
      for (const prop in data) {
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
      for (const prop in data) {
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
        const refType = dataRefMatch.slice(1, 2);
        const refValue = dataRefMatch.slice(3, -1);
        if (refType === 'M') {
          const value = jq(refValue, { data: this.map }).value;
          values.push(typeof value === 'undefined' ? raw : value);
        }
        if (refType === 'F') {
          const [handlerName, ..._args] = refValue.split(':');
          const handlerFun = handler.getDataFuncHandler(handlerName);
          const handler_data = handlerFun({ args: _args.length > 0 ? _args[0].split(',') : _args });
          values.push(this.processDataRefs(handler_data));
        }
        if (refType === 'S') {
          const value = jq(refValue, { data: stash.getDataStore() }).value;
          values.push(typeof value === 'undefined' ? raw : value);
        }
        if (refType === 'E') {
          const value = process.env[refValue];
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