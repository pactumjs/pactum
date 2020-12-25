const Tosser = require('./FuzzTosser');

class Fuzz {

  constructor() {
    this.swaggerUrl = '';
    this.headers = {};
    this.interactions = [];
    this.batchSize = 10;
    this._inspect = false;
  }

  onSwagger(url) {
    this.swaggerUrl = url;
    return this;
  }

  withHeaders(key, value) {
    if (typeof key === 'string') {
      this.headers[key] = value;
    } else {
      Object.assign(this.headers, key);
    }
    return this;
  }

  useInteraction(interaction, data) {
    this.interactions.push({ interaction, data });
    return this;
  }

  withBatchSize(size) {
    this.batchSize = size;
    return this;
  }

  inspect() {
    this._inspect = true;
    return this;
  }

  async toss() {
    const tosser = new Tosser(this);
    return tosser.toss();
  }

  then(resolve, reject) {
    this.toss()
      .then(res => resolve(res))
      .catch(err => reject(err));
  }

}

module.exports = Fuzz;