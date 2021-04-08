const expect = require('chai').expect;

const settings = require('../../src/exports/settings');
const config = require('../../src/config');
const logger = require('../../src/exports/logger');

describe('Settings', () => {

  it('setSnapshotDirectoryPath', () => {
    settings.setSnapshotDirectoryPath('new/path');
    expect(config.snapshot.dir).equals('new/path');
  });

  it('setLogger', () => {
    settings.setLogger(logger.get());
  });

  after(() => {
    settings.setSnapshotDirectoryPath('.pactum/snapshots');
  });

});
