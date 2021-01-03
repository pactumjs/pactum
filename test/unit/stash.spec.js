const expect = require('chai').expect;

const stash = require('../../src/exports/stash');

describe('Stash', () => {

  it('default path not found', () => {
    let err;
    try {
      stash.loadData();
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('`path` not found');
  });

  it('default path not found', () => {
    let err;
    try {
      stash.loadData('./src/index.js');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('`path` should be a directory');
  });


});

