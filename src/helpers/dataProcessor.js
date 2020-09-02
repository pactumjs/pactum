const extend = require('deep-extend');

const loader = require('../exports/loader');
const logger = require('./logger');
const config = require('../config');

const dataProcessor = {

  template: {},

  processTemplates() {
    if (!config.data.template.processed) {
      const orgTemplate = loader.getDataTemplate();
      this.template = JSON.parse(JSON.stringify(orgTemplate));
      this.template = this.processDataTemplates(this.template);
      config.data.template.processed = true;
    }
  },

  processDataTemplates(data) {
    if (typeof data !== 'object') return data;
    if (!data) return data;
    const templateName = data['@DATA:TEMPLATE@'];
    const overrides = data['@EXTENDS@'];
    if (templateName) {
      const templateValue = this.template[templateName];
      if (templateValue) {
        data = JSON.parse(JSON.stringify(templateValue));
        data = this.processDataTemplates(data);
        if (overrides) {
          extend(data, overrides);
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
  }
};

module.exports = dataProcessor;

