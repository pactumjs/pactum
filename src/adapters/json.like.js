const config = require('../config');
const handler = require('../exports/handler');
const helper = require('../helpers/helper');

class LikeJson {

  constructor(opts = {}) {
    this.target = opts.target || 'Json';
  }

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

  expressionCompare(actual, expected, actualPath, expectedPath) {
    if (typeof expected === 'string') {
      const value = config.strategy.assert.expression.includes;
      if (helper.matchesStrategy(expected, config.strategy.assert.expression)) {
        const expression = expected.replace(value, 'actual');
        const res = eval(expression);
        if (res !== true) {
          return `${this.target} doesn't fulfil expression '${expression.replace('actual', expectedPath).trim()}'. Actual value found: ${actual}`;
        }
        return true;
      }
    }
  }

  valueAssertionCompare(actual, expected, actualPath, expectedPath) {
    const assert = config.strategy.assert;
    if (typeof expected === 'string' && helper.matchesStrategy(expected, assert.handler)) {
      const [handlerName, ..._args] = helper.sliceStrategy(expected, assert.handler).split(':');
      try {
        const handlerFun = handler.getAssertHandler(handlerName);
        const args = _args.length > 0 ? _args[0].split(',') : _args;
        const res = handlerFun({ data: actual, args });
        if (res !== true) {
          return `${this.target} doesn't fulfil assertion '${expected}' at '${expectedPath}'`;
        }
        return true;
      } catch (_) {
        return;
      }
    }
  }

  valueCompare(actual, expected, actualPath, expectedPath) {
    if (actual === expected) {
      return '';
    }
    if (expected instanceof RegExp) {
      if (expected.test(actual)) {
        return '';
      }
      return `${this.target} doesn't match with '${expected}' at '${expectedPath}' but found '${actual}'`;
    }
    const exprRes = this.expressionCompare(actual, expected, actualPath, expectedPath);
    if (exprRes) {
      return exprRes === true ? '' : exprRes;
    }
    const valueAssertRes = this.valueAssertionCompare(actual, expected, actualPath, expectedPath);
    if (valueAssertRes) {
      return valueAssertRes === true ? '' : valueAssertRes;
    }
    if (typeof expected !== typeof actual) {
      return `${this.target} doesn't have type '${typeof expected}' at '${expectedPath}' but found '${typeof actual}'`;
    }
    if (typeof expected !== 'object' && typeof actual !== 'object') {
      return `${this.target} doesn't have value '${expected}' at '${expectedPath}' but found '${actual}'`;
    }
    if (expected === null || actual === null) {
      return `${this.target} doesn't have value '${expected}' at '${expectedPath}' but found '${actual}'`;
    }
    if (Array.isArray(expected) && !Array.isArray(actual)) {
      return `${this.target} doesn't have type 'array' at '${expectedPath}' but found 'object'`;
    }
    if (!Array.isArray(expected) && Array.isArray(actual)) {
      return `${this.target} doesn't have type 'object' at '${expectedPath}' but found 'array'`;
    }
    return null;
  }

  arrayCompare(actual, expected, actualPath, expectedPath) {
    if (expected.length > actual.length) {
      return `${this.target} doesn't have 'array' with length '${expected.length}' at '${expectedPath}' but found 'array' with length '${actual.length}'`;
    }
    const seen = new Set();
    for (let i = 0; i < expected.length; i++) {
      let found = false;
      const eItem = expected[i];
      let aItem = actual[i];
      const newExpectedPath = expectedPath + `[${i}]`;
      let actualPathResp = '';
      if (seen.has(i)) {
        actualPathResp = `${this.target} doesn't have expected value at '${newExpectedPath}'`;
      } else {
        actualPathResp = this.compare(aItem, eItem, newExpectedPath, newExpectedPath);
        if (actualPathResp === '') {
          seen.add(i);
          continue;
        }
      }
      for (let j = i + 1; j < actual.length; j++) {
        if (!seen.has(j)) {
          aItem = actual[j];
          const newActualPath = actualPath + `[${j}]`;
          const resp = this.compare(aItem, eItem, newActualPath, newExpectedPath);
          if (resp === '') {
            seen.add(j);
            found = true;
            break;
          }
        }
      }
      if (found) {
        continue;
      }
      for (let j = 0; j < i; j++) {
        if (!seen.has(j)) {
          aItem = actual[j];
          const newActualPath = actualPath + `[${j}]`;
          const resp = this.compare(aItem, eItem, newActualPath, newExpectedPath);
          if (resp === '') {
            seen.add(j);
            found = true;
            break;
          }
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
        return `${this.target} doesn't have property '${prop}' at '${expectedPath}'`;
      }
      const newPath = expectedPath + '.' + prop;
      const resp = this.compare(actual[prop], expected[prop], newPath, newPath);
      if (resp) {
        return resp;
      }
    }
  }

}

function validate(actual, expected, opts) {
  let actual_path = '$';
  let expected_path = '$';
  if (opts && opts.root_path) {
    expected_path = opts.root_path;
  }
  return new LikeJson(opts).compare(actual, expected, actual_path, expected_path);
}

module.exports = {
  validate
};