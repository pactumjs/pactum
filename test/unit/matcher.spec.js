const expect = require('chai').expect;

const Matcher = require('../../src/models/matcher');

describe('Matchers', () => {

  beforeEach(() => {
    this.matcher = new Matcher();
  });

  it('regex - number', () => {
    expect(() => this.matcher.regex(1)).throws('Invalid regex matching options - 1');
  });

  it('regex - boolean', () => {
    expect(() => this.matcher.regex(true)).throws('Invalid regex matching options - true');
  });

  it('regex - null', () => {
    expect(() => this.matcher.regex(null)).throws('Invalid regex matching options - null');
  });

  it('regex - undefined', () => {
    expect(() => this.matcher.regex()).throws('Invalid regex matching options - undefined');
  });

  it('regex - invalid regex', () => {
    expect(() => this.matcher.regex('[')).throws('Invalid regex matching options - [');
  });

  it('eachLike - with min', () => {
    expect(this.matcher.eachLike('a', { min: 2 })).deep.equals({
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