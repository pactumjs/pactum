const ExpectModel = require('../models/expect');
const utils = require('../helpers/utils');

class Have {

  constructor(response, spec) {
    this.expect = new ExpectModel();
    this.response = response;
    this.spec = spec;
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

  jsonSchemaAt(path, value) {
    this.expect.jsonSchemaQuery.push({ path, value });
    this._validate();
  }

  jsonMatch(value) {
    this.expect.jsonMatch.push(value);
    this._validate();
  }

  jsonMatchAt(path, value) {
    this.expect.jsonMatchQuery.push({ path, value });
    this._validate();
  }

  jsonMatchStrict(value) {
    this.expect.jsonMatchStrict.push(value);
    this._validate();
  }

  jsonMatchStrictAt(path, value) {
    this.expect.jsonMatchStrictQuery.push({ path, value });
    this._validate();
  }

  responseTimeLessThan(ms) {
    this.expect.responseTime = ms;
    this._validate();
  }

  error(err) {
    this.expect.errors.push(err);
    this._validate();
  }

  _(handler, data) {
    this.expect.customExpectHandlers.push({ handler, data });
    return this._validate();
  }

  _validate() {
    try {
      return this.expect.validate({}, this.response);
    } catch (error) {
      if (this.spec && this.spec.status !== 'FAILED') {
        this.spec.status = 'FAILED';
        utils.printReqAndRes(this.spec._request, this.response);
      }
      throw error;
    }
  }

}

class To {

  constructor(response, spec) {
    this.have = new Have(response, spec);
  }

}

class Expect {

  constructor(response, spec) {
    this.to = new To(response, spec);
    this.should = new To(response, spec);
  }

}

function expect(response, spec) {
  return new Expect(response, spec);
}

module.exports = expect;