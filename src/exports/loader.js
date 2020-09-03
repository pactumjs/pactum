const config = require('../config');

let dataTemplate = {};

const loader = {

  /**
   * loads data template
   * @param {object} template 
   */
  loadDataTemplate(template) {
    Object.assign(dataTemplate, template);
    config.data.template.processed = false;
  },

  /**
   * loads data templates
   * @param {object[]} templates 
   */
  loadDataTemplates(templates) {
    for (let i = 0; i < templates.length; i++) {
      this.loadDataTemplate(templates[i]);
    }
  },

  getDataTemplate() {
    return dataTemplate;
  },

  resetDataTemplates() {
    dataTemplate = {};
    config.data.template.processed = false;
  }

};

module.exports = loader;