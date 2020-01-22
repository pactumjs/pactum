const helper = {

  getJson(jsonString) {
    try {
      return JSON.parse(jsonString)
    } catch (error) {
      return jsonString;
    }
  },

  getRandomId() {
    return Math.random().toString(36).substr(2, 5);
  },

  validateQuery(actual, expected) {
    if (typeof actual !== 'object' || typeof expected !== 'object') {
      return false;
    }
    for (const prop in actual) {
      if (!actual.hasOwnProperty(prop)) {
        continue;
      }
      if (!expected.hasOwnProperty(prop)) {
        return false;
      }
      if(actual[prop] != expected[prop]) {
        return false;
      }
    }
    for (const prop in expected) {
      if (expected.hasOwnProperty(prop) && !actual.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  },

  validateHeaders(actual, expected) {
    for (const prop in expected) {
      if (!expected.hasOwnProperty(prop.toLowerCase())) {
        continue;
      }
      if (!actual.hasOwnProperty(prop.toLowerCase())) {
        return false;
      }
      if(expected[prop]  != actual[prop.toLowerCase()]) {
        return false;
      }
    }
    return true;
  },

  validateBody(actual, expected) {
    if (typeof actual === typeof expected) {
      if (typeof actual === 'object') {
        return (JSON.stringify(actual) === JSON.stringify(expected));
      } else {
        return (actual === expected);
      }
    } else {
      return false;
    }
  },

  setValueFromMatcher(data) {
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        data[i] = this.setValueFromMatcher(data[i]);
      }
    } else if (typeof data === 'object') {
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
    } else if (typeof data === 'object' && !Array.isArray(data)) {
      if (data.json_class === 'Pact::SomethingLike') {
        matchingRules[path] = {
          match: 'type'
        };
      } else if (data.json_class === 'Pact::Term') {
        matchingRules[path] = {
          match: 'regex',
          regex: data.data.matcher.s
        };
      }  else if (data.json_class === 'Pact::ArrayLike') {
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
          if (typeof data[prop] === 'object' && !Array.isArray(data)) {
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

  getValidInteraction(req, interactions) {
    for (let [id, interaction] of interactions) {
      const isValidMethod = (interaction.withRequest.method === req.method);
      const isValidPath = (interaction.withRequest.path === req.path);
      let isValidQuery = true;
      if (Object.keys(req.query).length > 0) {
        isValidQuery = this.validateQuery(req.query, interaction.withRequest.query);
      }
      if (interaction.withRequest.ignoreQuery) {
        isValidQuery = true;
      }
      let isValidHeaders = true;
      if (interaction.withRequest.headers) {
        isValidHeaders = this.validateHeaders(req.headers, interaction.withRequest.headers);
      }
      let isValidBody = true;
      if (typeof req.body === 'object') {
        if (Object.keys(req.body).length > 0) {
          isValidBody = this.validateBody(req.body, interaction.withRequest.body);
        }
      } else if (req.body) {
        isValidBody = this.validateBody(req.body, interaction.withRequest.body);
      }
      if (interaction.withRequest.ignoreBody) {
        isValidBody = true;
      }
      if (isValidMethod && isValidPath && isValidQuery && isValidHeaders && isValidBody) {
        return interaction;
      }
    }
    return null;
  }

}

module.exports = helper;
