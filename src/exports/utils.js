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
   * @returns
   */
  findFile(name, dir = config.data.dir) {
    const result = findFileRecursively(name, dir);
    if (result) {
      return result;
    }
    throw new Error(`File Not Found - '${name}'`);
  },

  /**
   * Adds header(s) to list of headers to redact
   * @param {Array | String} headers 
   */
    addRedactHeaders(headers) {
      if (!Array.isArray(headers)){
        config.redact_headers_list.push(headers.trim());
      }
      config.redact_headers_list.concat(headers);
    }
}

module.exports = utils;