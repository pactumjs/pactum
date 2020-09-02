const extend = require('deep-extend');

const loader = require('../exports/loader');
const config = require('../config');

const dataProcessor = {

  template: {},

  processTemplate() {
    if (!config.data.template.processed) {
      const orgTemplate = loader.getDataTemplate();
      this.template = JSON.parse(JSON.stringify(orgTemplate));
      this.template = this.processDataTemplates(this.template);
      config.data.template.processed = true;
    }
  },

  processData() {

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
          extend(data, overrides);
          data = this.processDataTemplates(data);
        }
      } else {
        console.log('Template Not Found')
        // template not found
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

