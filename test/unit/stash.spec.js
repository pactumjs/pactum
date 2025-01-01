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
    expect(err.message).equals(`path not found to load data - './data'`);
  });

  it('path is not a directory', () => {
    let err;
    try {
      stash.loadData('./src/index.js');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`path should be a directory to load data - './src/index.js'`);
  });

  it('load data from sub folders', () => {
    stash.loadData('./test/data/dm');
    expect(stash.getDataMap()).deep.equals({
      "House": {
        "Name": "WinterFell",
        "Owner": "Stark"
      }
    });
    expect(stash.getDataTemplate()).deep.equals({
      "House:New": {
        "Name": "$M{House.Name}",
        "Owner": "$M{House.Owner}"
      }
    });
  });


});

