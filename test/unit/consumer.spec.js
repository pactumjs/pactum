const expect = require('chai').expect;
const consumer = require('../../src/index').consumer;

describe('Consumer Expectations - Pact Broker', () => {

  it('no options', async () => {
    let err;
    try {
      await consumer.publish();
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid publish options provided');
  });

  it('empty options', async () => {
    let err;
    try {
      await consumer.publish({});
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Missing pactBrokerUrl option from publish options');
  });

  it('missing pactBrokerUsername', async () => {
    let err;
    try {
      await consumer.publish({
        pactBrokerUrl: 'abc'
      });
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Missing pactBrokerUsername option from publish options');
  });

  it('missing pactBrokerPassword', async () => {
    let err;
    try {
      await consumer.publish({
        pactBrokerUrl: 'abc',
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
      await consumer.publish({
        pactBrokerUrl: 'abc',
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
      await consumer.publish({
        pactBrokerUrl: 'abc',
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
      await consumer.publish({
        pactBrokerUrl: 'abc',
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

describe('Consumer Expectations - Pact', () => {

  it('setPactFilesDirectory - undefined', () => {
    expect(() => consumer.setPactFilesDirectory()).throws('`dir` is required');
  });

  it('setConsumerName - undefined', () => {
    expect(() => consumer.setConsumerName()).throws('`name` is required');
  });

  after(() => {
    consumer.setPactFilesDirectory('./pacts/');
  })

});