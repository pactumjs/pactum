const { compare } = require('pactum-matchers').utils;
const graphQL = require('./graphQL');

const log = require('./logger');
const helper = require('./helper');

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
      const isValidMethod = (interaction.request.method === req.method);
      if (!isValidMethod) {
        log.debug(`Interaction with id ${interactionId} failed to match - HTTP Method`);
        continue;
      }
      const isValidPath = validatePath(req, interaction);
      if (!isValidPath) {
        log.debug(`Interaction with id ${interactionId} failed to match - HTTP Path`);
        continue;
      }
      const isValidQuery = validateQuery(req, interaction);
      if (!isValidQuery) {
        log.debug(`Interaction with id ${interactionId} failed to match - HTTP Query Params`);
        continue;
      }
      const isValidHeaders = validateHeaders(req, interaction);
      if (!isValidHeaders) {
        log.debug(`Interaction with id ${interactionId} failed to match - HTTP Headers`);
        continue;
      }
      const isValidBody = validateBody(req, interaction);
      if (isValidMethod && isValidPath && isValidQuery && isValidHeaders && isValidBody) {
        return interaction;
      }
      log.debug(`Interaction with id ${interactionId} failed to match - HTTP Body`);
    }
    return null;
  },

  printReqAndRes(request, response) {
    log.warn('Request', request);
    log.warn('Response', helper.getTrimResponse(response));
  }

};

function validatePath(req, interaction) {
  const { path, pathParams, matchingRules } = interaction.request;
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

function validateQuery(req, interaction) {
  const { strict, request } = interaction;
  return compare(req.query, request.queryParams, request.matchingRules, '$.query', strict).equal;
}

function validateHeaders(req, interaction) {
  const { request } = interaction;
  if (request.headers) {
    const lowerCaseActual = {};
    for (const prop in req.headers) {
      lowerCaseActual[prop.toLowerCase()] = req.headers[prop];
    }
    const lowerCaseExpected = {};
    for (const prop in request.headers) {
      lowerCaseExpected[prop.toLowerCase()] = request.headers[prop];
    }
    const response = compare(lowerCaseActual, lowerCaseExpected, request.matchingRules, '$.headers');
    return response.equal;
  }
  return true;
}

function validateBody(req, interaction) {
  const { strict, request } = interaction;
  if (request.graphQL) {
    return graphQL.compare(req.body, request.body);
  }
  if (strict) {
    if (req.body || request.body) {
      return compare(req.body, request.body, request.matchingRules, '$.body', strict).equal;
    }
  } else {
    if (request.body) {
      return compare(req.body, request.body, request.matchingRules, '$.body', strict).equal;
    }
  }
  return true;
}

module.exports = utils;