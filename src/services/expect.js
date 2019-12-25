const assert = require('assert');
const jqy = require('json-query');

const Like = require('../helpers/like');

class Expect {

  constructor() {
    this.statusCode = null;
    this.body = null;
    this.bodyContains = [];
    this.json = [];
    this.jsonLike = [];
    this.jsonQuery = [];
    this.headers = [];
    this.headerContains = [];
  }

  validate(response) {
    this.validateStatus(response);
    this.validateHeaders(response);
    this.validateHeaderContains(response);
    this.validateBody(response);
    this.validateBodyContains(response);
    this.validateJson(response);
    this.validateJsonLike(response);
    this.validateJsonQuery(response);
  }

  validateStatus(response) {
    if (this.statusCode !== null) {
      assert.strictEqual(response.statusCode, this.statusCode, `HTTP status ${response.statusCode} !== ${this.statusCode}`);
    }
  }

  validateHeaders(response) {
    for (let i = 0; i < this.headers.length; i++) {
      const expectedHeaderObject = this.headers[i];
      const expectedHeader = expectedHeaderObject.key;
      const expectedHeaderValue = expectedHeaderObject.value;
      assert.ok(response.headers[expectedHeader], `Header '${expectedHeader}' not present in HTTP response`);
      if (expectedHeaderValue !== undefined) {
        const actualHeaderValue = response.headers[expectedHeader];
        if (expectedHeaderValue instanceof RegExp) {
          assert.ok(expectedHeaderValue.test(actualHeaderValue), `Header regex (${expectedHeaderValue}) did not match for header '${expectedHeader}': '${actualHeaderValue}'`);
        } else {
          assert.ok(expectedHeaderValue.toLowerCase() === actualHeaderValue.toLowerCase(), `Header value '${expectedHeaderValue}' did not match for header '${expectedHeader}': '${actualHeaderValue}'`)
        }
      }
    }
  }

  validateHeaderContains(response) {
    for (let i = 0; i < this.headerContains.length; i++) {
      const expectedHeaderObject = this.headerContains[i];
      const expectedHeader = expectedHeaderObject.key;
      const expectedHeaderValue = expectedHeaderObject.value;
      assert.ok(response.headers[expectedHeader], `Header '${expectedHeader}' not present in HTTP response`);
      if (expectedHeaderValue !== undefined) {
        const actualHeaderValue = response.headers[expectedHeader];
        if (expectedHeaderValue instanceof RegExp) {
          assert.ok(expectedHeaderValue.test(actualHeaderValue), `Header regex (${expectedHeaderValue}) did not match for header '${expectedHeader}': '${actualHeaderValue}'`);
        } else {
          assert.ok(actualHeaderValue.toLowerCase().includes(expectedHeaderValue.toLowerCase()), `Header value '${expectedHeaderValue}' did not match for header '${expectedHeader}': '${actualHeaderValue}'`)
        }
      }
    }
  }

  validateBody(response) {
    if (this.body !== null) {
      assert.strictEqual(response.body, this.body);
    }
  }

  validateBodyContains(response) {
    for (let i = 0; i < this.bodyContains.length; i++) {
      const expectedBodyValue = this.bodyContains[i];
      if (expectedBodyValue instanceof RegExp) {
        assert.ok(expectedBodyValue.test(response.body), `Value '${expectedBodyValue}' not found in response body`);
      } else {
        assert.ok(response.body.indexOf(expectedBodyValue) !== -1, `Value '${expectedBodyValue}' not found in response body`);
      }
    }
  }

  validateJson(response) {
    for (let i = 0; i < this.json.length; i++) {
      const expectedJSON = this.json[i];
      assert.deepStrictEqual(response.json, expectedJSON);
    }
  }

  validateJsonLike(response) {
    for (let i = 0; i < this.jsonLike.length; i++) {
      const expectedJSON = this.jsonLike[i];
      const like = new Like();
      const res = like.json(response.json, expectedJSON)
      assert.ok(res.equal, res.message);
    }
  }

  validateJsonQuery(response) {
    for (let i = 0; i < this.jsonQuery.length; i++) {
      const jQ = this.jsonQuery[i];
      const value = jqy(jQ.path, { data: response.json }).value;
      if (typeof value === 'object') {
        assert.deepStrictEqual(value, jQ.value);
      } else {
        assert.strictEqual(value, jQ.value)
      }
    }
  }

}

module.exports = Expect;