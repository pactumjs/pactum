const assert = require('assert');
const jqy = require('json-query');
const lc = require('lightcookie');

const config = require('../config');
const utils = require('../helpers/utils');
const helper = require('../helpers/helper');
const file = require('../helpers/file.utils');
const log = require('../plugins/logger');
const processor = require('../helpers/dataProcessor');
const handler = require('../exports/handler');
const { clone } = require('../exports/utils');
const jsv = require('../plugins/json.schema');
const jmv = require('../plugins/json.match');
const jlv = require('../plugins/json.like');

class Expect {
  constructor() {
    this.name = null;
    this.updateSnapshot = false;
    this.statusCode = null;
    this.body = null;
    this.bodyContains = [];
    this.cookies = [];
    this.cookiesLike = [];
    this.json = [];
    this.jsonQuery = [];
    this.jsonLike = [];
    this.jsonQueryLike = [];
    this.jsonSchema = [];
    this.jsonSchemaQuery = [];
    this.jsonMatch = [];
    this.jsonMatchQuery = [];
    this.jsonMatchStrict = [];
    this.jsonMatchStrictQuery = [];
    this.jsonSnapshots = [];
    this.jsonLength = [];
    this.jsonLengthQuery = [];
    this.headers = [];
    this.headerContains = [];
    this.responseTime = null;
    this.customExpectHandlers = [];
    this.errors = [];
  }

  validate(request, response) {
    this._validateStatus(response);
    this._validateHeaders(response);
    this._validateHeaderContains(response);
    this._validateBody(response);
    this._validateCookies(response);
    this._validateCookiesLike(response);
    this._validateBodyContains(response);
    this._validateJson(response);
    this._validateJsonLike(response);
    this._validateJsonQuery(response);
    this._validateJsonQueryLike(response);
    this._validateJsonSchema(response);
    this._validateJsonSchemaQuery(response);
    this._validateJsonMatch(response);
    this._validateJsonMatchQuery(response);
    this._validateJsonMatchStrict(response);
    this._validateJsonMatchStrictQuery(response);
    this._validateJsonLength(response);
    this._validateJsonLengthQuery(response);
    this._validateJsonSnapshot(response);
    this._validateResponseTime(response);
    this._validateErrors(response);
    // for asynchronous expectations
    return this._validateCustomExpectHandlers(request, response);
  }

  validateInteractions(interactions) {
    for (let i = 0; i < interactions.length; i++) {
      const interaction = interactions[i];
      const expects = interaction.expects;
      const intReq = {
        method: interaction.request.method,
        path: interaction.request.path,
        headers: interaction.request.headers,
        body: interaction.request.body
      };
      if (expects.disable) {
        log.debug('Interaction expect exercised is skipped', intReq);
      }
      if (expects.exercised && !interaction.exercised && !expects.disable) {
        log.warn('Interaction Not Exercised', intReq);
        this.fail(`Interaction not exercised: ${interaction.request.method} - ${interaction.request.path}`);
      }
      if (!expects.exercised && interaction.exercised && !expects.disable) {
        log.warn('Interaction got Exercised', intReq);
        this.fail(`Interaction exercised: ${interaction.request.method} - ${interaction.request.path}`);
      }
      if (typeof expects.callCount !== 'undefined') {
        if (expects.callCount !== interaction.callCount && !expects.disable) {
          this.fail(`Interaction call count ${interaction.callCount} !== ${expects.callCount} for ${interaction.request.method} - ${interaction.request.path}`);
        }
      }
    }
  }

  _validateStatus(response) {
    this.statusCode = processor.processData(this.statusCode);
    if (this.statusCode !== null) {
      const message = this.customMessage ? `${this.customMessage}\n ` : '';
      assert.strictEqual(response.statusCode, this.statusCode, `${message}HTTP status ${response.statusCode} !== ${this.statusCode}`);
    }
  }

  _validateCookies(response) {
    this.cookies = processor.processData(this.cookies);
    for (let i = 0; i < this.cookies.length; i++) {
      const expectedCookie = this.cookies[i];
      let actualCookie = response.headers['set-cookie'];
      if (!actualCookie) {
        this.fail(`'set-cookie' key not found in response headers`);
      }
      actualCookie = lc.parse(actualCookie);
      assert.deepStrictEqual(actualCookie, expectedCookie);
    }
  }

  _validateCookiesLike(response) {
    this.cookiesLike = processor.processData(this.cookiesLike);
    for (let i = 0; i < this.cookiesLike.length; i++) {
      const expectedCookie = this.cookiesLike[i];
      let actualCookie = response.headers['set-cookie'];
      if (!actualCookie) {
        this.fail(`'set-cookie' key not found in response headers`);
      }
      actualCookie = lc.parse(actualCookie);
      const msg = jlv.validate(actualCookie, expectedCookie, { target: 'Cookie' });
      if (msg) this.fail(msg);
    }
  }

  _validateHeaders(response) {
    this.headers = processor.processData(this.headers);
    for (let i = 0; i < this.headers.length; i++) {
      const expectedHeaderObject = this.headers[i];
      const expectedHeader = expectedHeaderObject.key;
      const expectedHeaderValue = expectedHeaderObject.value;
      if (!(expectedHeader in response.headers)) {
        this.fail(`Header '${expectedHeader}' not present in HTTP response`);
      }
      if (expectedHeaderValue !== undefined) {
        const actualHeaderValue = response.headers[expectedHeader];
        if (expectedHeaderValue instanceof RegExp) {
          if (!expectedHeaderValue.test(actualHeaderValue)) {
            this.fail(`Header regex (${expectedHeaderValue}) did not match for header '${expectedHeader}': '${actualHeaderValue}'`);
          }
        } else {
          if (expectedHeaderValue.toLowerCase() !== actualHeaderValue.toLowerCase()) {
            this.fail(`Header value '${expectedHeaderValue}' did not match for header '${expectedHeader}': '${actualHeaderValue}'`);
          }
        }
      }
    }
  }

  _validateHeaderContains(response) {
    this.headerContains = processor.processData(this.headerContains);
    for (let i = 0; i < this.headerContains.length; i++) {
      const expectedHeaderObject = this.headerContains[i];
      const expectedHeader = expectedHeaderObject.key;
      const expectedHeaderValue = expectedHeaderObject.value;
      if (!(expectedHeader in response.headers)) {
        this.fail(`Header '${expectedHeader}' not present in HTTP response`);
      }
      if (expectedHeaderValue !== undefined) {
        const actualHeaderValue = response.headers[expectedHeader];
        if (expectedHeaderValue instanceof RegExp) {
          if (!expectedHeaderValue.test(actualHeaderValue)) {
            this.fail(`Header regex (${expectedHeaderValue}) did not match for header '${expectedHeader}': '${actualHeaderValue}'`);
          }
        } else {
          if (!actualHeaderValue.toLowerCase().includes(expectedHeaderValue.toLowerCase())) {
            this.fail(`Header value '${expectedHeaderValue}' did not match for header '${expectedHeader}': '${actualHeaderValue}'`);
          }
        }
      }
    }
  }

  _validateBody(response) {
    this.body = processor.processData(this.body);
    if (this.body !== null) {
      assert.deepStrictEqual(response.body, this.body);
    }
  }

  _validateBodyContains(response) {
    this.bodyContains = processor.processData(this.bodyContains);
    for (let i = 0; i < this.bodyContains.length; i++) {
      const expectedBodyValue = this.bodyContains[i];
      let expected = expectedBodyValue;
      if (expected && typeof expected === 'object' && !(expected instanceof RegExp)) {
        expected = JSON.stringify(expected);
      }
      if (expected instanceof RegExp) {
        if (!expected.test(response.body)) {
          this.fail(`Value '${expected}' not found in response body`);
        }
      } else {
        let actual = response.body;
        if (actual && typeof actual === 'object') {
          actual = JSON.stringify(actual);
        }
        if (actual.indexOf(expected) === -1) {
          this.fail(`Value '${expected}' not found in response body`);
        }
      }
    }
  }

  _validateJson(response) {
    this.json = processor.processData(this.json);
    for (let i = 0; i < this.json.length; i++) {
      const expectedJSON = this.json[i];
      assert.deepStrictEqual(response.json, expectedJSON);
    }
  }

  _validateJsonLike(response) {
    this.jsonLike = processor.processData(this.jsonLike);
    for (let i = 0; i < this.jsonLike.length; i++) {
      const expectedJSON = this.jsonLike[i];
      const msg = jlv.validate(response.json, expectedJSON);
      if (msg) this.fail(msg);
    }
  }

  _validateJsonQuery(response) {
    this.jsonQuery = processor.processData(this.jsonQuery);
    for (let i = 0; i < this.jsonQuery.length; i++) {
      const jQ = this.jsonQuery[i];
      const value = jqy(jQ.path, { data: response.json }).value;
      if (typeof value === 'object') {
        assert.deepStrictEqual(value, jQ.value);
      } else {
        assert.strictEqual(value, jQ.value);
      }
    }
  }

  _validateJsonQueryLike(response) {
    this.jsonQueryLike = processor.processData(this.jsonQueryLike);
    for (let i = 0; i < this.jsonQueryLike.length; i++) {
      const jQ = this.jsonQueryLike[i];
      const value = jqy(jQ.path, { data: response.json }).value;
      const msg = jlv.validate(value, jQ.value, { root_path: jQ.path });
      if (msg) this.fail(msg);
    }
  }

  _validateJsonSchema(response) {
    this.jsonSchema = processor.processData(this.jsonSchema);
    for (let i = 0; i < this.jsonSchema.length; i++) {
      const errors = jsv.validate(this.jsonSchema[i].value, response.json, this.jsonSchema[i].options);
      if (errors) {
        this.fail(`Response doesn't match with JSON schema - ${errors}`);
      }
    }
  }

  _validateJsonSchemaQuery(response) {
    this.jsonSchemaQuery = processor.processData(this.jsonSchemaQuery);
    for (let i = 0; i < this.jsonSchemaQuery.length; i++) {
      const jQ = this.jsonSchemaQuery[i];
      const value = jqy(jQ.path, { data: response.json }).value;
      const errors = jsv.validate(jQ.value, value, jQ.options);
      if (errors) {
        this.fail(`Response doesn't match with JSON schema at ${jQ.path}: \n ${JSON.stringify(errors, null, 2)}`);
      }
    }
  }

  _validateJsonMatch(response) {
    this.jsonMatch = processor.processData(this.jsonMatch);
    for (let i = 0; i < this.jsonMatch.length; i++) {
      const data = clone(this.jsonMatch[i]);
      const rules = jmv.getMatchingRules(data, '$.body');
      const value = jmv.getRawValue(data);
      const errors = jmv.validate(response.json, value, rules, '$.body');
      if (errors) {
        this.fail(errors.replace('$.body', '$'));
      }
    }
  }

  _validateJsonMatchQuery(response) {
    this.jsonMatchQuery = processor.processData(this.jsonMatchQuery);
    for (let i = 0; i < this.jsonMatchQuery.length; i++) {
      const jQ = clone(this.jsonMatchQuery[i]);
      const actualValue = jqy(jQ.path, { data: response.json }).value;
      const rules = jmv.getMatchingRules(jQ.value, jQ.path);
      const expectedValue = jmv.getRawValue(jQ.value);
      const errors = jmv.validate(actualValue, expectedValue, rules, jQ.path);
      if (errors) {
        this.fail(errors);
      }
    }
  }

  _validateJsonMatchStrict(response) {
    this.jsonMatchStrict = processor.processData(this.jsonMatchStrict);
    for (let i = 0; i < this.jsonMatchStrict.length; i++) {
      const data = clone(this.jsonMatchStrict[i]);
      const rules = jmv.getMatchingRules(data, '$.body');
      const value = jmv.getRawValue(data);
      const errors = jmv.validate(response.json, value, rules, '$.body', true);
      if (errors) {
        this.fail(errors.replace('$.body', '$'));
      }
    }
  }

  _validateJsonMatchStrictQuery(response) {
    this.jsonMatchStrictQuery = processor.processData(this.jsonMatchStrictQuery);
    for (let i = 0; i < this.jsonMatchStrictQuery.length; i++) {
      const jQ = clone(this.jsonMatchStrictQuery[i]);
      const actualValue = jqy(jQ.path, { data: response.json }).value;
      const rules = jmv.getMatchingRules(jQ.value, jQ.path);
      const expectedValue = jmv.getRawValue(jQ.value);
      const errors = jmv.validate(actualValue, expectedValue, rules, jQ.path, true);
      if (errors) {
        this.fail(errors);
      }
    }
  }

  _validateJsonSnapshot(response) {
    if (this.jsonSnapshots.length > 0) {
      this.jsonSnapshots = processor.processData(this.jsonSnapshots);
      let snapshot_name = this.name;
      const actual = response.json;
      const all_rules = {};

      for (let i = 0; i < this.jsonSnapshots.length; i++) {
        const { name, value } = this.jsonSnapshots[i];
        snapshot_name = name || snapshot_name;
        if (!snapshot_name) {
          this.fail('Snapshot name is required');
        }
        if (this.updateSnapshot) {
          log.warn(`Update snapshot is enabled for '${snapshot_name}'`);
          file.saveSnapshot(snapshot_name, response.json);
        }
        if (value) {
          const current_rules = jmv.getMatchingRules(value, '$.body');
          let errors = jmv.validate(actual, jmv.getRawValue(value), current_rules, '$.body');
          if (errors) {
            this.fail(errors.replace('$.body', '$'));
          }
          Object.assign(all_rules, current_rules);
        }
      }

      const expected = file.getSnapshotFile(snapshot_name, response.json);
      if (Object.keys(all_rules).length > 0) {
        const errors = jmv.validate(actual, expected, all_rules, '$.body', true);
        if (errors) {
          this.fail(errors.replace('$.body', '$'));
        }
      } else {
        assert.deepStrictEqual(actual, expected);
      }
    }
  }

  _validateJsonLength(response) {
    this.jsonLength = processor.processData(this.jsonLength);
    for (let i = 0; i < this.jsonLength.length; i++) {
      const expected = this.jsonLength[i];
      if (response.json && Array.isArray(response.json)) {
        const actual = response.json.length;
        assert.strictEqual(actual, expected, `JSON Length ${actual} !== ${expected}`);
      } else {
        this.fail('Response does not contain a json array');
      }
    }
  }

  _validateJsonLengthQuery(response) {
    const allowedRules = ['LTE', 'GTE', 'LT', 'GT', 'NOT_EQUALS']
    this.jsonLengthQuery = processor.processData(this.jsonLengthQuery);
    for (let i = 0; i < this.jsonLengthQuery.length; i++) {
      const jQ = clone(this.jsonLengthQuery[i]);
      const actualValue = jqy(jQ.path, { data: response.json }).value;
      const rules = jmv.getMatchingRules(jQ.value, jQ.path);
      const expectedValue = jmv.getRawValue(jQ.value);
      if (!actualValue && !Array.isArray(actualValue)) {
        this.fail(`Response does not contain a json array at '${jQ.path}'`);
      }
      if (helper.isValidObject(jQ.value) && !allowedRules.includes(jQ.value.pactum_type)) {
        this.fail(`Invalid compare operation ${jQ.value.pactum_type}, allowed operations: ${allowedRules}`);
      }
      const errors = jmv.validate(actualValue.length, expectedValue, rules, jQ.path);
      if (errors) {
        const errCondition = jQ.value.pactum_type ? `not ${jQ.value.pactum_type}` : "!==";
        this.fail(`JSON Length ${actualValue.length} ${errCondition} ${expectedValue}`);
      }
    }
  }

  _validateResponseTime(response) {
    this.responseTime = processor.processData(this.responseTime);
    if (this.responseTime !== null) {
      if (response.responseTime > this.responseTime) {
        this.fail(`Request took longer than ${this.responseTime}ms: (${response.responseTime}ms).`);
      }
    }
  }

  _validateErrors(response) {
    if (this.errors.length > 0) {
      if (!(response instanceof Error)) {
        this.fail(`No Error while performing a request`);
      }
      for (let i = 0; i < this.errors.length; i++) {
        const expected = this.errors[i];
        if (typeof expected === 'string') {
          if (response.errors && Array.isArray(response.errors) && response.errors.length > 0) {
            const actual = response.errors[0].toString();
            if (!actual.includes(expected)) {
              this.fail(`Error - "${actual}" doesn't include - ${expected}`);
            }
          } else {
            const actual = response.toString();
            if (!actual.includes(expected)) {
              this.fail(`Error - "${actual}" doesn't include - ${expected}`);
            }
          }
        }
        if (typeof expected === 'object') {
          const rules = jmv.getMatchingRules(expected, '$.error');
          const value = jmv.getRawValue(expected);
          const errors = jmv.validate(response, value, rules, '$.error', false);
          if (errors) {
            this.fail(errors.replace('$.error', '$'));
          }
        }
      }
    }
  }

  async _validateCustomExpectHandlers(request, response) {
    for (let i = 0; i < this.customExpectHandlers.length; i++) {
      const requiredHandler = this.customExpectHandlers[i];
      const ctx = { req: request, res: response, data: requiredHandler.data };
      if (typeof requiredHandler.handler === 'function') {
        await requiredHandler.handler(ctx);
      } else {
        const handlerFun = handler.getExpectHandler(requiredHandler.handler);
        await handlerFun(ctx);
      }
    }
  }

  fail(error) {
    assert.fail(error);
  }

  setDefaultResponseExpectations() {
    if (config.response.status) {
      this.statusCode = config.response.status;
    }
    if (config.response.time) {
      this.responseTime = config.response.time;
    }
    if (config.response.headers && Object.keys(config.response.headers).length !== 0) {
      for (const [key, value] of Object.entries(config.response.headers)) {
        utils.upsertValues(this.headers, { key, value });
      }
    }
    if (config.response.expectHandlers.length > 0) {
      this.customExpectHandlers = this.customExpectHandlers.concat(config.response.expectHandlers);
    }
  }

}

module.exports = Expect;
