const ExpectModel = require('../models/expect');

class Have {

  constructor(response) {
    this.expect = new ExpectModel();
    this.response = response;
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

  jsonQuery(path, value) {
    this.expect.jsonQuery.push({ path, value });
    this._validate();
  }

  jsonQueryLike(path, value) {
    this.expect.jsonQueryLike.push({ path, value });
    this._validate();
  }

  jsonSchema(schema) {
    this.expect.jsonSchema.push(schema);
    this._validate();
  }

  responseTimeLessThan(ms) {
    this.expect.responseTime = ms;
    this._validate();
  }

  _validate() {
    this.expect.validate({}, this.response);
  }

}

class To {

  constructor(response) {
    this.have = new Have(response);
  }

}

class Expect {

  constructor(response) {
    this.to = new To(response);
  }

}

function expect(response) {
  return new Expect(response);
}

module.exports = expect;