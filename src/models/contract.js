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

class PactInteraction {

  constructor() {
    this.description = '';
    this.providerState = '';
    this.request = new PactInteractionRequest();
    this.response = new PactInteractionResponse();
  }

}

class PactInteractionRequest {

  constructor() {
    this.method = '';
    this.path = '';
    this.query = '';
    this.headers = null;
    this.body = null;
  }

}

class PactInteractionResponse {

  constructor() {
    this.status = 0;
    this.headers = {};
    this.body = {};
    this.matchingRules = {};
  }

}

class Metadata {

  constructor() {
    this.pactSpecification = new PactSpecification();
  }

}

class PactSpecification {

  constructor() {
    this.version = "2.0.0";
  }

}

class Contract {

  constructor(consumer, provider) {
    this.consumer = new Consumer(consumer);
    this.provider = new Provider(provider);
    this.interactions = [];
    this.metadata = new Metadata();
  }

}

module.exports = { Contract, PactInteraction };