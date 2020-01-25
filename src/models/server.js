const express = require('express');

const helper = require('../helpers/helper');
const config = require('../config');

class Server {

  constructor() {
    this.mockMap = new Map();
  }

  start(port = config.mock.port) {
    return new Promise((resolve) => {
      if (this.mockMap.has(port) && this.mockMap.get(port).running) {
        console.log('PACTUM mock server is already running');
        resolve();
      } else {
        const app = express();
        app.use(express.json());
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

  addDefaultMockInteraction(id, interaction) {
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

  removeDefaultMockInteraction(id, port = config.mock.port) {
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

  removeDefaultMockInteractions(port = config.mock.port) {
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
    if (interaction) {
      interaction.exercised = true;
      interactionExercised = true;
      res.set(interaction.willRespondWith.headers);
      res.status(interaction.willRespondWith.status);
      res.send(interaction.willRespondWith.body);
    }
    if (!interactionExercised) {
      console.log();
      console.log('PACTUM', 'Interaction not found for');
      console.log('PACTUM', req.method, req.path);
      console.log('PACTUM', 'Query', req.query);
      console.log('PACTUM', 'Body', req.body);
      res.status(404);
      res.send('Interaction Not Found');
    }
  });
}

module.exports = Server;
