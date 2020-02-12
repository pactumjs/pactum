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
    return { equal, message };
  }

  jsonMatch(actual, expected, matchingRules) {
    const comparer = new MatchJson(matchingRules);
    let equal = comparer.compare(actual, expected, '$.body');
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
        message = `Json doesn't have array with length "${comparer.expectedLength}" at "${exactPath}" but found "${comparer.actualLength}"`;
      } else {
        message = `Json doesn't have value "${comparer.expectedValue}" at "${exactPath}" but found "${comparer.actualValue}"`;
      }
    } else {
      for (const prop in matchingRules) {
        const matchingRule = matchingRules[prop];
        if (!matchingRule.success) {
          equal = false;
          message = `Matching Rule - "${matchingRule.match}" failed at "${prop}"`;
        }
      }
    }
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

  init() {
    this.expectedValue = null;
    this.actualValue = null;
    this.expectedType = null;
    this.actualType = null;
    this.expectedRegex = null;
    this.expectedLength = null;
    this.actualLength = null;
    this.matchingRule = null;
    this.noProp = false;
    this.invalidRegExp = false;
  }

  compare(actual, expected, path) {
    this.path = path;
    this.init();
    if (actual === expected) {
      return true;
    }
    if (typeof actual !== typeof expected) {
      this.expectedType = typeof expected;
      this.actualType = typeof actual;
      return false;
    }
    if (Array.isArray(expected)) {
      this.prop = null;
      this.matchingRule = this.matchingRules[path];
      if (this.matchingRule) {
        if (Object.prototype.hasOwnProperty.call(this.matchingRule, 'min')) {
          const min = this.matchingRule.min;
          if (actual.length < min) {
            this.expectedLength = min;
            this.actualLength = actual.length;
            return false;
          }
          this.matchingRule.success = true;
        }
      }
      this.matchingRule = this.matchingRules[`${path}[*].*`];
      if (this.matchingRule) {
        const newPath = `${path}[*]`;
        for (let i = 0; i < actual.length; i++) {
          if (!this.matchType(actual[i], expected[0], newPath)) {
            return false;
          }
        }
      } else {
        for (const prop in expected) {
          const newPath = `${path}[${prop}]`;
          if (!this.compare(actual[prop], expected[prop], newPath)) {
            return false;
          }
        }
      }
    } else if (typeof expected === 'object') {
      for (const prop in expected) {
        this.prop = prop;
        if (!Object.prototype.hasOwnProperty.call(actual, prop)) {
          this.noProp = true;
          return false;
        }
        this.matchingRule = this.matchingRules[`${path}.${prop}`];
        if (this.matchingRule) {
          const match = this.matchingRule.match;
          if (match === 'type') {
            if (typeof expected[prop] !== typeof actual[prop]) {
              this.expectedType = typeof expected[prop];
              this.actualType = typeof actual[prop];
              return false;
            }
            this.matchingRule.success = true;
          } else if (match === 'regex') {
            try {
              const regex = new RegExp(this.matchingRule.regex);
              if (!regex.test(actual[prop])) {
                this.expectedRegex = this.matchingRule.regex;
                this.actualValue = actual[prop];
                return false;
              }
              this.matchingRule.success = true;
            } catch (error) {
              this.expectedRegex = this.matchingRule.regex;
              this.invalidRegExp = true;
              return false;
            }
          } else {
            if (Object.prototype.hasOwnProperty.call(this.matchingRule, 'min')) {
              const min = this.matchingRule.min;
              if (Array.isArray(actual[prop])) {
                if (actual[prop].length < min) {
                  this.expectedLength = min;
                  this.actualLength = actual[prop].length;
                  return false;
                }
                this.matchingRule.success = true;
                const newPath = `${path}.${prop}`;
                if (!this.matchType(actual[prop], expected[prop], newPath)) {
                  return false;
                }
                this.path = path;
              } else {
                this.expectedType = 'array';
                this.actualType = typeof actual[prop];
                return false;
              }
            } else {
              // throw error
            }
          }
        } else {
          if (Array.isArray(expected)) {
            const newPath = `${path}[${prop}]`;
            if (!this.compare(actual[prop], expected[prop], newPath)) {
              return false;
            }
          } else if (typeof expected[prop] === 'object') {
            const newPath = `${path}.${prop}`;
            if (!this.compare(actual[prop], expected[prop], newPath)) {
              return false;
            }
          } else {
            if (expected[prop] !== actual[prop]) {
              this.expectedValue = expected[prop];
              this.actualValue = actual[prop];
              return false;
            }
          }
        }
      }
    } else {
      return expected === actual;
    }
    return true;
  }

  matchType(actual, expected, path) {
    this.init();
    this.path = path;
    this.matchingRule = this.matchingRules[`${path}[*].*`];
    if (this.matchingRule) {
      const expectedItem = expected[0];
      for (let i = 0; i < actual.length; i++) {
        const actualItem = actual[i];
        if (typeof actualItem !== typeof expectedItem) {
          this.path = `${this.path}[${i}]`;
          this.prop = null;
          this.expectedType = typeof expectedItem;
          this.actualType = typeof actualItem;
          return false;
        }
      }
      this.matchingRule.success = true;
    }
    return true;
  }

  _matchType(actual, expected, path) {
    if (actual === expected) {
      return true;
    }
    if (typeof actual !== typeof expected) {
      this.expectedType = typeof expectedItem;
      this.actualType = typeof actualItem;
      return false;
    }
    if (Array.isArray(expected)) {
      for (let i = 0; i < actual.length; i++) {
        const newPath = `${path}[${i}]`;
        if(!this._matchType(actual[i], expected[0], newPath)) {
          return false;
        }
      }
    } else if (typeof expected === 'object') {
      for (const prop in expected) {
        const newPath = `${path}.${prop}`;
        if(!this._matchType(actual[prop], expected[prop], newPath)) {
          return false;
        }
      }
    }
    return false;
  }

}

module.exports = Compare;
