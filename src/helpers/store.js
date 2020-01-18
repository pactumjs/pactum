const helper = require('./helper');
const Interaction = require('../models/interaction');
const { Pact, PactInteraction } = require('../models/pact');

const store = {

  pacts: new Map(),

  /**
   * saves interaction in the store
   * @param {Interaction} interaction 
   */
  saveInteraction(interaction) {
    const { consumer, provider } = interaction;
    const key = `${consumer}-${provider}`;
    let pact;
    if (this.pacts.has(key)) {
      pact = this.pacts.get(key);
    } else {
      pact = new Pact(consumer, provider);
      this.pacts.set(key, pact);
    }
    const pactInteraction = new PactInteraction();
    pactInteraction.request.method = interaction.withRequest.method;
    pactInteraction.request.path = interaction.withRequest.path;
    pactInteraction.request.query = getPlainQuery(interaction.withRequest.query);
    pactInteraction.response.status = interaction.willRespondWith.status;
    pactInteraction.response.body = interaction.willRespondWith.body;
    pactInteraction.response.matchingRules = helper.setMatchingRules({}, interaction.willRespondWith.rawBody, '$.body');
    pact.interactions.push(pactInteraction);
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