const express = require('express');

const helper = require('../helpers/helper');

class Server {

  constructor() {
    this.mockMap = new Map();
  }

  start(port = 3000) {
    return new Promise((resolve) => {
      if (this.mockMap.has(port) && this.mockMap.get(port).running) {
        console.log('App is already running');
        resolve();
      } else {
        const app = express();
        app.all('/*', (req, res) => {
          const mock = this.mockMap.get(req.app.port);
          const interactions = mock.interactions;
          let interactionExercised = false;
          for (let [id, interaction] of interactions) {
            const isValidMethod = (interaction.withRequest.method === req.method);
            const isValidPath = (interaction.withRequest.path === req.path);
            let isValidQuery = true;
            if (interaction.withRequest.query) {
              isValidQuery = helper.validateQuery(req.query, interaction.withRequest.query);
            }
            let isValidHeaders = true;
            if (interaction.withRequest.headers) {
              isValidHeaders = helper.validateHeaders(req.headers, interaction.withRequest.headers);
            }
            if (isValidMethod && isValidPath && isValidQuery && isValidHeaders) {
              interactionExercised = true;
              interaction.exercised = true;
              res.set(interaction.willRespondWith.headers);
              res.status(interaction.willRespondWith.status);
              res.send(interaction.willRespondWith.body);
            }
          }
          if (!interactionExercised) {
            res.status(404);
            res.send('Interaction Not Found');
          }
        });
        const server = app.listen(port, () => {
          console.log('App is listening on port', port);
          app.port = port;
          this.mockMap.set(port, {
            app,
            server,
            running: true,
            interactions: new Map()
          });
          resolve();
        });
      }
    });
  }

  stop(port = 3000) {
    return new Promise((resolve) => {
      const app = this.mockMap.get(port);
      if (app) {
        if (app.running) {
          app.server.close(() => {
            console.log('App stopped on port', port);
            app.running = false;
            resolve();
          });
        } else {
          console.log('App is already stopped on port', port);
          resolve();
        }
      } else {
        console.log('No App is running on port', port);
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

  removeInteraction(port = 3000, id) {
    if (this.mockMap.has(port)) {
      const mock = this.mockMap.get(port);
      mock.interactions.delete(id);
    }
  }

  removeInteractions(port = 3000) {
    if (this.mockMap.has(port)) {
      const mock = this.mockMap.get(port);
      mock.interactions.clear();
    }
  }

  removeAllInteractions() {
    for (const [port, mock] of this.mockMap.entries()) {
      console.log(`Removing interactions for ${port}`);
      mock.interactions.clear();
    }
  }

}

module.exports = Server;
