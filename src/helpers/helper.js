const helper = {

  bufferToString(value) {
    return value instanceof Buffer ? value.toString() : value;
  },

  getJson(value) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  },

  getRandomId() {
    return Math.random().toString(36).substr(2, 5);
  },

  getCurrentTime() {
    return Date.now().toString();
  },

  isValidString(value) {
    return (typeof value === 'string' && value);
  },

  getPlainQuery(query) {
    let plainQuery = '';
    if (typeof query === 'object') {
      for (const prop in query) {
        if (plainQuery !== '') {
          plainQuery = plainQuery + '&';
        }
        plainQuery = plainQuery + `${prop}=${query[prop]}`;
      }
    }
    return plainQuery;
  },

  isValidObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  },

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  matchesStrategy(value, strategy) {
    if (strategy.starts && !value.startsWith(strategy.starts)) return false;
    if (strategy.ends && !value.endsWith(strategy.ends)) return false;
    if (strategy.includes && !value.includes(strategy.includes)) return false;
    return true;
  },

  sliceStrategy(value, strategy) {
    if (strategy.starts) value = value.slice(strategy.starts.length);
    if (strategy.ends) value = value.slice(0, -(strategy.ends.length));
    return value;
  },

  getTrimResponse(response) {
    return {
      statusCode: response.statusCode,
      headers: response.headers,
      body: response.json
    };
  },

  isContentJson(res) {
    const type = res && res.headers['content-type'];
    return type ? type.includes('application/json') : false;
  }

};

module.exports = helper;
