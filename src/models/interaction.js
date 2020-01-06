const helper = require('../helpers/helper');

class InteractionRequest {

  constructor(request) {
    this.method = request.method;
    this.path = request.path;
    this.query = request.query;
  }

}

class InteractionResponse {

  constructor(response) {
    this.status = response.status;
    this.headers = response.headers;
    this.rawBody = JSON.parse(JSON.stringify(response.body)); 
    this.body = helper.setValueFromMatcher(response.body);
  }

}

class Interaction {

  constructor(rawInteraction) {
    this.id = helper.getRandomId();
    this.port = rawInteraction.port || 3000;
    this.provider = rawInteraction.provider;
    this.state = rawInteraction.state;
    this.uponReceiving = rawInteraction.uponReceiving;
    this.rawInteraction = rawInteraction;
    this.withRequest = new InteractionRequest(rawInteraction.withRequest);
    this.willRespondWith = new InteractionResponse(rawInteraction.willRespondWith);
  }

}

module.exports = Interaction;