const expect = require('chai').expect;

const settings = require('../../src/exports/settings');
const config = require('../../src/config');
const logger = require('../../src/adapters/logger');

describe('Settings', () => {

  it('setSnapshotDirectoryPath', () => {
    settings.setSnapshotDirectoryPath('new/path');
    expect(config.snapshot.dir).equals('new/path');
  });

  it('setLogger', () => {
    settings.setLogger(logger);
  });

  it('setJsonLikeAdapter', () => {
    settings.setJsonLikeAdapter(require('../../src/adapters/json.like'));
  });

  it('setJsonMatchAdapter', () => {
    settings.setJsonMatchAdapter(require('../../src/adapters/json.match'));
  });

  it('setJsonSchemaAdapter', () => {
    settings.setJsonSchemaAdapter(require('../../src/adapters/json.schema'));
  });

  after(() => {
    settings.setSnapshotDirectoryPath('.pactum/snapshots');
  });

});
