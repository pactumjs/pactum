const phin = require('phin');
const helper = require('../helpers/helper');
const Compare = require('../helpers/compare');

class Provider {

  constructor() {
    this.pactBrokerUrl = '';
    this.pactBrokerUsername = '';
    this.pactBrokerPassword = '';
    this.tags = [];
    this.publishVerificationResult = false;
    this.stateHandlers = {};
    this.provider = '';
    this.providerBaseUrl = '';
    this.providerVersion = '';
  }

  async validate() {
    const providerPacts = await this.getLatestProviderPacts();
    for (let i = 0; i < providerPacts.length; i++) {
      const providerPact = providerPacts[i];
      const versionString = providerPact.href.match(/\/version\/.*/g);
      const consumerVersion = versionString[0].replace('/version/', '');
      const consumerPactDetails = await this.getProviderConsumerPactDetails(providerPact.name, consumerVersion);
      const interactions = consumerPactDetails.interactions;
      for (let j = 0; j < interactions.length; j++) {
        const interaction = interactions[j];
        const isValid = this.validateInteraction(interaction);
        if (this.publishVerificationResult) {
          const url = consumerPactDetails['_links']['pb:publish-verification-results']['href'];
          const path = url.match(/\/pacts\/provider.*/g)[0];
          await this.publishVerificationResults(path, isValid);
        }
      }
    }
  }

  async getLatestProviderPacts() {
    const response = await phin({
      url: `${this.pactBrokerUrl}/pacts/provider/${this.provider}/latest`,
      core: {
        auth: `${this.pactBrokerUsername}:${this.pactBrokerPassword}`
      },
      method: 'GET'
    });
    if (response.statusCode === 200) {
      const body = helper.getJson(response.body);
      return body['_links']['pb:pacts'];
    }
    return null;
  }

  async getProviderConsumerPactDetails(consumer, consumerVersion) {
    const response = await phin({
      url: `${this.pactBrokerUrl}/pacts/provider/${this.provider}/consumer/${consumer}/version/${consumerVersion}`,
      core: {
        auth: `${this.pactBrokerUsername}:${this.pactBrokerPassword}`
      },
      method: 'GET'
    });
    if (response.statusCode === 200) {
      const body = helper.getJson(response.body);
      return body;
    }
    return null;
  }

  async validateInteraction(interaction) {
    // description
    const { providerState, request, response } = interaction;
    if (this.stateHandlers && this.stateHandlers[providerState]) {
      await this.stateHandlers[interaction.providerState]();
    }
    const actualResponse = await phin({
      url: `${this.providerBaseUrl}${request.path}`,
      method: request.method
    });
    const actualBody = helper.getJson(actualResponse.body);
    const expectedBody = response.body;
    const matchingRules = response.matchingRules;
    const compare = new Compare();
    return compare.jsonMatch(actualBody, expectedBody, matchingRules);
  }

  publishVerificationResults(path, success) {
    return phin({
      url: `${this.pactBrokerUrl}${path}`,
      method: 'POST',
      data: {
        success,
        providerApplicationVersion: this.providerVersion
      }
    });
  }

}

module.exports = Provider;
