const fs = require('fs');

function getSnapshotDirAndName(name) {
  return {
    snapshotDir: '.pactum/snapshots',
    snapshotFile: `${name}.json`
  };
}

function getSnapshotFile(name, data) {
  const { snapshotDir, snapshotFile } = getSnapshotDirAndName(name);
  if (!fs.existsSync(snapshotDir)) {
    fs.mkdirSync(snapshotDir, { recursive: true });
  }
  const exist = fs.existsSync(`${snapshotDir}/${snapshotFile}`);
  if (exist) {
    return JSON.parse(fs.readFileSync(`${snapshotDir}/${snapshotFile}`));
  } else {
    fs.writeFileSync(`${snapshotDir}/${snapshotFile}`, JSON.stringify(data, null, 2));
    return data;
  }
}

function saveSnapshot(name, data) {
  const { snapshotDir, snapshotFile } = getSnapshotDirAndName(name);
  fs.writeFileSync(`${snapshotDir}/${snapshotFile}`, JSON.stringify(data, null, 2));
}

module.exports = {
  getSnapshotFile,
  saveSnapshot
};