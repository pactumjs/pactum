const expect = require('chai').expect;

const dp = require('../../src/helpers/dataProcessor');
const ld = require('../../src/exports/loader');
const config = require('../../src/config');

describe('Data Processing - Templates', () => {

  it('processTemplates - empty template', () => {
    config.data.template.processed = false;
    dp.processTemplates();
    expect(dp.template).deep.equals({});
    expect(config.data.template.processed).equals(true);
  });

  it('processTemplates - already processed', () => {
    config.data.template.processed = true;
    dp.template = {
      'User': {
        'Name': 'Snow',
        'Address': {
          '@DATA:TEMPLATE@': 'Address'
        }
      },
      'Address': {
        'Street': 'Main'
      }
    }
    dp.processTemplates();
    expect(dp.template).deep.equals({
      'User': {
        'Name': 'Snow',
        'Address': {
          '@DATA:TEMPLATE@': 'Address'
        }
      },
      'Address': {
        'Street': 'Main'
      }
    });
    expect(config.data.template.processed).equals(true);
  });

  it('processTemplates - simple with Extends', () => {
    ld.loadDataTemplate({
      'User': {
        'Name': 'Snow',
        'Address': {
          '@DATA:TEMPLATE@': 'Address',
          '@EXTENDS@': {
            'Zip': '524003'
          }
        }
      },
      'Address': {
        'Street': 'Main',
        'Zip': '524004'
      }
    });
    dp.processTemplates();
    expect(dp.template).deep.equals({
      'User': {
        'Name': 'Snow',
        'Address': {
          'Street': 'Main',
          'Zip': '524003'
        }
      },
      'Address': {
        'Street': 'Main',
        'Zip': '524004'
      }
    });
    expect(config.data.template.processed).equals(true);
  });

  it('processTemplates - template not found', () => {
    ld.loadDataTemplates([{
      'User': {
        'Name': 'Snow',
        'Address': {
          '@DATA:TEMPLATE@': 'Address_Not_Found'
        }
      }
    }]);
    dp.processTemplates();
    expect(dp.template).deep.equals({
      'User': {
        'Name': 'Snow',
        'Address': {
          '@DATA:TEMPLATE@': 'Address_Not_Found'
        }
      }
    });
    expect(config.data.template.processed).equals(true);
  });

  it('processTemplates - complex array of objects with Extends', () => {
    ld.loadDataTemplate({
      'User': {
        'Name': 'Snow',
        'Age': 12,
        'Nation': 'The North',
        'Address': [
          {
            '@DATA:TEMPLATE@': 'Address',
            '@EXTENDS@': {
              'Castle': 'The Wall'
            }
          },
          {
            '@DATA:TEMPLATE@': 'Address'
          }
        ]
      },
      'Address': {
        'Castle': 'WinterFell',
        'Region': 'North'
      },
      'User:NoAddress': {
        '@DATA:TEMPLATE@': 'User',
        '@EXTENDS@': {
          'Hostage': null,
          'Address': [] 
        }
      }
    });
    dp.processTemplates();
    expect(dp.template).deep.equals({
      'User': {
        'Name': 'Snow',
        'Age': 12,
        'Nation': 'The North',
        'Address': [
          {
            'Castle': 'The Wall',
            'Region': 'North'
          },
          {
            'Castle': 'WinterFell',
            'Region': 'North'
          }
        ]
      },
      'Address': {
        'Castle': 'WinterFell',
        'Region': 'North'
      },
      'User:NoAddress': {
        'Address': [],
        'Age': 12,
        'Name': 'Snow',
        'Nation': 'The North',
        'Hostage': null
      }
    });
    expect(config.data.template.processed).equals(true);
  });

  afterEach(() => {
    config.data.template.processed = false;
    ld.resetDataTemplates();
  })

});

describe('Data Processing - Data', () => {

  before(() => {
    ld.resetDataTemplates();
    ld.loadDataTemplate({
      'User': {
        Name: 'Snow'
      }
    });
    ld.loadDataTemplate({
      'Users': [
        {
          '@DATA:TEMPLATE@': 'User'
        },
        {
          '@DATA:TEMPLATE@': 'User',
          '@EXTENDS@': {
            Age: 12
          }
        }
      ]
    });
    dp.processTemplates();
  });

  it('processData - empty object', () => {
    let data = {}
    data = dp.processData(data);
    expect(data).deep.equals({});
  });

  it('processData - null', () => {
    let data = null;
    data = dp.processData(data);
    expect(data).to.be.null;
  });

  it('processData - empty string', () => {
    let data = '';
    data = dp.processData(data);
    expect(data).equals('');
  });

  it('processData - non empty string', () => {
    let data = 'Hello';
    data = dp.processData(data);
    expect(data).equals('Hello');
  });

  it('processData - no template', () => {
    let data = {
      Name: 'King',
      Age: 12,
      Country: null
    };
    data = dp.processData(data);
    expect(data).deep.equals({
      Name: 'King',
      Age: 12,
      Country: null
    });
  });

  it('processData - with basic template - object', () => {
    let data = {
      '@DATA:TEMPLATE@': 'User'
    };
    data = dp.processData(data);
    expect(data).deep.equals({
      Name: 'Snow'
    });
  });

  it('processData - with basic template - array', () => {
    let data = {
      '@DATA:TEMPLATE@': 'Users'
    };
    data = dp.processData(data);
    expect(data).deep.equals([
      {
        Name: 'Snow'
      },
      {
        Name: 'Snow',
        Age: 12
      }
    ]);
  });

  it('processData - with basic template with extends - object', () => {
    let data = {
      '@DATA:TEMPLATE@': 'User',
      '@EXTENDS@': {
        Name: 'Stark',
        Address: [
          {
            Street: 'Kings Road'
          }
        ]
      }
    };
    data = dp.processData(data);
    expect(data).deep.equals({
      Name: 'Stark',
      Address: [
        {
          Street: 'Kings Road'
        }
      ]
    });
  });

  // not working as expected for arrays at root
  xit('processData - with basic template & extends - array', () => {
    let data = {
      '@DATA:TEMPLATE@': 'Users',
      '@EXTENDS@': [
        {
          Name: 'Stark'
        }
      ]
    };
    data = dp.processData(data);
    expect(data).deep.equals([
      {
        Name: 'Snow'
      },
      {
        Name: 'Snow',
        Age: 12
      }
    ]);
  });

  after(() => {
    ld.resetDataTemplates();
  });

});