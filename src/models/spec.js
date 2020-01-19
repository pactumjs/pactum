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

  get(url) {
    this._request.url = url;
    this._request.method = 'GET';
    return this;
  }

  head(url) {
    this._request.url = url;
    this._request.method = 'HEAD';
    return this;
  }

  options(url) {
    this._request.url = url;
    this._request.method = 'OPTIONS';
    return this;
  }

  patch(url) {
    this._request.url = url;
    this._request.method = 'PATCH';
    return this;
  }

  post(url) {
    this._request.url = url;
    this._request.method = 'POST';
    return this;
  }

  put(url) {
    this._request.url = url;
    this._request.method = 'PUT';
    return this;
  }

  delete(url) {
    this._request.url = url;
    this._request.method = 'DELETE';
    return this;
  }

  withQuery(key, value) {
    if (this._request.qs === undefined) {
      this._request.qs = {};
    }
    this._request.qs[key] = value;
    return this;
  }

  withJson(json) {
    this._request.json = json;
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
      store.addInteraction(interaction);
      this.server.removeInteraction(interaction.port, id);
    }
    this._response.json = helper.getJson(this._response.body);
    this._expect.validateInteractions(this.interactions);
    this._expect.validate(this._response);
  }

}

module.exports = Spec;
