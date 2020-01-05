const helper = {

  getJson(jsonString) {
    try {
      return JSON.parse(jsonString)
    } catch (error) {
      return null;
    }
  },

  getRandomId() {
    return Math.random().toString(36).substr(2, 5);
  },

  validateQuery(actual, expected) {
    for (const prop in actual) {
      if (!actual.hasOwnProperty(prop)) {
        continue;
      }
      if (!expected.hasOwnProperty(prop)) {
        return false;
      }
      if(actual[prop] != expected[prop]) {
        return false;
      }
    }
    for (const prop in expected) {
      if (expected.hasOwnProperty(prop) && !actual.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  }

}

module.exports = helper;
