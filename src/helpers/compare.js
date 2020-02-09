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
      if (comparer.noProp) {
        message = `Json doesn't have "${comparer.prop}" at "${comparer.path}"`;
      } else if (comparer.expectedType) {
        message = `Json doesn't have type "${comparer.expectedType}" at "${comparer.path}.${comparer.prop}" but found "${comparer.actualType}"`;
      } else {
        message = `Json doesn't have value "${comparer.expectedValue}" at "${comparer.path}.${comparer.prop}" but found "${comparer.actualValue}"`;
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
    this.noProp = false;
    this.matchingRule = null;
    this.matchingRules = matchingRules;
  }

  init() {
    this.expectedValue = null;
    this.actualValue = null;
    this.expectedType = null;
    this.actualType = null;
    this.matchingRule = null;
    this.noProp = false;
  }

  compare(actual, expected, path) {
    this.path = path;
    this.init();
    if (typeof actual !== typeof expected) {
      return false;
    }
    if (typeof expected === 'object') {
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
    return true;
  }

}

module.exports = Compare;
