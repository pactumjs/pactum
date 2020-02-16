const graphQL = require('./graphQL');
const compare = require('./compare');

const utils = {

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
          isValidQuery = validateQuery(req.query, interaction.withRequest.query);
        }
      }
      if (!isValidQuery) {
        continue;
      }
      let isValidHeaders = true;
      if (interaction.withRequest.headers) {
        isValidHeaders = validateHeaders(req.headers, interaction.withRequest.headers);
      }
      let isValidBody = true;
      if (!interaction.withRequest.ignoreBody) {
        if (interaction.withRequest.graphQL) {
          isValidBody = graphQL.compare(req.body, interaction.withRequest.body);
        } else {
          if (typeof req.body === 'object') {
            if (Object.keys(req.body).length > 0) {
              isValidBody = validateBody(req.body, interaction.withRequest.body);
            }
          } else if (req.body) {
            isValidBody = validateBody(req.body, interaction.withRequest.body);
          }
        }
      }
      if (isValidMethod && isValidPath && isValidQuery && isValidHeaders && isValidBody) {
        return interaction;
      }
    }
    return null;
  }

};

function validateQuery(actual, expected) {
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
}

function validateHeaders(actual, expected) {
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
}

function validateBody(actual, expected) {
  if (typeof actual === typeof expected) {
    if (typeof actual === 'object') {
      return (JSON.stringify(actual) === JSON.stringify(expected));
    } else {
      return (actual === expected);
    }
  } else {
    return false;
  }
}

module.exports = utils;