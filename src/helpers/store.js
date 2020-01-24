const fs = require('fs');
const config = require('../config');
const helper = require('./helper');
const Interaction = require('../models/interaction');
const { Contract, PactInteraction } = require('../models/contract');

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
        pact = new Contract(consumer, provider);
        this.pacts.set(key, pact);
      }
      const pactInteraction = new PactInteraction();
      pactInteraction.providerState = state;
      pactInteraction.description = uponReceiving;
      pactInteraction.request.method = interaction.withRequest.method;
      pactInteraction.request.path = interaction.withRequest.path;
      pactInteraction.request.query = getPlainQuery(interaction.withRequest.query);
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
      fs.writeFileSync(`${dir}/${key}.json`, JSON.stringify(pact, null, 2));
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