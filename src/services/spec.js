const rp = require('request-promise');
const Expect = require('./expect');
const helper = require('../helpers/helper');

class Spec {

  constructor() {
    this.server = null;
    this.interactions = [];
    this._request = {};
    this._response = {};
    this._expect = new Expect();
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
    for (let i = 0; i < this.interactions.length; i++) {
      this.server.addInteraction(3000, this.interactions[i]);
    }
    try {
      this._response = await this.fetch();
    } catch (error) {
      this._response = error;
    }
    this._response.json = helper.getJson(this._response.body);
    this._expect.validate(this._response);
  }

}

module.exports = Spec;
