const fs = require('fs');
const path = require('path');
const config = require('../config');

function getSnapshotDirAndName(name) {
  return {
    snapshotDir: config.snapshot.dir,
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


function findFileRecursively(name, dir = config.data.dir) {
  if (fs.existsSync(name)) {
    return fs.readFileSync(name);
  }
  if (fs.existsSync(dir)) {
    const exist = fs.existsSync(`${dir}/${name}`);
    if (exist) {
      return fs.readFileSync(`${dir}/${name}`);
    }
    // get folders in dir
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const dirPath = path.resolve(dir, file);
      const stats = fs.statSync(dirPath);
      if (stats.isDirectory()) {
        const result = findFileRecursively(name, dirPath);
        if (result) {
          return result;
        }
      }
    }
  }
}

module.exports = {
  getSnapshotFile,
  saveSnapshot,
  findFileRecursively
};