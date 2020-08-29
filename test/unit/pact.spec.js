const expect = require('chai').expect;
const pact = require('../../src/index').pact;

describe('Provider Verification - Pact Broker', () => {

  it('no options', async () => {
    let err;
    try {
      await pact.publish();
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid publish options provided');
  });

  it('empty options', async () => {
    let err;
    try {
      await pact.publish({});
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Missing pactBroker option from publish options');
  });

  it('missing pactBrokerUsername', async () => {
    let err;
    try {
      await pact.publish({
        pactBroker: 'abc'
      });
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Missing pactBrokerUsername option from publish options');
  });

  it('missing pactBrokerPassword', async () => {
    let err;
    try {
      await pact.publish({
        pactBroker: 'abc',
        pactBrokerUsername: 'abc'
      });
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Missing pactBrokerPassword option from publish options');
  });

  it('missing consumerVersion', async () => {
    let err;
    try {
      await pact.publish({
        pactBroker: 'abc',
        pactBrokerUsername: 'abc',
        pactBrokerPassword: 'abc'
      });
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Missing consumerVersion option from publish options');
  });

  it('invalid tags', async () => {
    let err;
    try {
      await pact.publish({
        pactBroker: 'abc',
        pactBrokerUsername: 'abc',
        pactBrokerPassword: 'abc',
        consumerVersion: '0',
        tags: ''
      });
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid tags option in publish options. Tags should be array of strings');
  });

  it('empty tags', async () => {
    let err;
    try {
      await pact.publish({
        pactBroker: 'abc',
        pactBrokerUsername: 'abc',
        pactBrokerPassword: 'abc',
        consumerVersion: '0',
        tags: [ 'test', '', 'dev']
      });
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid tag in publish options. Tags should be array of non empty strings');
  });

});

describe('Pact', () => {

  it('setPactFilesDirectory - undefined', () => {
    expect(() => pact.setPactFilesDirectory()).throws('Invalid directory provided for saving pact files - undefined');
  });

  it('setConsumerName - undefined', () => {
    expect(() => pact.setConsumerName()).throws('Invalid consumer name - undefined');
  });

  after(() => {
    pact.setPactFilesDirectory('./pacts/');
  })

});