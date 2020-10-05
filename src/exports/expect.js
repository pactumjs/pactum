const ExpectModel = require('../models/expect');

class Have {

  constructor(response, request) {
    this.expect = new ExpectModel();
    this.response = response;
    this.request = request;
  }

  status(code) {
    this.expect.statusCode = code;
    this._validate();
  }

  header(key, value) {
    this.expect.headers.push({ key, value });
    this._validate();
  }

  headerContains(key, value) {
    this.expect.headerContains.push({ key, value });
    this._validate();
  }

  body(value) {
    this.expect.body = value;
    this._validate();
  }

  bodyContains(value) {
    this.expect.bodyContains.push(value);
    this._validate();
  }

  json(value) {
    this.expect.json.push(value);
    this._validate();
  }

  jsonLike(value) {
    this.expect.jsonLike.push(value);
    this._validate();
  }

  jsonAt(path, value) {
    this.expect.jsonQuery.push({ path, value });
    this._validate();
  }

  jsonLikeAt(path, value) {
    this.expect.jsonQueryLike.push({ path, value });
    this._validate();
  }

  jsonSchema(schema) {
    this.expect.jsonSchema.push(schema);
    this._validate();
  }

  jsonMatch(value) {
    this.expect.jsonMatch.push(value);
    this._validate();
  }

  responseTimeLessThan(ms) {
    this.expect.responseTime = ms;
    this._validate();
  }

  _(handler, data) {
    this.expect.customExpectHandlers.push({ handler, data });
    this._validate();
  }

  _validate() {
    this.expect.validate({}, this.response);
  }

}

class To {

  constructor(response, request) {
    this.have = new Have(response, request);
  }

}

class Expect {

  constructor(response, request) {
    this.to = new To(response, request);
    this.should = new To(response, request);
  }

}

function expect(response, request) {
  return new Expect(response, request);
}

module.exports = expect;