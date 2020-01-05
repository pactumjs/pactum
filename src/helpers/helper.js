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
  },

  setValueFromMatcher(data) {
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        data[i] = this.setValueFromMatcher(data[i]);
      }
    } else if (typeof data === 'object') {
        switch (data.json_class) {
          case 'Pact::SomethingLike':
          case 'Pact::Term':
          case 'Pact::ArrayLike':
            if (Array.isArray(data.value)) {
              for (let i = 0; i < data.value.length; i++) {
                data.value[i] = this.setValueFromMatcher(data.value[i]);
              }
            }
            return data.value;
          default:
            for (const prop in data) {
              data[prop] = this.setValueFromMatcher(data[prop]);
              if (typeof data[prop] === 'object' && !Array.isArray(data[prop])) {
                for (const innerProp in data[prop]) {
                  data[prop][innerProp] = this.setValueFromMatcher(data[prop][innerProp]);
                }
              }
            }
            return data;
        }
    }
    return data;
  }

}

module.exports = helper;
