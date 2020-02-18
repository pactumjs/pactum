const phin = require('phin');
const helper = require('../helpers/helper');
const Compare = require('../helpers/compare');
const log = require('../helpers/logger');

class Provider {

  constructor(options) {
    this.pactBrokerUrl = options.pactBrokerUrl;
    this.pactBrokerUsername = options.pactBrokerUsername;
    this.pactBrokerPassword = options.pactBrokerPassword;
    this.tags = options.tag || [];
    this.publishVerificationResult = options.publishVerificationResult;
    this.stateHandlers = options.stateHandlers || {};
    this.provider = options.provider;
    this.providerBaseUrl = options.providerBaseUrl;
    this.providerVersion =  options.providerVersion;
  }

  async validate() {
    log.info(`Provider Verification: `);
    const providerPacts = await this._getLatestProviderPacts();
    for (let i = 0; i < providerPacts.length; i++) {
      const providerPact = providerPacts[i];
      const versionString = providerPact.href.match(/\/version\/.*/g);
      const consumerVersion = versionString[0].replace('/version/', '');
      const consumerPactDetails = await this._getProviderConsumerPactDetails(providerPact.name, consumerVersion);
      log.info();
      log.info(`  Consumer: ${providerPact.name} - ${consumerVersion}`);
      const interactions = consumerPactDetails.interactions;
      for (let j = 0; j < interactions.length; j++) {
        const interaction = interactions[j];
        const isValid = await this._validateInteraction(interaction);
        log.info(`     ${isValid.equal ? '√'.green : 'X'.red } Description: ${interaction.description}`);
        if (isValid.message) {
          log.warn(`       ${isValid.message}`);
        }
        if (this.publishVerificationResult) {
          const url = consumerPactDetails['_links']['pb:publish-verification-results']['href'];
          const path = url.match(/\/pacts\/provider.*/g)[0];
          await this._publishVerificationResults(path, isValid.equal);
        }
      }
    }
  }

  async _getLatestProviderPacts() {
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

  async _getProviderConsumerPactDetails(consumer, consumerVersion) {
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

  async _validateInteraction(interaction) {
    log.info();
    const { providerState, request, response } = interaction;
    log.info(`   - Provider State: ${providerState}`);
    if (this.stateHandlers && this.stateHandlers[providerState]) {
      await this.stateHandlers[interaction.providerState]();
    }
    const actualResponse = await phin({
      url: `${this.providerBaseUrl}${request.path}`,
      method: request.method
    });
    const actualBody = helper.getJson(actualResponse.body);
    const expectedBody = response.body;
    let matchingRules = response.matchingRules;
    if (!matchingRules) {
      matchingRules = {};
    }
    const compare = new Compare();
    return compare.jsonMatch(actualBody, expectedBody, matchingRules, '$.body');
  }

  _publishVerificationResults(path, success) {
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