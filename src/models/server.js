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
        app.all('/*', (req, res) => {
          const mock = this.mockMap.get(req.app.port);
          const { interactions, defaultMockInteractions } = mock;
          let interactionExercised = false;
          let interaction = helper.getValidInteraction(req, interactions);
          if (!interaction) {
            interaction = helper.getValidInteraction(req, defaultMockInteractions);
          }
          if (interaction) {
            interaction.exercised = true;
            interactionExercised = true;
            res.set(interaction.willRespondWith.headers);
            res.status(interaction.willRespondWith.status);
            res.send(interaction.willRespondWith.body);
          }
          if (!interactionExercised) {
            res.status(404);
            res.send('Interaction Not Found');
          }
        });
        const server = app.listen(port, () => {
          console.log('PACTUM mock server is listening on port', port);
          app.port = port;
          this.mockMap.set(port, {
            app,
            server,
            running: true,
            interactions: new Map(),
            defaultMockInteractions: new Map()
          });
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
      mock.defaultMockInteractions.set(id, interaction);
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
      mock.defaultMockInteractions.delete(id);
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
      mock.defaultMockInteractions.clear();
    }
  }

  removeAllInteractions() {
    for (const [port, mock] of this.mockMap.entries()) {
      console.log(`Removing all interactions for ${port}`);
      mock.interactions.clear();
      mock.defaultMockInteractions.clear();
    }
  }

}

module.exports = Server;
