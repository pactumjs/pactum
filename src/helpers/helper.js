const helper = {

  getJson(jsonString) {
    try {
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
  }

};

module.exports = helper;
