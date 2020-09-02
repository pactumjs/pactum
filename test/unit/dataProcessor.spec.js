const expect = require('chai').expect;

const dp = require('../../src/helpers/dataProcessor');
const ld = require('../../src/exports/loader');
const config = require('../../src/config');

describe('Data Processing - Processing Templates', () => {

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
    ld.resetDataTemplate();
  })

});