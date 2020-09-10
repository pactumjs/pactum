const fs = require('fs');
const phin = require('phin');
const config = require('../config');
const helper = require('./helper');
const log = require('./logger');
const { PactumOptionsError } = require('./errors');
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
   * adds a pact interaction to the store
   * @param {Interaction} interaction
   */
  addInteraction(interaction) {
    const { id, provider, state, uponReceiving, mock } = interaction;
    const consumer = interaction.consumer || config.pact.consumer;
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
  },

  save() {
    const dir = `${config.pact.dir}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    for (const [key, pact] of this.pacts.entries()) {
      const _pact = JSON.parse(JSON.stringify(pact));
      _pact.interactions = this._getExercisedInteractions(_pact.interactions);
      if (_pact.interactions.length > 0) {
        fs.writeFileSync(`${dir}/${key}.json`, JSON.stringify(_pact, null, 2));
      } else {
        log.warn(`No interactions exercised for provider - ${_pact.provider.name}`);
      }
    }
  },

  _getExercisedInteractions(interactions) {
    const _exercisedInteractions = [];
    for (let i = 0; i < interactions.length; i++) {
      const interaction = interactions[i];
      const id = interaction.id;
      if (!this.interactionExerciseCounter.has(id)) {
        log.warn(`Pact Interaction Not Exercised | Id: ${id}`);
        const msg = {
          request: interaction.request,
          response: interaction.response
        };
        log.warn(JSON.stringify(msg, null, 2));
      } else {
        _exercisedInteractions.push(interaction);
      }
      delete interaction.id;
    }
    return _exercisedInteractions;
  },

  /**
   * publish contracts
   * @param {PublishOptions} options - publish options
   */
  async publish(options) {
    validatePublishOptions(options);
    const { consumerVersion, tags, pactBrokerUrl, pactBrokerUsername, pactBrokerPassword, pactFilesOrDirs } = options;
    const url = pactBrokerUrl || config.pact.brokerUrl;
    const user = pactBrokerUsername || config.pact.brokerUser;
    const pass = pactBrokerPassword || config.pact.brokerPass;
    const _pacts = this._getPacts(pactFilesOrDirs);
    const opts = { url, consumerVersion, user, pass, tags };
    const consumers = await this._publishPacts(_pacts, opts);
    await this._publishTags(consumers, opts);
  },

  _getPacts(pactFilesOrDirs) {
    let _pacts = [];
    if (pactFilesOrDirs) {
      const filePaths = helper.getLocalPactFiles(pactFilesOrDirs);
      for (const filePath of filePaths) {
        const rawData = fs.readFileSync(filePath);
        _pacts.push(JSON.parse(rawData));
      }
    } else {
      for (const [key, pact] of this.pacts.entries()) {
        const _pact = JSON.parse(JSON.stringify(pact));
        _pact.interactions = this._getExercisedInteractions(_pact.interactions);
        if (_pact.interactions.length > 0) {
          _pacts.push(_pact);
        } else {
          log.warn(`No interactions exercised for provider - ${_pact.provider.name}`);
        }
      }
    }
    return _pacts;
  },

  async _publishPacts(_pacts, options) {
    const consumers = new Set();
    const { url, consumerVersion, user, pass } = options;
    for (let i = 0; i < _pacts.length; i++) {
      const _pact = _pacts[i];
      const consumer = _pact.consumer.name;
      const provider = _pact.provider.name;
      consumers.add(consumer);
      await phin({
        url: `${url}/pacts/provider/${provider}/consumer/${consumer}/version/${consumerVersion}`,
        method: 'PUT',
        core: {
          auth: `${user}:${pass}`
        },
        data: _pact
      });
    }
    return consumers;
  },

  async _publishTags(consumers, options) {
    const { url, consumerVersion, user, pass, tags } = options;
    if (tags) {
      for (const consumer of consumers) {
        for (let i = 0; i < tags.length; i++) {
          const tag = tags[i];
          await phin({
            url: `${url}/pacticipants/${consumer}/versions/${consumerVersion}/tags/${tag}`,
            method: 'PUT',
            core: {
              auth: `${user}:${pass}`
            },
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
      }
    }
  }

};

function validatePublishOptions(options) {
  if (!options) {
    throw new PactumOptionsError('Invalid publish options provided');
  }
  if (!options.pactBrokerUrl && !process.env.PACT_BROKER_URL) {
    throw new PactumOptionsError('Missing pactBrokerUrl option from publish options');
  }
  if (!options.pactBrokerUsername && !process.env.PACT_BROKER_USERNAME) {
    throw new PactumOptionsError('Missing pactBrokerUsername option from publish options');
  }
  if (!options.pactBrokerPassword && !process.env.PACT_BROKER_PASSWORD) {
    throw new PactumOptionsError('Missing pactBrokerPassword option from publish options');
  }
  if (!options.consumerVersion) {
    throw new PactumOptionsError('Missing consumerVersion option from publish options');
  }
  if (typeof options.tags !== 'undefined') {
    if (!Array.isArray(options.tags)) {
      throw new PactumOptionsError('Invalid tags option in publish options. Tags should be array of strings');
    }
    for (let i = 0; i < options.tags.length; i++) {
      if (!options.tags[i]) {
        throw new PactumOptionsError('Invalid tag in publish options. Tags should be array of non empty strings');
      }
    }
  }
}

module.exports = store;