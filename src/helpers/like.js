class Like {

  json(actual, expected) {
    const comparer = new LikeJson();
    const equal = comparer.compare(actual, expected);
    let message = '';
    if (!equal) {
      if (comparer.expected === null) {
        message = `Json doesn't have property '${comparer.prop}' at '${comparer.path}'`;
      } else {
        let exactPath = '';
        if (comparer.prop !== null) {
          exactPath = `${comparer.path}.${comparer.prop}`;
        } else {
          exactPath = `${comparer.path}`;
        }
        if (comparer.actualPlaceValue) {
          message = `Json doesn't have value '${comparer.expected}' at '${exactPath}' but found '${comparer.actualPlaceValue}'`;
        } else {
          message = `Json doesn't have value '${comparer.expected}' at '${exactPath}' but found '${comparer.actual}'`;
        }
      }
    }
    return { equal, message };
  }

}

class LikeJson {

  constructor() {
    this.path = '$';
    this.prop = null;
    this.expected = null;
    this.actual = null;
    this.actualPlaceValue = null;
  }

  compare(actualJson, expectedJson, path = '$') {
    if ((expectedJson instanceof RegExp && expectedJson.test(actualJson)) || (actualJson === expectedJson)) {
      return true;
    }
    if (!(actualJson instanceof Object) || !(expectedJson instanceof Object)) {
      this.expected = expectedJson;
      this.actual = actualJson;
      this.path = path;
      return false;
    }
    if (Array.isArray(expectedJson) && Array.isArray(actualJson)) {
      this.prop = null;
      for (let i = 0; i < expectedJson.length; i++) {
        let found = false;
        const newPath = path + `[${i}]`;
        for (let j = 0; j < actualJson.length; j++) {
          if (i === j) {
            this.actualPlaceValue = actualJson[j];
          }
          if (this.compare(actualJson[j], expectedJson[i], newPath)) {
            found = true;
            break;
          }
        }
        if (!found) {
          return false;
        }
        this.actualPlaceValue = null;
      }
    } else {
      for (const prop in expectedJson) {
        this.prop = prop;
        if (!expectedJson.hasOwnProperty(prop)) {
          continue;
        }
        if (!actualJson.hasOwnProperty(prop)) {
          this.path = path;
          return false;
        }
        this.expected = expectedJson[prop];
        this.actual = actualJson[prop];
        this.actualPlaceValue = null;
        if ((this.expected instanceof RegExp && this.expected.test(this.actual)) || (this.expected === this.actual)) {
          this.expected = null;
          this.actual = null;
          continue;
        }
        if (typeof (actualJson[prop]) !== "object") {
          this.path = path;
          return false;
        }
        const newPath = path + '.' + prop;
        this.expected = null;
        this.actual = null;
        if (!this.compare(actualJson[prop], expectedJson[prop], newPath)) {
          return false;
        }
      }
    }
    return true;
  }

}

module.exports = Like;