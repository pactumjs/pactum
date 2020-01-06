class Consumer {
  
  constructor(name) {
    this.name = name;
  }

}

class Provider {
  
  constructor(name) {
    this.name = name;
  }

}

class Pact {

  constructor(consumer, provider) {
    this.consumer = new Consumer(consumer);
    this.provider = new Provider(provider);
    this.interactions = [];
  }

}

module.exports = Pact;