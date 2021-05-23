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
        const result = compare(actualQuery, expectedQuery, {}, '$.graphQL.query', strict);
        const actualVariables = typeof actual.variables === 'string' ? JSON.parse(actual.variables) : actual.variables;
        if (result.equal && (actualVariables || expected.variables)) {
          return compare(actualVariables, expected.variables, {}, '$.graphQL.variables', strict);
        }
        return result;
      }
    } catch (error) {
      return { message: error.toString(), equal: false };
    }
    return { message: 'Not a graphql query', equal: false };
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

