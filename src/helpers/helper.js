const fs = require('fs');
const path = require('path');

const log = require('./logger');

const helper = {

  getJson(jsonString) {
    try {
      if (jsonString instanceof Buffer) {
        jsonString = jsonString.toString();
      }
      return JSON.parse(jsonString);
    } catch (error) {
      return jsonString;
    }
  },

  getRandomId() {
    return Math.random().toString(36).substr(2, 5);
  },

  getCurrentTime() {
    return Date.now().toString();
  },

  /**
   * validates if the value is string or not
   * @param {string} value - value to be validated
   */
  isValidString(value) {
    return (typeof value === 'string' && value);
  },

  getPlainQuery(query) {
    let plainQuery = '';
    if (typeof query === 'object') {
      for (const prop in query) {
        if (plainQuery !== '') {
          plainQuery = plainQuery + '&';
        }
        plainQuery = plainQuery + `${prop}=${query[prop]}`;
      }
    }
    return plainQuery;
  },

  isValidObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  },

  /**
   * returns set of all pact files
   * @param {string[]} pactFilesOrDirs - array of pact files & directories
   */
  getLocalPactFiles(pactFilesOrDirs) {
    const filePaths = new Set();
    for (let i = 0; i < pactFilesOrDirs.length; i++) {
      const pactFileOrDir = pactFilesOrDirs[i];
      const stats = fs.lstatSync(pactFileOrDir);
      if (stats.isDirectory()) {
        const items = fs.readdirSync(pactFileOrDir);
        for (let j = 0; j < items.length; j++) {
          const item = items[j];
          const itemPath = path.join(pactFileOrDir, item);
          const childItemStats = fs.lstatSync(itemPath);
          if (childItemStats.isFile()) {
            const ext = path.extname(itemPath);
            if (ext === '.json') {
              filePaths.add(itemPath);
            } else {
              log.warn(`Invalid file type - ${ext} provided in pactFilesOrDirs: ${itemPath}`);
            }
          } else {
            log.warn(`Invalid file provided in pactFilesOrDirs: ${itemPath}`);
          }
        }
      } else if (stats.isFile()) {
        const ext = path.extname(pactFileOrDir);
        if (ext === '.json') {
          filePaths.add(pactFileOrDir);
        } else {
          log.warn(`Invalid file type - ${ext} provided in pactFilesOrDirs: ${pactFileOrDir}`);
        }
      } else {
        log.warn(`Invalid file provided in pactFilesOrDirs: ${pactFileOrDir}`);
      }
    }
    return filePaths;
  },

  /**
   * returns stringified object with 2 spaces
   * @param {object} obj - object
   */
  stringify(obj) {
    if (this.isValidObject(obj)) {
      try {
        return JSON.stringify(obj, null, 2);
      } catch (error) {
        return obj;
      }
    }
    return obj;
  },

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  matchesStrategy(value, strategy) {
    if (strategy.starts && !value.startsWith(strategy.starts)) return false;
    if (strategy.ends && !value.endsWith(strategy.ends)) return false;
    if (strategy.includes && !value.includes(strategy.includes)) return false;
    return true;
  },

  sliceStrategy(value, strategy) {
    if (strategy.starts) value = value.slice(strategy.starts.length);
    if (strategy.ends) value = value.slice(0, -(strategy.ends.length));
    return value;
  },

  getTrimResponse(response) {
    return {
      statusCode: response.statusCode,
      headers: response.headers,
      body: response.json
    };
  }

};

module.exports = helper;
