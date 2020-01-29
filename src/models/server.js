const express = require('express');

const Interaction = require('./interaction');

const helper = require('../helpers/helper');
const store = require('../helpers/store');
const config = require('../config');

class Server {

  constructor() {
    this.mockMap = new Map();
    this.remoteMockInteractions = new Map();
    this.remotePactInteractions = new Map();
  }

  start(port = config.mock.port) {
    return new Promise((resolve) => {
      if (this.mockMap.has(port) && this.mockMap.get(port).running) {
        console.log('PACTUM mock server is already running');
        resolve();
      } else {
        const app = express();
        app.use(express.json());
        registerPactumRoutes(this, app);
        registerAllRoutes(this, app);
        const server = app.listen(port, () => {
          console.log('PACTUM mock server is listening on port', port);
          app.port = port;
          if (this.mockMap.has(port)) {
            const mockApp = this.mockMap.get(port);
            mockApp.app = app;
            mockApp.server = server;
            mockApp.running = true;
          } else {
            this.mockMap.set(port, {
              app,
              server,
              running: true,
              interactions: new Map(),
              defaultInteractions: new Map()
            });
          }
          resolve();
        });
      }
    });
  }

  stop(port = config.mock.port) {
    return new Promise((resolve) => {
      const app = this.mockMap.get(port);
      if (app) {
        if (app.running) {
          app.server.close(() => {
            console.log('PACTUM mock server stopped on port', port);
            app.running = false;
            resolve();
          });
        } else {
          console.log('PACTUM mock server is already stopped on port', port);
          resolve();
        }
      } else {
        console.log('No PACTUM mock server is running on port', port);
        resolve();
      }
    });
  }

  addInteraction(id, interaction) {
    const port = interaction.port;
    if (this.mockMap.has(port)) {
      const mock = this.mockMap.get(port);
      mock.interactions.set(id, interaction);
    }
  }

  addDefaultInteraction(id, interaction) {
    const port = interaction.port;
    if (this.mockMap.has(port)) {
      const mock = this.mockMap.get(port);
      mock.defaultInteractions.set(id, interaction);
    } else {
      const interactions = new Map();
      const defaultInteractions = new Map();
      defaultInteractions.set(id, interaction);
      this.mockMap.set(port, { interactions, defaultInteractions });
    }
  }

  removeInteraction(port = config.mock.port, id) {
    if (this.mockMap.has(port)) {
      const mock = this.mockMap.get(port);
      mock.interactions.delete(id);
    }
  }

  removeDefaultInteraction(id, port = config.mock.port) {
    if (this.mockMap.has(port)) {
      const mock = this.mockMap.get(port);
      mock.defaultInteractions.delete(id);
    }
  }

  removeInteractions(port = config.mock.port) {
    if (this.mockMap.has(port)) {
      const mock = this.mockMap.get(port);
      mock.interactions.clear();
    }
  }

  removeDefaultInteractions(port = config.mock.port) {
    if (this.mockMap.has(port)) {
      const mock = this.mockMap.get(port);
      mock.defaultInteractions.clear();
    }
  }

  removeAllInteractions() {
    for (const [port, mock] of this.mockMap.entries()) {
      console.log(`Removing all interactions for ${port}`);
      mock.interactions.clear();
      mock.defaultInteractions.clear();
    }
  }

}

/**
 * registers all routes for interactions
 * @param {Server} server - server object
 * @param {Express} app - express app object
 */
function registerAllRoutes(server, app) {
  app.all('/*', (req, res) => {
    const mock = server.mockMap.get(req.app.port);
    const { interactions, defaultInteractions } = mock;
    let interactionExercised = false;
    let interaction = helper.getValidInteraction(req, interactions);
    if (!interaction) {
      interaction = helper.getValidInteraction(req, defaultInteractions);
    }
    if (!interaction) {
      interaction = helper.getValidInteraction(req, server.remotePactInteractions);
    }
    if (!interaction) {
      interaction = helper.getValidInteraction(req, server.remoteMockInteractions);
    }
    if (interaction) {
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
  app.post('/api/pactum/mockInteraction', (req, res) => {
    try {
      const interaction = new Interaction(req.body, true);
      server.remoteMockInteractions.set(interaction.id, interaction);
      res.status(200);
      res.send({ id: interaction.id });
    } catch (error) {
      console.log(`Error saving mock interaction - ${error}`);
      res.status(400);
      res.send({ error: error.message });
    }
  });
  app.get('/api/pactum/mockInteraction/:id', (req, res) => {
    try {
      const id = req.params.id;
      if (server.remoteMockInteractions.has(id)) {
        res.status(200);
        res.send(server.remoteMockInteractions.get(id).rawInteraction);
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
  app.get('/api/pactum/mockInteraction', (req, res) => {
    try {
      const interactions = [];
      for (let [id, interaction] of server.remoteMockInteractions) {
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
  app.delete('/api/pactum/mockInteraction/:id', (req, res) => {
    try {
      const id = req.params.id;
      if (server.remoteMockInteractions.has(id)) {
        res.status(200);
        server.remoteMockInteractions.delete(id)
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
  app.delete('/api/pactum/mockInteraction', (req, res) => {
    try {
      server.remoteMockInteractions.clear();
      res.status(200);
      res.send();
    } catch (error) {
      console.error(`Error deleting mock interactions - ${error}`);
      res.status(500);
      res.send({ error: `Internal System Error` });
    }
  });
  app.post('/api/pactum/pactInteraction', (req, res) => {
    try {
      const interaction = new Interaction(req.body);
      server.remotePactInteractions.set(interaction.id, interaction);
      store.addInteraction(interaction);
      res.status(200);
      res.send({ id: interaction.id });
    } catch (error) {
      console.log(`Error saving pact interaction - ${error}`);
      res.status(400);
      res.send({ error: error.message });
    }
  });
  app.get('/api/pactum/pactInteraction/:id', (req, res) => {
    try {
      const id = req.params.id;
      if (server.remotePactInteractions.has(id)) {
        res.status(200);
        res.send(server.remotePactInteractions.get(id).rawInteraction);
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
  app.get('/api/pactum/pactInteraction', (req, res) => {
    try {
      const interactions = [];
      for (let [id, interaction] of server.remotePactInteractions) {
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
  app.delete('/api/pactum/pactInteraction/:id', (req, res) => {
    try {
      const id = req.params.id;
      if (server.remotePactInteractions.has(id)) {
        res.status(200);
        server.remotePactInteractions.delete(id)
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
  app.delete('/api/pactum/pactInteraction', (req, res) => {
    try {
      server.remotePactInteractions.clear();
      res.status(200);
      res.send();
    } catch (error) {
      console.error(`Error deleting pact interactions - ${error}`);
      res.status(500);
      res.send({ error: `Internal System Error` });
    }
  });
  app.post('/api/pactum/pacts/save', (req, res) => {
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

module.exports = Server;
