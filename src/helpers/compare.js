const log = require('./logger');

class Compare {

  jsonLike(actual, expected) {
    const comparer = new LikeJson();
    const message = comparer.compare(actual, expected);
    const equal = message === '';
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

  compare(actual, expected, actualPath = '$', expectedPath = '$') {
    const valueRes = this.valueCompare(actual, expected, actualPath, expectedPath);
    if (valueRes !== null) {
      return valueRes;
    }
    if (Array.isArray(expected)) {
      const arrRes = this.arrayCompare(actual, expected, actualPath, expectedPath);
      if (arrRes) {
        return arrRes;
      }
    } else {
      const objRes = this.objectCompare(actual, expected, actualPath, expectedPath);
      if (objRes) {
        return objRes;
      }
    }
    return '';
  }

  valueCompare(actual, expected, actualPath, expectedPath) {
    if (actual === expected) {
      return '';
    }
    if (expected instanceof RegExp) {
      if (expected.test(actual)) {
        return '';
      }
      return `Json doesn't match with '${expected}' at '${expectedPath}' but found '${actual}'`;
    }
    if (typeof expected !== typeof actual) {
      return `Json doesn't have type '${typeof expected}' at '${expectedPath}' but found '${typeof actual}'`;
    }
    if (typeof expected !== 'object' && typeof actual !== 'object') {
      return `Json doesn't have value '${expected}' at '${expectedPath}' but found '${actual}'`;
    }
    if (expected === null || actual === null) {
      return `Json doesn't have value '${expected}' at '${expectedPath}' but found '${actual}'`;
    }
    if (Array.isArray(expected) && !Array.isArray(actual)) {
      return `Json doesn't have type 'array' at '${expectedPath}' but found 'object'`;
    }
    if (!Array.isArray(expected) && Array.isArray(actual)) {
      return `Json doesn't have type 'object' at '${expectedPath}' but found 'array'`;
    }
    return null;
  }

  arrayCompare(actual, expected, actualPath, expectedPath) {
    if (expected.length > actual.length) {
      return `Json doesn't have 'array' with length '${expected.length}' at '${expectedPath}' but found 'array' with length '${actual.length}'`;
    }
    const seen = new Set();
    for (let i = 0; i < expected.length; i++) {
      let found = false;
      const eItem = expected[i];
      let aItem = actual[i];
      const newExpectedPath = expectedPath + `[${i}]`;
      const actualPathResp = this.compare(aItem, eItem, newExpectedPath, newExpectedPath);
      if (actualPathResp === '') {
        seen.add(i);
        continue;
      }
      for (let j = i + 1; j < actual.length && !seen.has(j); j++) {
        aItem = actual[j];
        const newActualPath = actualPath + `[${j}]`;
        const resp = this.compare(aItem, eItem, newActualPath, newExpectedPath);
        if (resp === '') {
          seen.add(j);
          found = true;
          break;
        }
      }
      if (found) {
        continue;
      }
      for (let j = 0; j < i && !seen.has(j); j++) {
        aItem = actual[j];
        const newActualPath = actualPath + `[${j}]`;
        const resp = this.compare(aItem, eItem, newActualPath, newExpectedPath);
        if (resp === '') {
          seen.add(j);
          found = true;
          break;
        }
      }
      if (!found) {
        return actualPathResp;
      }
    }
  }

  objectCompare(actual, expected, actualPath, expectedPath) {
    for (const prop in expected) {
      if (!Object.prototype.hasOwnProperty.call(expected, prop)) {
        continue;
      }
      if (!Object.prototype.hasOwnProperty.call(actual, prop)) {
        return `Json doesn't have property '${prop}' at '${expectedPath}'`;
      }
      const newPath = expectedPath + '.' + prop;
      const resp = this.compare(actual[prop], expected[prop], newPath, newPath);
      if (resp) {
        return resp;
      }
    }
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
