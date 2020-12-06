const expect = require('chai').expect;

const settings = require('../../src/exports/settings');
const config = require('../../src/config');

describe('Settings', () => {

  it('setSnapshotDirectoryPath', () => {
    settings.setSnapshotDirectoryPath('new/path');
    expect(config.snapshot.dir).equals('new/path');
  });

  after(() => {
    settings.setSnapshotDirectoryPath('.pactum/snapshots');
  });

});
