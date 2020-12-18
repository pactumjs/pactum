const { compare } = require('pactum-matchers').utils;
const graphQL = require('./graphQL');

const log = require('./logger');

const utils = {

  /**
   * returns a matching interaction
   * @param {object} req - req object
   * @param {Map<string, object>} interactions - interactions
   */
  getMatchingInteraction(req, interactions) {
    const ids = Array.from(interactions.keys());
    for (let i = ids.length - 1; i >= 0; i--) {
      const interactionId = ids[i];
      log.debug(`Comparing interaction with id ${interactionId}`);
      const interaction = interactions.get(interactionId);
      const isValidMethod = (interaction.withRequest.method === req.method);
      if (!isValidMethod) {
        log.debug(`Interaction with id ${interactionId} failed to match - HTTP Method`);
        continue;
      }
      const isValidPath = xValidatePath(req, interaction);
      if (!isValidPath) {
        log.debug(`Interaction with id ${interactionId} failed to match - HTTP Path`);
        continue;
      }
      const isValidQuery = xValidateQuery(req, interaction);
      if (!isValidQuery) {
        log.debug(`Interaction with id ${interactionId} failed to match - HTTP Query Params`);
        continue;
      }
      const isValidHeaders = xValidateHeaders(req, interaction);
      if (!isValidHeaders) {
        log.debug(`Interaction with id ${interactionId} failed to match - HTTP Headers`);
        continue;
      }
      const isValidBody = xValidateBody(req, interaction);
      if (isValidMethod && isValidPath && isValidQuery && isValidHeaders && isValidBody) {
        return interaction;
      }
      log.debug(`Interaction with id ${interactionId} failed to match - HTTP Body`);
    }
    return null;
  }

};

function xValidatePath(req, interaction) {
  const { path, pathParams, matchingRules } = interaction.withRequest;
  const actualPath = req.path;
  const expectedPath = path;
  if (pathParams) {
    const actualParts = actualPath.split('/');
    const expectedParts = expectedPath.split('/');
    if (actualParts.length !== expectedParts.length) {
      return false;
    }
    const actual = {};
    const expected = {};
    for (let i = 0; i < actualParts.length; i++) {
      if (!actualParts[i]) continue;
      const actualPart = actualParts[i];
      const expectedPart = expectedParts[i];
      if (expectedPart.startsWith('{') && expectedPart.endsWith('}')) {
        const param = expectedPart.slice(1, -1);
        expected[param] = pathParams[param];
        actual[param] = actualPart;
      } else {
        if (actualPart !== expectedPart) {
          return false;
        }
      }
    }
    return compare(actual, expected, matchingRules, '$.path').equal;
  } else {
    return compare(actualPath, expectedPath, matchingRules, '$.path').equal;
  }
}

function xValidateQuery(req, interaction) {
  const { mock, withRequest } = interaction;
  if (mock) {
    if (withRequest.query) {
      return validateQuery(req.query, withRequest.query, withRequest.matchingRules, mock);
    }
  } else if (Object.keys(req.query).length > 0 || withRequest.query) {
    return validateQuery(req.query, withRequest.query, withRequest.matchingRules, mock);
  }
  return true;
}

function validateQuery(actual, expected, matchingRules, mock) {
  const response = compare(actual, expected, matchingRules, '$.query');
  if (response.equal && !mock) {
    for (const prop in actual) {
      if (!Object.prototype.hasOwnProperty.call(expected, prop)) {
        log.debug(`Query param not found - ${prop}`);
        return false;
      }
    }
    return true;
  } else {
    return response.equal;
  }
}

function xValidateHeaders(req, interaction) {
  const { withRequest } = interaction;
  if (withRequest.headers) {
    return validateHeaders(req.headers, withRequest.headers, withRequest.matchingRules);
  }
  return true;
}

function validateHeaders(actual, expected, matchingRules) {
  // covert props of header to lower case : Content-Type -> content-type
  const lowerCaseActual = {};
  for (const prop in actual) {
    lowerCaseActual[prop.toLowerCase()] = actual[prop];
  }
  const lowerCaseExpected = {};
  for (const prop in expected) {
    lowerCaseExpected[prop.toLowerCase()] = expected[prop];
  }
  const response = compare(lowerCaseActual, lowerCaseExpected, matchingRules, '$.headers');
  return response.equal;
}

function xValidateBody(req, interaction) {
  const { mock, withRequest } = interaction;
  if (mock) {
    if (withRequest.graphQL) {
      return graphQL.compare(req.body, withRequest.body);
    }
    if (withRequest.body) {
      return validateBody(req.body, withRequest.body, withRequest.matchingRules, mock);
    }
  } else {
    if (withRequest.graphQL) {
      return graphQL.compare(req.body, withRequest.body);
    }
    if (req.body || withRequest.body) {
      return validateBody(req.body, withRequest.body, withRequest.matchingRules, mock);
    }
  }
  return true;
}

function validateBody(actual, expected, matchingRules, mock) {
  const response = compare(actual, expected, matchingRules, '$.body');
  if (response.equal && !mock) {
    return compare(expected, actual, matchingRules, '$.body').equal;
  } else {
    return response.equal;
  }
}

module.exports = utils;