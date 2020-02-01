const polka = require('polka');

const Interaction = require('./interaction');

const helper = require('../helpers/helper');
const store = require('../helpers/store');
const config = require('../config');

class Server {

  constructor() {
    this.app = null;
    this.mockInteractions = new Map();
    this.pactInteractions = new Map();
  }

  start() {
    return new Promise((resolve) => {
      if (!this.app) {
        this.app = polka();
        this.app.use(bodyParser);
        registerPactumRoutes(this, this.app);
        registerAllRoutes(this, this.app);
        this.app.listen(config.mock.port, () => {
          console.log('PACTUM mock server is listening on port', config.mock.port);
          resolve();
        });
      }
    });
  }

  stop() {
    return new Promise((resolve) => {
      if (this.app) {
        this.app.server.close(() => {
          console.log('PACTUM mock server stopped on port', config.mock.port);
          resolve();
        });
      } else {
        console.log('No PACTUM mock server is running on port', config.mock.port);
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
      // error
    }

  }

  removeMockInteraction(id) {
    this.mockInteractions.delete(id);
  }

  removePactInteraction(id) {
    this.pactInteractions.delete(id);
  }

  clearMockInteractions() {
    this.mockInteractions.clear();
  }

  clearPactInteractions() {
    this.pactInteractions.clear();
  }

  clearAllInteractions() {
    this.mockInteractions.clear();
    this.pactInteractions.clear();
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
    let interactionExercised = false;
    let interaction = helper.getValidInteraction(req, server.pactInteractions);
    if (!interaction) {
      interaction = helper.getValidInteraction(req, server.mockInteractions);
    }
    if (interaction) {
      store.updateInteractionExerciseCounter(interaction.id);
      interaction.exercised = true;
      interactionExercised = true;
      res.set(interaction.willRespondWith.headers);
      res.status(interaction.willRespondWith.status);
      if (interaction.willRespondWith.body) {
        res.send(interaction.willRespondWith.body);
      } else {
        res.send();
      }
    }
    if (!interactionExercised) {
      console.log();
      console.log('PACTUM', 'Interaction not found for');
      console.log('PACTUM', req.method, req.path);
      console.log('PACTUM', 'Headers -', req.headers);
      console.log('PACTUM', 'Query -', req.query);
      console.log('PACTUM', 'Body -', req.body);
      res.status(404);
      res.send('Interaction Not Found');
    }
  });
}

/**
 * registers pactum interactions
 * @param {Server} server - server object
 * @param {Express} app - express app object
 */
function registerPactumRoutes(server, app) {
  app.post('/api/pactum/mockInteraction', (req, response) => {
    const res = new ExpressResponse(response);
    try {
      const interaction = new Interaction(req.body, true);
      server.mockInteractions.set(interaction.id, interaction);
      res.status(200);
      res.send({ id: interaction.id });
    } catch (error) {
      console.log(`Error saving mock interaction - ${error}`);
      res.status(400);
      res.send({ error: error.message });
    }
  });
  app.get('/api/pactum/mockInteraction/:id', (req, response) => {
    const res = new ExpressResponse(response);
    try {
      const id = req.params.id;
      if (server.mockInteractions.has(id)) {
        res.status(200);
        res.send(server.mockInteractions.get(id).rawInteraction);
      } else {
        res.status(404);
        res.send({ error: `Mock interaction not found - ${id}` });
      }
    } catch (error) {
      console.error(`Error fetching mock interaction - ${error}`);
      res.status(500);
      res.send({ error: `Internal System Error` });
    }
  });
  app.get('/api/pactum/mockInteraction', (req, response) => {
    const res = new ExpressResponse(response);
    try {
      const interactions = [];
      for (let [id, interaction] of server.mockInteractions) {
        interactions.push(interaction.rawInteraction);
      }
      res.status(200);
      res.send(interactions);
    } catch (error) {
      console.error(`Error fetching mock interactions - ${error}`);
      res.status(500);
      res.send({ error: `Internal System Error` });
    }
  });
  app.delete('/api/pactum/mockInteraction/:id', (req, response) => {
    const res = new ExpressResponse(response);
    try {
      const id = req.params.id;
      if (server.mockInteractions.has(id)) {
        res.status(200);
        server.mockInteractions.delete(id)
        res.send();
      } else {
        res.status(404);
        res.send({ error: `Mock interaction not found - ${id}` });
      }
    } catch (error) {
      console.error(`Error deleting mock interaction - ${error}`);
      res.status(500);
      res.send({ error: `Internal System Error` });
    }
  });
  app.delete('/api/pactum/mockInteraction', (req, response) => {
    const res = new ExpressResponse(response);
    try {
      server.mockInteractions.clear();
      res.status(200);
      res.send();
    } catch (error) {
      console.error(`Error deleting mock interactions - ${error}`);
      res.status(500);
      res.send({ error: `Internal System Error` });
    }
  });
  app.post('/api/pactum/pactInteraction', (req, response) => {
    const res = new ExpressResponse(response);
    try {
      const interaction = new Interaction(req.body);
      server.pactInteractions.set(interaction.id, interaction);
      store.addInteraction(interaction);
      res.status(200);
      res.send({ id: interaction.id });
    } catch (error) {
      console.log(`Error saving pact interaction - ${error}`);
      res.status(400);
      res.send({ error: error.message });
    }
  });
  app.get('/api/pactum/pactInteraction/:id', (req, response) => {
    const res = new ExpressResponse(response);
    try {
      const id = req.params.id;
      if (server.pactInteractions.has(id)) {
        res.status(200);
        res.send(server.pactInteractions.get(id).rawInteraction);
      } else {
        res.status(404);
        res.send({ error: `Pact interaction not found - ${id}` });
      }
    } catch (error) {
      console.error(`Error fetching pact interaction - ${error}`);
      res.status(500);
      res.send({ error: `Internal System Error` });
    }
  });
  app.get('/api/pactum/pactInteraction', (req, response) => {
    const res = new ExpressResponse(response);
    try {
      const interactions = [];
      for (let [id, interaction] of server.pactInteractions) {
        interactions.push(interaction.rawInteraction);
      }
      res.status(200);
      res.send(interactions);
    } catch (error) {
      console.error(`Error fetching pact interactions - ${error}`);
      res.status(500);
      res.send({ error: `Internal System Error` });
    }
  });
  app.delete('/api/pactum/pactInteraction/:id', (req, response) => {
    const res = new ExpressResponse(response);
    try {
      const id = req.params.id;
      if (server.pactInteractions.has(id)) {
        res.status(200);
        server.pactInteractions.delete(id)
        res.send();
      } else {
        res.status(404);
        res.send({ error: `Pact interaction not found - ${id}` });
      }
    } catch (error) {
      console.error(`Error deleting mock interaction - ${error}`);
      res.status(500);
      res.send({ error: `Internal System Error` });
    }
  });
  app.delete('/api/pactum/pactInteraction', (req, response) => {
    const res = new ExpressResponse(response);
    try {
      server.pactInteractions.clear();
      res.status(200);
      res.send();
    } catch (error) {
      console.error(`Error deleting pact interactions - ${error}`);
      res.status(500);
      res.send({ error: `Internal System Error` });
    }
  });
  app.post('/api/pactum/pacts/save', (req, response) => {
    const res = new ExpressResponse(response);
    try {
      store.save();
      res.status(200);
      res.send();
    } catch (error) {
      console.log(`Error saving pacts - ${error}`);
      res.status(500);
      res.send({ error: error.message });
    }
  });
  // publish pacts
}

function bodyParser(req, res, next) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    req.body = helper.getJson(body);
    next();
  });
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
