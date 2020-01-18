const fs = require('fs');
const helper = require('./helper');
const Interaction = require('../models/interaction');
const { Pact, PactInteraction } = require('../models/pact');

const store = {

  pacts: new Map(),

  /**
   * add interaction in the store
   * @param {Interaction} interaction 
   */
  addInteraction(interaction) {
    const { consumer, provider, state, uponReceiving } = interaction;
    if (consumer && provider && state && uponReceiving) {
      const key = `${consumer}-${provider}`;
      let pact;
      if (this.pacts.has(key)) {
        pact = this.pacts.get(key);
      } else {
        pact = new Pact(consumer, provider);
        this.pacts.set(key, pact);
      }
      const pactInteraction = new PactInteraction();
      pactInteraction.providerState = state;
      pactInteraction.description = uponReceiving;
      pactInteraction.request.method = interaction.withRequest.method;
      pactInteraction.request.path = interaction.withRequest.path;
      pactInteraction.request.query = getPlainQuery(interaction.withRequest.query);
      pactInteraction.response.status = interaction.willRespondWith.status;
      pactInteraction.response.body = interaction.willRespondWith.body;
      helper.setMatchingRules(pactInteraction.response.matchingRules, interaction.willRespondWith.rawBody, '$.body');
      pact.interactions.push(pactInteraction);
    }
  },

  save() {
    for ([key, interaction] of this.pacts.entries()) {
      fs.writeFileSync(`${key}.json`, JSON.stringify(interaction, null, 2));
    }
  }

}

function getPlainQuery(query) {
  let plainQuery = '';
  for (const prop in query) {
    if (plainQuery !== '') {
      plainQuery = plainQuery + '&';
    }
    plainQuery = plainQuery + `${prop}=${query[prop]}`;
  }
  return plainQuery;
}

module.exports = store;