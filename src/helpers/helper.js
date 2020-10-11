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

  setValueFromMatcher(data) {
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        data[i] = this.setValueFromMatcher(data[i]);
      }
    } else if (typeof data === 'object' && data !== null) {
      switch (data.json_class) {
        case 'Pact::SomethingLike':
        case 'Pact::Term':
        case 'Pact::ArrayLike':
          if (Array.isArray(data.value)) {
            for (let i = 0; i < data.value.length; i++) {
              data.value[i] = this.setValueFromMatcher(data.value[i]);
            }
          }
          return data.value;
        default:
          for (const prop in data) {
            data[prop] = this.setValueFromMatcher(data[prop]);
            if (typeof data[prop] === 'object' && !Array.isArray(data[prop])) {
              for (const innerProp in data[prop]) {
                data[prop][innerProp] = this.setValueFromMatcher(data[prop][innerProp]);
              }
            }
          }
          return data;
      }
    }
    return data;
  },

  setMatchingRules(matchingRules, data, path) {
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const newPath = `${path}.[*]`;
        this.setMatchingRules(matchingRules, item, newPath);
      }
    } else if (this.isValidObject(data)) {
      if (data.json_class === 'Pact::SomethingLike') {
        matchingRules[path] = {
          match: 'type'
        };
      } else if (data.json_class === 'Pact::Term') {
        matchingRules[path] = {
          match: 'regex',
          regex: data.data.matcher.s
        };
      } else if (data.json_class === 'Pact::ArrayLike') {
        matchingRules[path] = {
          min: data.min
        };
        matchingRules[`${path}[*].*`] = {
          match: 'type'
        };
        if (typeof data.value[0] === 'object' && !Array.isArray(data.value[0])) {
          const newPath = `${path}[*]`;
          this.setMatchingRules(matchingRules, data.value[0], newPath);
        }
      } else {
        for (const prop in data) {
          if (this.isValidObject(data[prop])) {
            if (data[prop].json_class === 'Pact::SomethingLike') {
              matchingRules[`${path}.${prop}`] = {
                match: 'type'
              };
            } else if (data[prop].json_class === 'Pact::Term') {
              matchingRules[`${path}.${prop}`] = {
                match: 'regex',
                regex: data[prop].data.matcher.s
              };
            } else if (data[prop].json_class === 'Pact::ArrayLike') {
              matchingRules[`${path}.${prop}`] = {
                min: data[prop].min
              };
              matchingRules[`${path}.${prop}[*].*`] = {
                match: 'type'
              };
              if (typeof data[prop].value[0] === 'object' && !Array.isArray(data[prop].value[0])) {
                const newPath = `${path}.${prop}[*]`;
                this.setMatchingRules(matchingRules, data[prop].value[0], newPath);
              }
            } else {
              const newPath = `${path}.${prop}`;
              this.setMatchingRules(matchingRules, data[prop], newPath);
            }
          }
        }
      }
    }
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

  afterSpecReport(spec, reporter) {
    const data = {
      id: spec.id,
      status: spec.status,
      failure: spec.failure,
      request: {
        method: spec._request.method,
        path: spec._request.url
      }
    };
    if (spec._response) {
      data.start = spec.start;
      data.end = Date.now().toString();
      data.response = {
        statusCode: spec._response.statusCode,
        duration: spec._response.responseTime
      }
    }
    reporter.afterSpec(data);
  },

  afterStepReport(step, reporter) {
    const data = {
      id: step.id,
      name: step.name,
      specs: step.specs.map(spec => spec.id),
      cleans: step.cleans.map(spec => spec.id)
    }
    reporter.afterStep(data);
  },

  afterTestReport(test, reporter) {
    const data = {
      id: test.id,
      name: test.name,
      steps: test.steps.map(step => step.id)
    }
    reporter.afterTest(data);
  }

};

module.exports = helper;
