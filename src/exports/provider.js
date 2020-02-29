const phin = require('phin');
const fs = require('fs');
const helper = require('../helpers/helper');
const Compare = require('../helpers/compare');
const log = require('../helpers/logger');
const { PactumConfigurationError } = require('../helpers/errors');

/**
 * provider options
 * @typedef {object} ProviderOptions
 * @property {string} providerBaseUrl - running API provider host endpoint.
 * @property {string} provider - name of the provider.
 * @property {string} [providerVersion] - provider version, required to publish verification results to a broker
 * @property {any} [stateHandlers] - provider state handlers. A map of 'string -> () => Promise', where each string is the state to setup, and the function is used to configure the state in the Provider.
 * @property {any} [customProviderHeaders] - Header(s) to add to any requests to the provider service. eg { 'Authorization': 'Basic cGFjdDpwYWN0'}.
 * @property {string[]} [pactFilesOrDirs] - array of local pact files or directories
 * @property {string} [pactBrokerUrl] - URL of the Pact Broker to retrieve pacts from. Required if not using pactUrls.
 * @property {string} [pactBrokerUsername] - username for Pact Broker basic authentication.
 * @property {string} [pactBrokerPassword] - password for Pact Broker basic authentication.
 * @property {string} [pactBrokerToken] - bearer token for Pact Broker authentication.
 * @property {boolean} [publishVerificationResult] - publish verification result to Broker
 * @property {string[]} [tags] - array of tags, used to filter pacts from the Broker.
 */

class Provider {

  /**
   * constructor
   * @param {ProviderOptions} options - provider options
   */
  constructor(options) {
    if (!helper.isValidObject(options)) {
      throw new PactumConfigurationError(`Invalid provider options provided - ${options}`);
    }
    this.pactBrokerUrl = options.pactBrokerUrl;
    this.pactBrokerUsername = options.pactBrokerUsername;
    this.pactBrokerPassword = options.pactBrokerPassword;
    this.pactBrokerToken = options.pactBrokerToken;
    this.pactFilesOrDirs = options.pactFilesOrDirs;
    // @property {string[]} [pactUrls] - array of HTTP-based URLs (e.g. from a broker). Required if not using a Broker.
    this.tags = options.tags || [];
    this.publishVerificationResult = options.publishVerificationResult;
    this.stateHandlers = options.stateHandlers || {};
    this.provider = options.provider;
    this.providerBaseUrl = options.providerBaseUrl;
    this.providerVersion = options.providerVersion;
    this.customProviderHeaders = options.customProviderHeaders;

    this.validateOptions();

    this.testCount = 0;
    this.testPassedCount = 0;
    this.testFailedCount = 0;
    this.testSkipped = 0;
  }

  validateOptions() {
    if (!helper.isValidString(this.providerBaseUrl)) {
      throw new PactumConfigurationError(`Invalid provider base url provided - ${this.providerBaseUrl}`);
    }
    if (!helper.isValidString(this.provider)) {
      throw new PactumConfigurationError(`Invalid provider name provided - ${this.provider}`);
    }
    if (!this.pactBrokerUrl && !this.pactFilesOrDirs) {
      throw new PactumConfigurationError(`Invalid pact-broker url - ${this.pactBrokerUrl} / pact local files - ${this.pactFilesOrDirs} provided`);
    }
    if (this.customProviderHeaders) {
      if (!helper.isValidObject(this.customProviderHeaders)) {
        throw new PactumConfigurationError(`Invalid custom headers provided - ${this.customProviderHeaders}`);
      }
    }
    if (this.stateHandlers) {
      if (!helper.isValidObject(this.stateHandlers)) {
        throw new PactumConfigurationError(`Invalid state handlers provided - ${this.stateHandlers}`);
      }
      for (const prop in this.stateHandlers) {
        if (typeof this.stateHandlers[prop] !== 'function') {
          throw new PactumConfigurationError(`Invalid state handlers function provided for - ${prop}`);
        }
      }
    }
    if (this.pactBrokerUrl) {
      if (!helper.isValidString(this.provider)) {
        throw new PactumConfigurationError(`Invalid provider name provided - ${this.provider}`);
      }
    }
    if (this.publishVerificationResult) {
      if (!this.pactBrokerUrl) {
        throw new PactumConfigurationError(`Invalid pact broker url provided - ${this.pactBrokerUrl}`);
      }
      if (!this.providerVersion) {
        throw new PactumConfigurationError(`Invalid provider version provided - ${this.providerVersion}`);
      }
    }
  }

  async validate() {
    log.info(`Provider Verification: `);
    await this.validatePactsFromPactBroker();
    await this.validatePactsFromLocal();
    this.printSummary();
  }

  async validatePactsFromPactBroker() {
    if (this.pactBrokerUrl) {
      const providerPacts = await this._getLatestProviderPacts();
      for (let i = 0; i < providerPacts.length; i++) {
        const providerPact = providerPacts[i];
        const versionString = providerPact.href.match(/\/version\/.*/g);
        const consumerVersion = versionString[0].replace('/version/', '');
        const consumerPactDetails = await this._getProviderConsumerPactDetails(providerPact.name, consumerVersion);
        log.info();
        log.info(`  Consumer: ${providerPact.name} - ${consumerVersion}`);
        const interactions = consumerPactDetails.interactions;
        const success = await this.validateInteractions(interactions);
        if (this.publishVerificationResult) {
          const url = consumerPactDetails['_links']['pb:publish-verification-results']['href'];
          const path = url.match(/\/pacts\/provider.*/g)[0];
          await this._publishVerificationResults(path, success);
        }
      }
    }
  }

  async validatePactsFromLocal() {
    if (this.pactFilesOrDirs) {
      const filePaths = helper.getLocalPactFiles(this.pactFilesOrDirs);
      for (const filePath of filePaths) {
        const rawData = fs.readFileSync(filePath);
        const pactFile = JSON.parse(rawData);
        const consumer = pactFile.consumer.name;
        const provider = pactFile.provider.name;
        if (this.provider === provider) {
          log.info();
          log.info(`  Consumer: ${consumer}`);
          const interactions = pactFile.interactions;
          await this.validateInteractions(interactions);
        } else {
          log.warn(`Invalid provider ${provider} in ${filePath}`);
        }
      }
    }
  }

  async validateInteractions(interactions) {
    let success = true;
    for (let j = 0; j < interactions.length; j++) {
      this.testCount = this.testCount + 1;
      const interaction = interactions[j];
      const isValid = await this._validateInteraction(interaction);
      if (isValid.equal) {
        this.testPassedCount = this.testPassedCount + 1;
        log.info(`     ${'√'.green} ${interaction.description.gray}`);
      } else {
        success = false;
        this.testFailedCount = this.testFailedCount + 1;
        log.info(`     ${'X'.red} ${interaction.description.gray}`);
        log.error(`       ${isValid.message.red}`);
      }
    }
    return success;
  }

  async _getLatestProviderPacts() {
    const requestOptions = this._getPactBrokerRequestOptions();
    requestOptions.url = `${this.pactBrokerUrl}/pacts/provider/${this.provider}/latest`;
    requestOptions.method = 'GET';
    log.debug('Fetching latest provider pacts', requestOptions);
    const response = await phin(requestOptions);
    if (response.statusCode === 200) {
      const body = helper.getJson(response.body);
      return body['_links']['pb:pacts'];
    } else {
      log.error(`Failed to fetch latest provider pacts. | Response: ${response.statusCode} - ${response.statusMessage}`);
      return null;
    }
  }

  async _getProviderConsumerPactDetails(consumer, consumerVersion) {
    const requestOptions = this._getPactBrokerRequestOptions();
    requestOptions.url = `${this.pactBrokerUrl}/pacts/provider/${this.provider}/consumer/${consumer}/version/${consumerVersion}`;
    requestOptions.method = 'GET';
    log.debug('Fetching provider-consumer pacts', requestOptions);
    const response = await phin(requestOptions);
    if (response.statusCode === 200) {
      const body = helper.getJson(response.body);
      return body;
    } else {
      log.error(`Failed to fetch consumer pact details. | Response: ${response.statusCode} - ${response.statusMessage}`);
      return null;
    }
  }

  async _validateInteraction(interaction) {
    log.info();
    const { providerState, request, response } = interaction;
    log.info(`   - Provider State: ${providerState}`);
    if (this.stateHandlers && this.stateHandlers[providerState]) {
      await this.stateHandlers[interaction.providerState]();
    }
    const actualResponse = await phin(this._getInteractionRequestOptions(request));
    return this._validateResponse(actualResponse, response);
  }

  async _publishVerificationResults(path, success) {
    const requestOptions = this._getPactBrokerRequestOptions();
    requestOptions.url = `${this.pactBrokerUrl}${path}`;
    requestOptions.method = 'POST';
    requestOptions.data = {
      success,
      providerApplicationVersion: this.providerVersion
    };
    log.debug('Publishing verification results.', requestOptions);
    const response = await phin(requestOptions);
    if (response.statusCode !== 200) {
      log.error(`Failed to publish verification results. | Response: ${response.statusCode} - ${response.statusMessage}`);
    }
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
    return {
      equal: true
    };
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

  _getInteractionRequestOptions(request) {
    const options = {
      url: request.query ? `${this.providerBaseUrl}${request.path}?${request.query}` : `${this.providerBaseUrl}${request.path}`,
      method: request.method,
      headers: request.headers,
      data: request.body
    };
    if (this.customProviderHeaders) {
      if (!options.headers) {
        options.headers = {};
      }
      for (const prop in this.customProviderHeaders) {
        options.headers[prop] = this.customProviderHeaders[prop];
      }
    }
    return options;
  }

  _getPactBrokerRequestOptions() {
    const requestOptions = {};
    if (this.pactBrokerUsername) {
      requestOptions.core = {
        auth: `${this.pactBrokerUsername}:${this.pactBrokerPassword}`
      };
    }
    if (this.pactBrokerToken) {
      requestOptions.headers = {
        'authorization': `Basic ${this.pactBrokerToken}`
      };
    }
    return requestOptions;
  }

  printSummary() {
    log.info();
    log.info(` ${this.testPassedCount} passing`.green);
    if (this.testFailedCount > 0) {
      log.info(` ${this.testFailedCount} failing`.red);
      throw 'Provider Verification Failed';
    }
  }

}

const provider = {

  /**
   * validate provider
   * @param {ProviderOptions} options - provider options
   */
  validate(options) {
    const providerObj = new Provider(options);
    return providerObj.validate();
  }

};

module.exports = provider;