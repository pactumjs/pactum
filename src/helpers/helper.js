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
  }

}

module.exports = helper;
