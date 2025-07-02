const { findFileRecursively } = require("../helpers/file.utils");
const config = require("../config");
const { klona } = require("klona");

const utils = {

  clone(value) {
    return klona(value);
  },

  /**
   * sleeps for a certain amount of time
   * @param {number} ms the amount of time to sleep in milliseconds
   * @returns
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * finds a file recursively in a directory
   * @param {string} name
   * @param {string} dir
   * @param {string|null} [encoding] - Optional encoding (e.g., 'utf8')
   * @returns {Buffer|string}
   */
  findFile(name, dir = config.data.dir, encoding = null) {
    const result = findFileRecursively(name, dir, encoding);
    if (result) {
      return result;
    }
    throw new Error(`File Not Found - '${name}'`);
  }
}

module.exports = utils;