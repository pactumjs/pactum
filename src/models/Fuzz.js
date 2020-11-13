const Tosser = require('./FuzzTosser');

class Fuzz {

  constructor() {
    this.swaggerUrl = '';
    this.batchCount = 10;
  }

  swagger(url) {
    this.swaggerUrl = url;
    return this;
  }

  batch(count) {
    this.batchCount = count;
    return this;
  }

  async toss() {
    const tosser = new Tosser(this);
    return tosser.toss();
  }

  then() {
    this.toss()
      .then(res => resolve(res))
      .catch(err => reject(err));
  }

}

module.exports = Fuzz;