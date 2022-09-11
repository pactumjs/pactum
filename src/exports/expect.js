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

  cookiesLike(key, value) {
    this.expect.cookies.push(utils.createCookieObject(key, value));
    this._validate();
  }

  cookies(key, value) {
    this.expect.cookiesLike.push(utils.createCookieObject(key, value));
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

  json(path, value) {
    typeof value === 'undefined' ? this.expect.json.push(path) : this.expect.jsonQuery.push({ path, value });
    this._validate();
  }

  jsonLike(path, value) {
    typeof value === 'undefined' ? this.expect.jsonLike.push(path) : this.expect.jsonQueryLike.push({ path, value });
    this._validate();
  }

  jsonSchema(path, value, options) {
    if (typeof options === 'object') {
      this.expect.jsonSchemaQuery.push({ path, value, options });
    } else {
      if (typeof value === 'undefined') {
        this.expect.jsonSchema.push({ value: path });
      } else {
        if (typeof path === 'object' && typeof value === 'object') {
          this.expect.jsonSchema.push({ value: path, options: value });
        } else {
          this.expect.jsonSchemaQuery.push({ path, value });
        }
      }
    }
    this._validate();
  }

  jsonMatch(path, value) {
    typeof value === 'undefined' ? this.expect.jsonMatch.push(path) : this.expect.jsonMatchQuery.push({ path, value });
    this._validate();
  }

  jsonMatchStrict(path, value) {
    typeof value === 'undefined' ? this.expect.jsonMatchStrict.push(path) : this.expect.jsonMatchStrictQuery.push({ path, value });
    this._validate();
  }

  jsonLength(path, value) {
    typeof value === 'undefined' ? this.expect.jsonLike.push(path) : this.expect.jsonLengthQuery.push({ path, value });
    this._validate();
  }

  jsonSnapshot(name, value) {
    typeof name === 'string' ? this.expect.jsonSnapshots.push({ name, value }): this.expect.jsonSnapshots.push({ value: name });
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