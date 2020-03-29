const polka = require('polka');

const Interaction = require('./interaction');

const helper = require('../helpers/helper');
const utils = require('../helpers/utils');
const store = require('../helpers/store');
const log = require('../helpers/logger');
const config = require('../config');

class Server {

  constructor() {
    this.app = null;
    this.mockInteractions = new Map();
    this.pactInteractions = new Map();
  }

  start() {
    log.trace(`Starting mock server on port ${config.mock.port}`);
    return new Promise((resolve) => {
      if (!this.app) {
        this.app = polka();
        this.app.use(logger);
        this.app.use(bodyParser);
        registerPactumRemoteRoutes(this);
        registerAllRoutes(this, this.app);
        this.app.listen(config.mock.port, () => {
          log.info(`Mock server is listening on port ${config.mock.port}`);
          resolve();
        });
      } else {
        log.warn(`Mock server is already running on port ${config.mock.port}`);
      }
    });
  }

  stop() {
    log.trace(`Stopping mock server on port ${config.mock.port}`);
    return new Promise((resolve) => {
      if (this.app) {
        this.app.server.close(() => {
          this.app = null;
          log.info(`Mock server stopped on port ${config.mock.port}`);
          resolve();
        });
      } else {
        log.warn(`Mock server is not running on port ${config.mock.port}`);
        resolve();
      }
    });
  }

  addMockInteraction(id, interaction) {
    this.mockInteractions.set(id, interaction);
  }

  addPactInteraction(id, interaction) {
    store.addInteraction(interaction);
    this.pactInteractions.set(id, interaction);
  }

  removeInteraction(id) {
    if (this.mockInteractions.has(id)) {
      this.mockInteractions.delete(id);
    } else if (this.pactInteractions.has(id)) {
      this.pactInteractions.delete(id);
    } else {
      log.warn('Unable to remove interaction. Interaction not found with id', id);
    }

  }

  removeMockInteraction(id) {
    this.mockInteractions.delete(id);
    log.trace('Removed mock interaction with id', id);
  }

  removePactInteraction(id) {
    this.pactInteractions.delete(id);
    log.trace('Removed pact interaction with id', id);
  }

  clearMockInteractions() {
    this.mockInteractions.clear();
    log.trace('Cleared mock interactions');
  }

  clearPactInteractions() {
    this.pactInteractions.clear();
    log.trace('Cleared pact interactions');
  }

  clearAllInteractions() {
    this.clearMockInteractions();
    this.clearPactInteractions();
  }

}

/**
 * registers all routes for interactions
 * @param {Server} server - server object
 * @param {Express} app - express app object
 */
function registerAllRoutes(server, app) {
  app.all('/*', (req, response) => {
    const res = new ExpressResponse(response);
    log.debug('Finding matching interaction from pact interactions -', server.pactInteractions.size);
    let interaction = utils.getMatchingInteraction(req, server.pactInteractions);
    if (!interaction) {
      log.debug('Finding matching interaction from mock interactions -', server.mockInteractions.size);
      interaction = utils.getMatchingInteraction(req, server.mockInteractions);
    }
    if (interaction) {
      sendInteractionFoundResponse(req, res, interaction);
    } else {
      sendInteractionNotFoundResponse(req, res);
    }
  });
}

/**
 * respond with details in interaction
 * @param {object} req - HTTP request
 * @param {ExpressResponse} res - HTTP response
 * @param {Interaction} interaction - HTTP interaction
 */
function sendInteractionFoundResponse(req, res, interaction) {
  store.updateInteractionExerciseCounter(interaction.id);
  interaction.exercised = true;
  if (typeof interaction.willRespondWith === 'function') {
    interaction.willRespondWith(req, res);
  } else {
    res.set(interaction.willRespondWith.headers);
    res.status(interaction.willRespondWith.status);
    const delay = getDelay(interaction);
    setTimeout(() => sendResponseBody(res, interaction.willRespondWith.body), delay);
  }
}

/**
 * sends response body
 * @param {ExpressResponse} res - HTTP response
 * @param {object} body - response body to be sent
 */
function sendResponseBody(res, body) {
  if (body) {
    res.send(body);
  } else {
    res.send();
  }
}

/**
 * returns response delay in ms
 * @param {Interaction} interaction - interaction
 */
function getDelay(interaction) {
  let delay = 0;
  if (interaction.willRespondWith.fixedDelay) {
    delay = interaction.willRespondWith.fixedDelay;
  }
  return delay;
}

/**
 * respond with not found response
 * @param {object} req - HTTP request
 * @param {ExpressResponse} res - HTTP response
 */
function sendInteractionNotFoundResponse(req, res) {
  log.warn('Interaction Not Found in Mock Server', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    query: req.query ? JSON.parse(JSON.stringify(req.query)) : req.query,
    body: req.body
  });
  log.debug(helper.stringify(req.body));
  res.status(404);
  res.send('Interaction Not Found');
}

/**
 * registers all pactum routes
 * @param {Server} server - mock server
 */
function registerPactumRemoteRoutes(server) {
  const app = server.app;
  app.all('/api/pactum/*', (req, res) => {
    switch (req.path) {
      case '/api/pactum/mockInteraction':
        handleRemoteInteractions(req, res, server, 'MOCK');
        break;
      case '/api/pactum/pactInteraction':
        handleRemoteInteractions(req, res, server, 'PACT');
        break;
      // publish pacts
      default:
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("404 Not Found\n");
        res.end();
        break;
    }
  });
}

function handleRemoteInteractions(req, response, server, interactionType) {
  const res = new ExpressResponse(response);
  const mock = interactionType === 'MOCK';
  const interactions = (mock ? server.mockInteractions : server.pactInteractions);
  const rawInteractions = [];
  const ids = [];
  try {
    switch (req.method) {
      case 'POST':
        for (let i = 0; i < req.body.length; i++) {
          const rawInteraction = req.body[i];
          const remoteInteraction = new Interaction(rawInteraction, mock);
          interactions.set(remoteInteraction.id, remoteInteraction);
          ids.push(remoteInteraction.id);
          if (!mock) {
            store.addInteraction(remoteInteraction);
          }
        }
        res.status(200);
        res.send(ids);
        break;
      case 'GET':
        if (req.query.id) {
          rawInteractions.push(interactions.get(req.query.id).rawInteraction);
        } else {
          for (const [id, interaction] of interactions) {
            log.trace('Fetching remote interaction', id);
            rawInteractions.push(interaction.rawInteraction);
          }
        }
        res.status(200);
        res.send(rawInteractions);
        break;
      case 'DELETE':
        if (req.query.id) {
          interactions.delete(req.query.id);
        } else {
          interactions.clear();
        }
        res.status(200);
        res.send();
        break;
      default:
        res.status(405);
        res.send();
        break;
    }
  } catch (error) {
    log.error(`Error saving remote interaction - ${error}`);
    res.status(400);
    res.send({ error: error.message });
  }

}

function bodyParser(req, res, next) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    req.body = helper.getJson(body);
    log.trace('Request Body', req.body);
    next();
  });
}

function logger(req, res, next) {
  log.trace('Request', req.method, req.path);
  log.trace('Request Query', req.query);
  log.trace('Request Headers', req.headers);
  next();
}

class ExpressResponse {
  constructor(res) {
    this.res = res;
  }

  status(code) {
    this.res.statusCode = code;
  }

  set(headers) {
    for (const prop in headers) {
      this.res.setHeader(prop, headers[prop]);
    }
  }

  send(data) {
    if (data) {
      if (typeof data === 'object') {
        this.res.setHeader('Content-Type', 'application/json');
        this.res.end(JSON.stringify(data));
      } else {
        this.res.end(data);
      }
    } else {
      this.res.end();
    }
  }
}

module.exports = Server;
