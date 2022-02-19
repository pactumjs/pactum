const { parse, stash } = require('../../src');
const expect = require('chai').expect;

const config = require('../../src/config');

describe('parse', () => {

  after(() => {
    config.data.template.enabled = false;
    config.data.template.processed = false;
    stash.clearDataTemplates();
    stash.clearDataMaps();
  })

  it('no data', () => {
    const actual = parse();
    expect(actual).to.be.undefined;
  });

  it('string', () => {
    const actual = parse('hi mom');
    expect(actual).to.be.equals('hi mom');
  });

  it('data map', () => {
    stash.addDataMap({ 'User': 'guest' });
    const actual = parse('$M{User}');
    expect(actual).to.be.equals('guest');
  });

  it('data template', () => {
    stash.addDataTemplate({ 'User': { name: 'guest' } });
    const actual = parse({ '@DATA:TEMPLATE@': 'User'});
    expect(actual).deep.equals({ name: 'guest' });
  });

});

