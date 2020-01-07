const rp = require('request-promise');
const Expect = require('./expect');
const Interaction = require('./interaction');
const helper = require('../helpers/helper');
const store = require('../helpers/store');

class Spec {

  constructor(server) {
    this.id = helper.getRandomId();
    this.server = server;
    this.interactions = new Map();
    this._request = {};
    this._response = {};
    this._expect = new Expect();
  }

  addInteraction(rawInteraction) {
    const interaction = new Interaction(rawInteraction);
    this.interactions.set(interaction.id, interaction);
    return this;
  }

  fetch() {
    this._request.resolveWithFullResponse = true;
    switch (this._request.method) {
      case 'GET':
        return rp.get(this._request);
      case 'POST':
        return rp.post(this._request);
      default:
        return rp.get(this._request);
    }
  }

  get(options) {
    if (typeof options === 'string') {
      this._request.uri = options;
    } else {
      this._request = options;
    }
    this._request.method = 'GET';
    return this;
  }

  post(options) {
    if (typeof options === 'string') {
      this._request.uri = options;
    } else {
      this._request = options;
    }
    this._request.method = 'POST';
    return this;
  }

  withQuery(key, value) {
    if (this._request.qs === undefined) {
      this._request.qs = {};
    }
    this._request.qs[key] = value;
    return this;
  }

  expectStatus(statusCode) {
    this._expect.statusCode = statusCode;
    return this;
  }

  expectHeader(header, value) {
    this._expect.headers.push({
      key: header,
      value
    });
    return this;
  }

  expectHeaderContains(header, value) {
    this._expect.headerContains.push({
      key: header,
      value
    });
    return this;
  }

  expectBody(body) {
    this._expect.body = body;
    return this;
  }

  expectBodyContains(value) {
    this._expect.bodyContains.push(value);
    return this;
  }

  expectJson(json) {
    this._expect.json.push(json);
    return this;
  }

  expectJsonLike(json) {
    this._expect.jsonLike.push(json);
    return this;
  }

  expectJsonQuery(path, value) {
    this._expect.jsonQuery.push({path, value});
    return this;
  }

  async toss() {
    for (let [id, interaction] of this.interactions) {
      this.server.addInteraction(id, interaction);
    }
    try {
      this._response = await this.fetch();
    } catch (error) {
      this._response = error;
    }
    for (let [id, interaction] of this.interactions) {
      store.saveInteraction(interaction);
      this.server.removeInteraction(interaction.port, id);
    }
    this._response.json = helper.getJson(this._response.body);
    this._expect.validateInteractions(this.interactions);
    this._expect.validate(this._response);
  }

}

module.exports = Spec;
