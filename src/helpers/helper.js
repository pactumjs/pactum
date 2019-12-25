const helper = {

  getJson(jsonString) {
    try {
      return JSON.parse(jsonString)
    } catch (error) {
      return null;
    }
  }

}

module.exports = helper;