const fs = require('fs');
const config = require('../config');
const helper = require('./helper');
const log = require('./logger');
const Interaction = require('../models/interaction');
const { Contract, PactInteraction } = require('../models/contract');

const store = {

  pacts: new Map(),
  /** @type {Map<string, number>} */
  interactionExerciseCounter: new Map(),

  /**
   * increments interaction exercise count
   * @param {string} id - interaction id
   */
  updateInteractionExerciseCounter(id) {
    if (this.interactionExerciseCounter.has(id)) {
      const count = this.interactionExerciseCounter.get(id);
      const newCount = count + 1;
      this.interactionExerciseCounter.set(id, newCount);
    } else {
      this.interactionExerciseCounter.set(id, 1);
    }
  },

  /**
   * add interaction in the store
   * @param {Interaction} interaction 
   */
  addInteraction(interaction) {
    const { id, provider, state, uponReceiving, mock } = interaction;
    const consumer = interaction.consumer || config.pact.consumer;
    if (consumer && provider && state && uponReceiving && !mock) {
      const key = `${consumer}-${provider}`;
      let pact;
      if (this.pacts.has(key)) {
        pact = this.pacts.get(key);
      } else {
        pact = new Contract(consumer, provider);
        this.pacts.set(key, pact);
      }
      const pactInteraction = new PactInteraction();
      pactInteraction.id = id;
      pactInteraction.providerState = state;
      pactInteraction.description = uponReceiving;
      pactInteraction.request.method = interaction.withRequest.method;
      pactInteraction.request.path = interaction.withRequest.path;
      pactInteraction.request.query = helper.getPlainQuery(interaction.withRequest.query);
      pactInteraction.request.headers = interaction.withRequest.headers;
      pactInteraction.request.body = interaction.withRequest.body;
      pactInteraction.response.status = interaction.willRespondWith.status;
      pactInteraction.response.body = interaction.willRespondWith.body;
      helper.setMatchingRules(pactInteraction.response.matchingRules, interaction.willRespondWith.rawBody, '$.body');
      pact.interactions.push(pactInteraction);
    }
  },

  save() {
    for ([key, pact] of this.pacts.entries()) {
      const dir = `${config.pact.dir}/${pact.consumer.name}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
      }
      for (let i = 0; i < pact.interactions.length; i++) {
        const interaction = pact.interactions[i];
        const id = interaction.id;
        if (!this.interactionExerciseCounter.has(id)) {
          log.warn('Pact interaction not exercised');
          log.warn({
            request: interaction.request,
            response: {
              status: interaction.response.status,
              body: interaction.response.body
            }
          });
        }
        delete interaction.id;
      }
      fs.writeFileSync(`${dir}/${key}.json`, JSON.stringify(pact, null, 2));
    }
  }

}

module.exports = store;