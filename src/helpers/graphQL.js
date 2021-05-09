const { parse } = require('parse-graphql');
const { compare } = require('pactum-matchers').utils;

const graphql = {

  compare(actual, expected, strict) {
    try {
      if (actual && typeof actual === 'object' && actual.query) {
        const actualQuery = parse(actual.query);
        const expectedQuery = parse(expected.query);
        removeLoc(actualQuery);
        removeLoc(expectedQuery);
        const result = compare(actualQuery, expectedQuery, {}, '$.graphQL.query', strict).equal;
        if (result && (actual.variables || expected.variables)) {
          return compare(actual.variables, expected.variables, {}, '$.graphQL.variables', strict).equal;
        }
        return result;
      }
    } catch (error) {
      return false;
    }
    return false;
  }

};

function removeLoc(document) {
  for (const prop in document) {
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

