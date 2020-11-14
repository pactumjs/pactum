const Tosser = require('./FuzzTosser');

class Fuzz {

  constructor() {
    this.swaggerUrl = '';
    this.batchSize = 10;
    this._inspect = false;
  }

  onSwagger(url) {
    this.swaggerUrl = url;
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