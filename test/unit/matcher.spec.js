const expect = require('chai').expect;

const matcher = require('../../src/models/matcher');

describe('Matchers', () => {

  it('regex - number', () => {
    expect(() => matcher.regex(1)).throws('Invalid regex matching options - 1');
  });

  it('regex - boolean', () => {
    expect(() => matcher.regex(true)).throws('Invalid regex matching options - true');
  });

  it('regex - null', () => {
    expect(() => matcher.regex(null)).throws('Invalid regex matching options - null');
  });

  it('regex - undefined', () => {
    expect(() => matcher.regex()).throws('Invalid regex matching options - undefined');
  });

  it('regex - invalid regex', () => {
    expect(() => matcher.regex('[')).throws('Invalid regex matching options - [');
  });

  it('eachLike - with min', () => {
    expect(matcher.eachLike('a', { min: 2 })).deep.equals({
      "contents": "a",
      "json_class": "Pact::ArrayLike",
      "min": 2,
      "value": [
        "a",
        "a"
      ]
    });
  });

});