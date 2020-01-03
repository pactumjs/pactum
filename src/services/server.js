const express = require('express');

class Server {

  constructor() {
    this.mockMap = new Map();
  }

  start(port = 3000) {
    return new Promise((resolve) => {
      if (this.mockMap.has(port)) {
        console.log('App is already running');
        resolve();
      } else {
        const app = express();
        app.all('/*', (req, res) => {
          const mock = this.mockMap.get(req.app.port);
          const interactions = mock.interactions;
          let interactionExercised = false;
          for (let i = 0; i < interactions.length; i++) {
            const interaction = interactions[i];
            const isValidMethod = (interaction.withRequest.method === req.method);
            const isValidPath = (interaction.withRequest.path === req.path);
            if (isValidMethod && isValidPath) {
              interactionExercised = true;
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
            interactions: []
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
            app.running = false;
            resolve();
          });
        } else {
          console.log(`App is already stopped on port ${port}`);
          resolve();
        }
      } else {
        console.log(`No App is running on port ${port}`);
        resolve();
      }
    });
  }

  addInteraction(port = 3000, interaction) {
    if (this.mockMap.has(port)) {
      const mock = this.mockMap.get(port);
      mock.interactions.push(interaction);
    }
  }

  removeInteractions(port = 3000) {
    if (this.mockMap.has(port)) {
      const mock = this.mockMap.get(port);
      mock.interactions.length = 0;
    }
  }

  removeAllInteractions() {
    for (const [port, mock] of this.mockMap.entries()) {
      console.log(`Removing interactions for ${port}`);
      mock.interactions.length = 0;
    }
  }

}

module.exports = Server;
