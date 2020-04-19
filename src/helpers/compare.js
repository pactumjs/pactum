const log = require('./logger');

class Compare {

  jsonLike(actual, expected) {
    const comparer = new LikeJson();
    const equal = comparer.compare(actual, expected);
    let message = '';
    if (!equal) {
      if (comparer.expected === null) {
        message = `Json doesn't have property '${comparer.prop}' at '${comparer.path}'`;
      } else {
        let exactPath = '';
        if (comparer.prop !== null) {
          exactPath = `${comparer.path}.${comparer.prop}`;
        } else {
          exactPath = `${comparer.path}`;
        }
        if (comparer.actualPlaceValue) {
          message = `Json doesn't have value '${comparer.expected}' at '${exactPath}' but found '${comparer.actualPlaceValue}'`;
        } else {
          message = `Json doesn't have value '${comparer.expected}' at '${exactPath}' but found '${comparer.actual}'`;
        }
      }
    }
    log.debug('JSON Like:', equal, message);
    return { equal, message };
  }

  jsonMatch(actual, expected, matchingRules, rootPath = '$.body') {
    const comparer = new MatchJson(matchingRules);
    let equal = comparer.compare(actual, expected, rootPath);
    let message = '';
    if (!equal) {
      let exactPath = '';
      if (comparer.prop !== null) {
        exactPath = `${comparer.path}.${comparer.prop}`;
      } else {
        exactPath = `${comparer.path}`;
      }
      if (comparer.noProp) {
        message = `Json doesn't have "${comparer.prop}" at "${comparer.path}"`;
      } else if (comparer.invalidRegExp) {
        message = `Invalid RegExp provided "${comparer.expectedRegex}" at "${exactPath}"`;
      } else if (comparer.expectedType) {
        message = `Json doesn't have type "${comparer.expectedType}" at "${exactPath}" but found "${comparer.actualType}"`;
      } else if (comparer.expectedRegex) {
        message = `Json doesn't match with "${comparer.expectedRegex}" at "${exactPath}" but found "${comparer.actualValue}"`;
      } else if (comparer.expectedLength) {
        message = `Json doesn't have array with length "${comparer.expectedLength}" at "${exactPath}" but found with length "${comparer.actualLength}"`;
      } else {
        message = `Json doesn't have value "${comparer.expectedValue}" at "${exactPath}" but found "${comparer.actualValue}"`;
      }
    } else {
      for (const prop in matchingRules) {
        if (prop.startsWith(rootPath)) {
          const matchingRule = matchingRules[prop];
          if (!matchingRule.success) {
            equal = false;
            message = `Matching Rule - "${matchingRule.match}" failed at "${prop}"`;
            break;
          }
        }
      }
    }
    log.debug('JSON Match', equal, message);
    return { equal, message };
  }

}

class LikeJson {

  constructor() {
    this.path = '$';
    this.prop = null;
    this.expected = null;
    this.actual = null;
    this.actualPlaceValue = null;
  }

  compare(actualJson, expectedJson, path = '$') {
    if ((expectedJson instanceof RegExp && expectedJson.test(actualJson)) || (actualJson === expectedJson)) {
      return true;
    }
    if (!(actualJson instanceof Object) || !(expectedJson instanceof Object)) {
      this.expected = expectedJson;
      this.actual = actualJson;
      this.path = path;
      return false;
    }
    if (Array.isArray(expectedJson) && Array.isArray(actualJson)) {
      this.prop = null;
      for (let i = 0; i < expectedJson.length; i++) {
        let found = false;
        const newPath = path + `[${i}]`;
        for (let j = 0; j < actualJson.length; j++) {
          if (i === j) {
            this.actualPlaceValue = actualJson[j];
          }
          if (this.compare(actualJson[j], expectedJson[i], newPath)) {
            found = true;
            break;
          }
        }
        if (!found) {
          return false;
        }
        this.actualPlaceValue = null;
      }
    } else {
      for (const prop in expectedJson) {
        this.prop = prop;
        if (!Object.prototype.hasOwnProperty.call(expectedJson, prop)) {
          continue;
        }
        if (!Object.prototype.hasOwnProperty.call(actualJson, prop)) {
          this.path = path;
          return false;
        }
        this.expected = expectedJson[prop];
        this.actual = actualJson[prop];
        this.actualPlaceValue = null;
        if ((this.expected instanceof RegExp && this.expected.test(this.actual)) || (this.expected === this.actual)) {
          this.expected = null;
          this.actual = null;
          continue;
        }
        if (typeof (actualJson[prop]) !== "object") {
          this.path = path;
          return false;
        }
        const newPath = path + '.' + prop;
        this.expected = null;
        this.actual = null;
        if (!this.compare(actualJson[prop], expectedJson[prop], newPath)) {
          return false;
        }
      }
    }
    return true;
  }

}

class MatchJson {

  constructor(matchingRules) {
    this.path = '';
    this.prop = null;
    this.expectedValue = null;
    this.actualValue = null;
    this.expectedType = null;
    this.actualType = null;
    this.expectedRegex = null;
    this.expectedLength = null;
    this.actualLength = null;
    this.noProp = false;
    this.invalidRegExp = false;
    this.matchingRule = null;
    this.matchingRules = matchingRules;
  }

  /**
   * compare
   * @param {any} actual
   * @param {any} expected
   * @param {string} actualPath - actual path
   */
  compare(actual, expected, actualPath) {
    const matchingPath = actualPath.replace(/\[\d+\]/g, '[*]');
    const matchingRule = this.matchingRules[matchingPath];
    if (matchingRule) {
      const match = matchingRule.match;
      const min = matchingRule.min;
      if (match === 'type') {
        if (typeof actual !== typeof expected) {
          this.path = actualPath;
          this.expectedType = typeof expected;
          this.actualType = typeof actual;
          matchingRule.success = false;
          return false;
        }
        if (Array.isArray(expected)) {
          if (actual.length !== expected.length) {
            this.expectedLength = expected.length;
            this.actualLength = actual.length;
            this.path = actualPath;
            return false;
          }
          for (let i = 0; i < expected.length; i++) {
            const newActualPath = `${actualPath}[${i}]`;
            if (!this.compare(actual[i], expected[i], newActualPath)) {
              return false;
            }
          }
          matchingRule.success = true;
        } else if (typeof expected === 'object') {
          for (const prop in expected) {
            const newActualPath = `${actualPath}.${prop}`;
            if (this.matchingRules[newActualPath]) {
              if (!this.compare(actual[prop], expected[prop], newActualPath)) {
                return false;
              }
            } else {
              if (typeof actual[prop] !== typeof expected[prop]) {
                this.path = `${actualPath}.${prop}`;
                this.expectedType = typeof expected[prop];
                this.actualType = typeof actual[prop];
                matchingRule.success = false;
                return false;
              }
            }
            if (typeof expected[prop] === 'object') {
              if (!this.compare(actual[prop], expected[prop], newActualPath)) {
                return false;
              }
            }
          }
          matchingRule.success = true;
        } else {
          matchingRule.success = true;
        }
      } else if (match === 'regex') {
        try {
          const regex = new RegExp(matchingRule.regex);
          if (!regex.test(actual)) {
            this.path = actualPath;
            this.expectedRegex = matchingRule.regex;
            this.actualValue = actual;
            return false;
          }
          matchingRule.success = true;
        } catch (error) {
          this.path = actualPath;
          this.expectedRegex = matchingRule.regex;
          this.invalidRegExp = true;
          return false;
        }
      } else if (typeof min === 'number') {
        if (Array.isArray(actual)) {
          if (actual.length < min) {
            this.expectedLength = min;
            this.actualLength = actual.length;
            this.path = actualPath;
            return false;
          }
          matchingRule.success = true;
        } else {
          this.path = actualPath;
          this.expectedType = 'array';
          this.actualType = typeof actual;
          return false;
        }
        const newMatchingRule = this.matchingRules[`${matchingPath}[*].*`];
        if (newMatchingRule) {
          if (newMatchingRule.match === 'type') {
            for (let i = 0; i < actual.length; i++) {
              if (typeof actual[i] !== typeof expected[0]) {
                this.path = `${actualPath}[${i}]`;
                this.expectedType = typeof expected[0];
                this.actualType = typeof actual[i];
                newMatchingRule.success = false;
                return false;
              }
              if (!Array.isArray(expected[0]) && typeof expected[0] === 'object') {
                for (const prop in expected[0]) {
                  const newActualPath = `${actualPath}[${i}].${prop}`;
                  const newMatchingPath = `${matchingPath}[*].${prop}`;
                  if (this.matchingRules[newMatchingPath]) {
                    if (!this.compare(actual[i][prop], expected[0][prop], newActualPath)) {
                      return false;
                    }
                  } else {
                    if (typeof actual[i][prop] !== typeof expected[0][prop]) {
                      this.path = newActualPath;
                      this.expectedType = typeof expected[0][prop];
                      this.actualType = typeof actual[i][prop];
                      newMatchingRule.success = false;
                      return false;
                    }
                    if (typeof expected[0][prop] === 'object') {
                      if (!this.compare(actual[i][prop], expected[0][prop], newActualPath)) {
                        return false;
                      }
                    }
                  }
                }
              }
            }
            newMatchingRule.success = true;
          } else {
            throw new Error(`Unsupported Matching Rule - ${newMatchingRule.match}`);
          }
        }
      } else {
        throw new Error(`Unsupported Matching Rule - ${match}`);
      }
    } else {
      if (typeof actual !== typeof expected) {
        this.path = actualPath;
        this.expectedType = typeof expected;
        this.actualType = typeof actual;
        return false;
      }
      if (Array.isArray(expected)) {
        if (actual.length !== expected.length) {
          this.path = actualPath;
          this.expectedLength = expected.length;
          this.actualLength = actual.length;
          return false;
        }
        for (let i = 0; i < expected.length; i++) {
          const newActualPath = `${actualPath}[${i}]`;
          if (!this.compare(actual[i], expected[i], newActualPath)) {
            return false;
          }
        }
      } else if (typeof expected === 'object') {
        for (const prop in expected) {
          if (!Object.prototype.hasOwnProperty.call(actual, prop)) {
            this.path = actualPath;
            this.prop = prop;
            this.noProp = true;
            return false;
          }
          const newActualPath = `${actualPath}.${prop}`;
          if (!this.compare(actual[prop], expected[prop], newActualPath)) {
            return false;
          }
        }
      } else {
        if (expected !== actual) {
          this.path = actualPath;
          this.expectedValue = expected;
          this.actualValue = actual;
          return false;
        }
      }
    }
    return true;
  }

}

module.exports = Compare;
