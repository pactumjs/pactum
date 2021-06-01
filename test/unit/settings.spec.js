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

  after(() => {
    settings.setSnapshotDirectoryPath('.pactum/snapshots');
  });

});
