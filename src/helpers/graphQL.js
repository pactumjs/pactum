const assert = require('assert');
const { parse } = require('parse-graphql');

const graphql = {

  compare(actual, expected) {
    try {
      if (actual && typeof actual === 'object' && actual.query) {
        const actualQuery = parse(actual.query);
        const expectedQuery = parse(expected.query);
        removeLoc(actualQuery);
        removeLoc(expectedQuery);
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
  }

};

function removeLoc(document) {
  for (let prop in document) {
    if (prop === 'loc') {
      delete document[prop];
    } else {
      if (typeof document[prop] === 'object') {
        removeLoc(document[prop]);
      }
    }
  }
}

module.exports = graphql;

