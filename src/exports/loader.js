const config = require('../config');

let dataMap = {};
let dataTemplate = {};

const loader = {

  /**
   * loads data map
   * @param {object} map
   */
  loadDataMap(map) {
    Object.assign(dataMap, map);
    config.data.map.processed = false;
  },

  /**
   * loads data maps
   * @param {object[]} maps
   */
  loadDataMaps(maps) {
    for (let i = 0; i < maps.length; i++) {
      this.loadDataMap(maps[i]);
    }
  },

  getDataMap() {
    return dataTemplate;
  },

  clearDataMaps() {
    dataMap = {};
    config.data.map.processed = false;
    config.data.map.enabled = false;
  },

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

  clearDataTemplates() {
    dataTemplate = {};
    config.data.template.processed = false;
    config.data.template.enabled = false;
  }

};

module.exports = loader;