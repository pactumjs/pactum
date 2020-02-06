const assert = require('assert');
const { parse: graphQLParse } = require('parse-graphql');

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
      if (!Object.prototype.hasOwnProperty.call(expected, prop)) {
        return false;
      }
      if (actual[prop] === expected[prop]) {
        continue;
      }
      if (actual[prop] === null) {
        actual[prop] = 'null';
      }
      if (expected[prop] === null) {
        expected[prop] = 'null';
      }
      if (actual[prop].toString() !== expected[prop].toString()) {
        return false;
      }
    }
    for (const prop in expected) {
      const actualProps = Object.keys(actual);
      if (Object.prototype.hasOwnProperty.call(expected, prop) && !actualProps.includes(prop)) {
        return false;
      }
    }
    return true;
  },

  validateHeaders(actual, expected) {
    for (const prop in expected) {
      if (!Object.prototype.hasOwnProperty.call(expected, prop.toLowerCase())) {
        continue;
      }
      if (!Object.prototype.hasOwnProperty.call(actual, prop.toLowerCase())) {
        return false;
      }
      if (expected[prop] != actual[prop.toLowerCase()]) {
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

  validateGraphQL(actual, expected) {
    try {
      if (actual && typeof actual === 'object' && actual.query) {
        const actualQuery = graphQLParse(actual.query);
        const expectedQuery = graphQLParse(expected.query);
        removeLoc(actualQuery)
        removeLoc(expectedQuery)
        assert.deepStrictEqual(actualQuery, expectedQuery);
        if (actual.variables || expected.variables) {
          assert.deepStrictEqual(actual.variables, expected.variables);
        }
        return true;
      }
    } catch (error) {
      return false;
    }
    return false;
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

  /**
   * returns a matching interaction
   * @param {object} req - req object
   * @param {Map<string, object>} interactions - interactions
   */
  getMatchingInteraction(req, interactions) {
    const ids = Array.from(interactions.keys());
    for (let i = ids.length - 1; i >= 0; i--) {
      const interaction = interactions.get(ids[i]);
      const isValidMethod = (interaction.withRequest.method === req.method);
      if (!isValidMethod) {
        continue;
      }
      const isValidPath = (interaction.withRequest.path === req.path);
      if (!isValidPath) {
        continue;
      }
      let isValidQuery = true;
      if (!interaction.withRequest.ignoreQuery) {
        if (Object.keys(req.query).length > 0 || interaction.withRequest.query) {
          isValidQuery = this.validateQuery(req.query, interaction.withRequest.query);
        }
      }
      if (!isValidQuery) {
        continue;
      }
      let isValidHeaders = true;
      if (interaction.withRequest.headers) {
        isValidHeaders = this.validateHeaders(req.headers, interaction.withRequest.headers);
      }
      let isValidBody = true;
      if (!interaction.withRequest.ignoreBody) {
        if (interaction.withRequest.graphQL) {
          isValidBody = this.validateGraphQL(req.body, interaction.withRequest.body);
        } else {
          if (typeof req.body === 'object') {
            if (Object.keys(req.body).length > 0) {
              isValidBody = this.validateBody(req.body, interaction.withRequest.body);
            }
          } else if (req.body) {
            isValidBody = this.validateBody(req.body, interaction.withRequest.body);
          }
        }
      }
      if (isValidMethod && isValidPath && isValidQuery && isValidHeaders && isValidBody) {
        return interaction;
      }
    }
    return null;
  },

  /**
   * validates if the value is string or not
   * @param {string} value - value to be validated
   */
  isValidString(value) {
    return (typeof value === 'string' && value)
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
  }

}

function removeLoc(document) {
  for (let prop in document) {
    if (prop === 'loc') {
      delete document[prop];
    } else {
      if (typeof document[prop] === 'object') {
        removeLoc(document[prop])
      }
    }
  }
}

module.exports = helper;
