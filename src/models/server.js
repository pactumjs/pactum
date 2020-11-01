const polka = require('polka');

const Interaction = require('./interaction');

const helper = require('../helpers/helper');
const utils = require('../helpers/utils');
const store = require('../helpers/store');
const log = require('../helpers/logger');
const hr = require('../helpers/handler.runner');
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
    log.debug(`Mock Interaction added to Server - ${id}`);
  }

  addPactInteraction(id, interaction) {
    store.addInteraction(interaction);
    this.pactInteractions.set(id, interaction);
    log.debug(`Pact Interaction added to Server - ${id}`);
  }

  removeInteraction(id) {
    if (this.mockInteractions.has(id)) {
      this.removeMockInteraction(id);
    } else if (this.pactInteractions.has(id)) {
      this.removePactInteraction(id);
    } else {
      log.warn(`Unable to remove interaction. Interaction not found with id - ${id}`);
    }
  }

  removeMockInteraction(id) {
    this.mockInteractions.delete(id);
    log.trace(`Removed mock interaction with id - ${id}`);
  }

  removePactInteraction(id) {
    this.pactInteractions.delete(id);
    log.trace(`Removed pact interaction with id - ${id}`);
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

  getInteraction(id) {
    if (this.mockInteractions.has(id)) {
      return this.mockInteractions.get(id);
    } else if (this.pactInteractions.has(id)) {
      return this.pactInteractions.get(id);
    } else {
      log.warn(`Interaction Not Found - ${id}`);
      return null;
    }
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
    let interaction = utils.getMatchingInteraction(req, server.pactInteractions);
    if (!interaction) {
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
  const { willRespondWith } = interaction;
  if (typeof willRespondWith === 'function') {
    willRespondWith(req, res);
  } else {
    let response = {};
    if (willRespondWith[interaction.callCount]) {
      response = willRespondWith[interaction.callCount];
    } else {
      response = willRespondWith;
    }
    res.set(response.headers);
    res.status(response.status);
    const delay = getDelay(response);
    if (delay > 0) {
      sendResponseBody(res, response.body);
    } else {
      setTimeout(() => sendResponseBody(res, response.body), delay);
    }
  }
  interaction.callCount += 1;
  // updateCalls(req, interaction)
}

function updateCalls(req, interaction) {
  if (!interaction.calls) {
    interaction.calls = [];
  }
  interaction.calls.push({
    request: {
      method: req.method,
      path: req.path,
      query: req.query,
      headers: req.headers,
      body: req.body
    },
    exercisedAt: helper.getCurrentTime()
  });
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
 * @param {object} willRespondWith - will Respond With
 */
function getDelay(willRespondWith) {
  const delay = willRespondWith.delay;
  if (delay.type === 'RANDOM') {
    const min = delay.min;
    const max = delay.max;
    return Math.floor(Math.random() * (max - min)) + min;
  } else {
    return delay.value;
  }
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
    query: req.query,
    body: req.body
  });
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
      case '/api/pactum/health':
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.write("OK");
        res.end();
        break;
      case '/api/pactum/handlers':
        handleRemoteHandler(req, res, server);
        break;
      case '/api/pactum/mockInteractions':
        handleRemoteInteractions(req, res, server, 'MOCK');
        break;
      case '/api/pactum/pactInteractions':
        handleRemoteInteractions(req, res, server, 'PACT');
        break;
      case '/api/pactum/pacts/save':
        savePactsRemote(req, res);
        break;
      case '/api/pactum/pacts/publish':
        publishPactsRemote(req, res);
        break;
      default:
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("404 Not Found\n");
        res.end();
        break;
    }
  });
}

function handleRemoteHandler(req, res, server) {
  try {
    const ids = [];
    for (let i = 0; i < req.body.length; i++) {
      const raw = req.body[i];
      const handlers = raw.handlers;
      const data = raw.data;
      for (let j = 0; j < handlers.length; j++) {
        const { name, type } = handlers[j];
        if (type === 'MOCK') {
          const rawMock = hr.mockInteraction(name, data);
          const interaction = new Interaction(rawMock, true);
          server.mockInteractions.set(interaction.id, interaction);
          ids.push(interaction.id);
        } else {
          const rawPact = hr.pactInteraction(name, data);
          const interaction = new Interaction(rawPact, false);
          server.pactInteractions.set(interaction.id, interaction);
          ids.push(interaction.id);
        }
      }
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(ids));
    res.end();
  } catch (error) {
    log.error(`Error running handlers - ${error}`);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ error: error.message }));
    res.end();
  }
}

function handleRemoteInteractions(req, response, server, interactionType) {
  const res = new ExpressResponse(response);
  const mock = interactionType === 'MOCK';
  const interactions = (mock ? server.mockInteractions : server.pactInteractions);
  const raws = [];
  const ids = [];
  try {
    switch (req.method) {
      case 'POST':
        for (let i = 0; i < req.body.length; i++) {
          const raw = req.body[i];
          const remoteInteraction = new Interaction(raw, mock);
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
        if (req.query.ids) {
          const ids = req.query.ids.split(',');
          ids.forEach(id => {
            const intObj = interactions.get(id);
            if (intObj) {
              raws.push(intObj);
            }
          });
        } else {
          for (const [id, interaction] of interactions) {
            log.trace(`Fetching remote interaction - ${id}`);
            raws.push(interaction);
          }
        }
        res.status(200);
        res.send(raws);
        break;
      case 'DELETE':
        if (req.query.ids) {
          const ids = req.query.ids.split(',');
          ids.forEach(id => interactions.delete(id));
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

function savePactsRemote(req, response) {
  log.info('Saving Pacts (Remote)');
  const res = new ExpressResponse(response);
  try {
    if (req.method === 'POST') {
      store.save();
      res.status(200);
    } else {
      res.status(405);
    }
  } catch (error) {
    log.error('Error Saving Pacts (Remote)');
    log.error(error);
    res.status(500);
  }
  res.send();
}

async function publishPactsRemote(req, response) {
  log.info('Publishing Pacts (Remote)');
  const res = new ExpressResponse(response);
  try {
    if (req.method === 'POST') {
      await store.publish(req.body);
      res.status(200);
    } else {
      res.status(405);
    }
  } catch (error) {
    log.error('Error Saving Pacts (Remote)');
    log.error(error);
    res.status(500);
  }
  res.send();
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
  log.trace('Request', {
    method: req.method,
    path: req.path,
    query: req.query,
    headers: req.headers
  });
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
