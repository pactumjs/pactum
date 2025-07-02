const fs = require('fs');
const pt = require('path');
const config = require('../config');
const log = require('../plugins/logger');
const { PactumConfigurationError } = require('./errors');

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

function findFileRecursively(name, dir = config.data.dir, encoding = null) {
  if (fs.existsSync(name)) {
    return fs.readFileSync(name, encoding);
  }
  if (fs.existsSync(dir)) {
    const exist = fs.existsSync(`${dir}/${name}`);
    if (exist) {
      return fs.readFileSync(`${dir}/${name}`, encoding);
    }
    // get folders in dir
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const dirPath = pt.resolve(dir, file);
      const stats = fs.statSync(dirPath);
      if (stats.isDirectory()) {
        const result = findFileRecursively(name, dirPath, encoding);
        if (result) {
          return result;
        }
      }
    }
  }
}

function loadDataManagement(path = './data') {
  const templates = [];
  const maps = [];
  if (!fs.existsSync(path)) {
    log.error(`path not found - ${path}`);
    log.warn(`Current Working Dir: ${process.cwd()}`);
    throw new PactumConfigurationError(`path not found to load data - '${path}'`);
  }
  const stats = fs.lstatSync(path);
  if (!stats.isDirectory()) {
    log.error(`path should be a directory - ${path}`);
    throw new PactumConfigurationError(`path should be a directory to load data - '${path}'`);
  }
  const dir = fs.readdirSync(path);
  for (const file of dir) {
    if (file.endsWith('.template.json')) {
      templates.push(JSON.parse(fs.readFileSync(pt.resolve(path, file))));
    }
    if (file.endsWith('.map.json')) {
      maps.push(JSON.parse(fs.readFileSync(pt.resolve(path, file))));
    }
    if (file === 'maps') {
      loadAllFilesRecursively(pt.resolve(path, file), maps);
    }
    if (file === 'templates') {
      loadAllFilesRecursively(pt.resolve(path, file), templates);
    }
  }
  return { templates, maps };
}

function loadAllFilesRecursively(dir, data = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (fs.lstatSync(pt.resolve(dir, file)).isDirectory()) {
      loadAllFilesRecursively(pt.resolve(dir, file), data);
    } else {
      const json = JSON.parse(fs.readFileSync(pt.resolve(dir, file)));
      data.push(json);
    }
  }
}

module.exports = {
  getSnapshotFile,
  saveSnapshot,
  findFileRecursively,
  loadDataManagement
};