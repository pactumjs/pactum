const graphQL = require('./graphQL');
const Compare = require('./compare');

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
      const isValidPath = validatePath(req.path, interaction.withRequest.path, interaction.withRequest.matchingRules);
      if (!isValidPath) {
        log.debug(`Interaction with id ${interactionId} failed to match - HTTP Path`);
        continue;
      }
      let isValidQuery = xValidateQuery(req, interaction);
      if (!isValidQuery) {
        log.debug(`Interaction with id ${interactionId} failed to match - HTTP Query Params`);
        continue;
      }
      let isValidHeaders = xValidateHeaders(req, interaction);
      if (!isValidHeaders) {
        log.debug(`Interaction with id ${interactionId} failed to match - HTTP Headers`);
        continue;
      }
      let isValidBody = xValidateBody(req, interaction);
      if (isValidMethod && isValidPath && isValidQuery && isValidHeaders && isValidBody) {
        return interaction;
      }
      log.debug(`Interaction with id ${interactionId} failed to match - HTTP Body`);
    }
    return null;
  }

};

function validatePath(actual, expected, matchingRules) {
  const compare = new Compare();
  const response = compare.jsonMatch(actual, expected, matchingRules, '$.path');
  return response.equal;
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
  const compare = new Compare();
  const response = compare.jsonMatch(actual, expected, matchingRules, '$.query');
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
  const compare = new Compare();
  const response = compare.jsonMatch(lowerCaseActual, lowerCaseExpected, matchingRules, '$.headers');
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
  const compare = new Compare();
  const response = compare.jsonMatch(actual, expected, matchingRules, '$.body');
  if (response.equal && !mock) {
    return compare.jsonMatch(expected, actual, matchingRules, '$.body').equal;
  } else {
    return response.equal;
  }
}

module.exports = utils;