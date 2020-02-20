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

    this.testCount = 0;
    this.testPassed = 0;
    this.testFailed = 0;
    this.testSkipped = 0;
  }

  async validate() {
    log.info(`Provider Verification: `);
    const providerPacts = await this._getLatestProviderPacts();
    for (let i = 0; i < providerPacts.length; i++) {
      let success = true;
      const providerPact = providerPacts[i];
      const versionString = providerPact.href.match(/\/version\/.*/g);
      const consumerVersion = versionString[0].replace('/version/', '');
      const consumerPactDetails = await this._getProviderConsumerPactDetails(providerPact.name, consumerVersion);
      log.info();
      log.info(`  Consumer: ${providerPact.name} - ${consumerVersion}`);
      const interactions = consumerPactDetails.interactions;
      for (let j = 0; j < interactions.length; j++) {
        this.testCount = this.testCount + 1;
        const interaction = interactions[j];
        const isValid = await this._validateInteraction(interaction);
        if (isValid.equal) {
          this.testPassed = this.testPassed + 1;
          log.info(`     ${'√'.green} ${interaction.description.gray}`);
        } else {
          success = false;
          this.testFailed = this.testFailed + 1;
          log.info(`     ${'X'.red } ${interaction.description.gray}`);
          log.error(`       ${isValid.message.red}`);
        }
      }
      if (this.publishVerificationResult) {
        const url = consumerPactDetails['_links']['pb:publish-verification-results']['href'];
        const path = url.match(/\/pacts\/provider.*/g)[0];
        const publishResponse = await this._publishVerificationResults(path, success);
        log.info(publishResponse.statusCode);
      }
    }
    this._printSummary();
  }

  _printSummary() {
    log.info();
    log.info(` ${this.testPassed} passing`.green);
    if (this.testFailed > 0) {
      log.info(` ${this.testFailed} failing`.red);
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
    const actualResponse = await phin(this.getRequestOptions(request));
    return this._validateResponse(actualResponse, response);
  }

  _validateResponse(actual, expected) {
    const isValidStatus = this._validateStatus(actual.statusCode, expected.status);
    if (!isValidStatus.equal) {
      return isValidStatus;
    }
    const isValidHeaders = this._validateHeaders(actual, expected);
    if (!isValidHeaders.equal) {
      return isValidHeaders;
    }
    return this._validateBody(actual, expected);
  }

  _validateStatus(actualStatus, expectedStatus) {
    if (expectedStatus && actualStatus !== expectedStatus) {
      return {
        equal: false,
        message: `HTTP status ${actualStatus} !== ${expectedStatus}`
      };
    } else {
      return {
        equal: true
      };
    }
  }

  _validateHeaders(actual, expected) {
    if (expected.headers) {
      let matchingRules = expected.matchingRules;
      if (!matchingRules) {
        matchingRules = {};
      }
      const compare = new Compare();
      return compare.jsonMatch(actual.headers, expected.headers, matchingRules, '$.headers');
    }
  }

  _validateBody(actual, expected) {
    if (expected.body) {
      const actualBody = helper.getJson(actual.body);
      let matchingRules = expected.matchingRules;
      if (!matchingRules) {
        matchingRules = {};
      }
      const compare = new Compare();
      return compare.jsonMatch(actualBody, expected.body, matchingRules, '$.body');
    }
    return {
      equal: true
    };
  }

  getRequestOptions(request) {
    const options = {
      url: request.query ? `${this.providerBaseUrl}${request.path}?${request.query}` : `${this.providerBaseUrl}${request.path}`,
      method: request.method,
      headers: request.headers,
      data: request.body
    };
    return options;
  }

  _publishVerificationResults(path, success) {
    return phin({
      url: `${this.pactBrokerUrl}${path}`,
      method: 'POST',
      core: {
        auth: `${this.pactBrokerUsername}:${this.pactBrokerPassword}`
      },
      data: {
        success,
        providerApplicationVersion: this.providerVersion
      }
    });
  }

}

const provider = {

  validate(options) {
    const providerObj = new Provider(options);
    return providerObj.validate();
  }

};

module.exports = provider;