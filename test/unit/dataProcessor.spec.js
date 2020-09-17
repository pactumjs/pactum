const expect = require('chai').expect;

const dp = require('../../src/helpers/dataProcessor');
const stash = require('../../src/exports/stash');
const config = require('../../src/config');

describe('Data Processing - Templates', () => {

  it('processTemplates - empty template', () => {
    config.data.template.processed = false;
    dp.processTemplates();
    expect(dp.template).deep.equals({});
    expect(config.data.template.enabled).equals(false);
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

  it('processTemplates - simple with Overrides', () => {
    stash.loadDataTemplates({
      'User': {
        'Name': 'Snow',
        'Address': {
          '@DATA:TEMPLATE@': 'Address',
          '@OVERRIDES@': {
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
    expect(config.data.template.enabled).equals(true);
    expect(config.data.template.processed).equals(true);
  });

  it('processTemplates - template not found', () => {
    stash.loadDataTemplates({
      'User': {
        'Name': 'Snow',
        'Address': {
          '@DATA:TEMPLATE@': 'Address_Not_Found'
        }
      }
    });
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

  it('processTemplates - complex array of objects with Overrides', () => {
    stash.loadDataTemplates({
      'User': {
        'Name': 'Snow',
        'Age': 12,
        'Nation': 'The North',
        'Address': []
      },
      'Address': {
        'Castle': 'WinterFell',
        'Region': 'North'
      },
      'User:Address': {
        '@DATA:TEMPLATE@': 'User',
        '@OVERRIDES@': {
          'Hostage': null,
          'Address': [
            {
              '@DATA:TEMPLATE@': 'Address',
              '@OVERRIDES@': {
                'Castle': 'The Wall'
              }
            },
            {
              '@DATA:TEMPLATE@': 'Address'
            }
          ]
        }
      }
    });
    dp.processTemplates();
    expect(dp.template).deep.equals({
      'User': {
        'Name': 'Snow',
        'Age': 12,
        'Nation': 'The North',
        'Address': []
      },
      'Address': {
        'Castle': 'WinterFell',
        'Region': 'North'
      },
      'User:Address': {
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
        ,
        'Age': 12,
        'Name': 'Snow',
        'Nation': 'The North',
        'Hostage': null
      }
    });
    expect(config.data.template.processed).equals(true);
  });

  afterEach(() => {
    config.data.template.enabled = false;
    config.data.template.processed = false;
    stash.clearDataTemplates();
  });

});

describe('Data Processing - Maps', () => {

  it('processMaps - empty map', () => {
    dp.processMaps();
    expect(dp.map).deep.equals({});
    expect(config.data.ref.map.enabled).equals(false);
    expect(config.data.ref.map.processed).equals(true);
  });

  it('processMaps - already processed', () => {
    stash.loadDataMaps({
      Users: [
        {
          Name: 'Snow',
          House: 'Stark'
        }
      ]
    });
    config.data.ref.map.processed = true;
    dp.processMaps();
    expect(dp.map).deep.equals({});
    expect(config.data.ref.map.enabled).equals(false);
    expect(config.data.ref.map.processed).equals(true);
  });

  it('processMaps - with basic data map', () => {
    stash.loadDataMaps({
      User: {
        Name: '@DATA:MAP::Users[0].Name@',
        House: '@DATA:MAP::Users[0].House@'
      },
      Users: [
        {
          Name: 'Snow',
          House: 'Stark'
        },
        {
          Name: 'Sand',
          House: 'Martel'
        }
      ]
    });
    dp.processMaps();
    expect(dp.map).deep.equals({
      User: {
        Name: 'Snow',
        House: 'Stark'
      },
      Users: [
        {
          Name: 'Snow',
          House: 'Stark'
        },
        {
          Name: 'Sand',
          House: 'Martel'
        }
      ]
    });
    expect(config.data.ref.map.enabled).equals(true);
    expect(config.data.ref.map.processed).equals(true);
  });

  it('processMaps - complex array of objects', () => {
    stash.loadDataMaps({
        User: {
          'Name': '@DATA:MAP::Defaults.User.Name@',
          'Age': '@DATA:MAP::Defaults.User.Age@',
          'Address': '@DATA:MAP::Defaults.Address[Type=Home]@'
        }
      });
    stash.loadDataMaps({
        Defaults: {
          'User': {
            'Name': 'Snow',
            'Age': 18
          },
          'Address': [
            {
              'Type': 'Home',
              'Castle': '@DATA:MAP::Defaults.Castle@'
            },
            {
              'Type': 'Work',
              'Castle': 'Castle Black'
            }
          ],
          'Castle': 'WinterFell'
        }
      });
    dp.processMaps();
    expect(dp.map).deep.equals({
      User: {
        'Name': 'Snow',
        'Age': 18,
        'Address': {
          'Type': 'Home',
          'Castle': 'WinterFell'
        }
      },
      Defaults: {
        'User': {
          'Name': 'Snow',
          'Age': 18
        },
        'Address': [
          {
            'Type': 'Home',
            'Castle': 'WinterFell'
          },
          {
            'Type': 'Work',
            'Castle': 'Castle Black'
          }
        ],
        'Castle': 'WinterFell'
      }
    });
  });

  afterEach(() => {
    config.data.ref.map.enabled = false;
    config.data.ref.map.processed = false;
    stash.clearDataMaps();
  });

});

describe('Data Processing - Actual Data - Only Templates', () => {

  before(() => {
    stash.clearDataTemplates();
    stash.loadDataTemplates({
      'User': {
        Name: 'Snow'
      }
    });
    stash.loadDataTemplates({
      'Users': [
        {
          '@DATA:TEMPLATE@': 'User'
        },
        {
          '@DATA:TEMPLATE@': 'User',
          '@OVERRIDES@': {
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

  it('processData - with basic template with overrides - object', () => {
    let data = {
      '@DATA:TEMPLATE@': 'User',
      '@OVERRIDES@': {
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

  it('processData - with basic template & overrides - array', () => {
    let data = {
      '@DATA:TEMPLATE@': 'Users',
      '@OVERRIDES@': [
        {
          Name: 'Stark'
        }
      ]
    };
    data = dp.processData(data);
    expect(data).deep.equals([
      {
        Name: 'Stark'
      },
      {
        Name: 'Snow',
        Age: 12
      }
    ]);
  });

  after(() => {
    stash.clearDataTemplates();
  });

});

describe('Data Processing - Actual Data - Only Maps', () => {

  before(() => {
    stash.clearDataMaps();
    stash.loadDataMaps({
      User: {
        Name: 'Snow',
        Age: 18
      },
      Education: {
        Degree: 'Black Brother',
        Passed: true,
        Year: 2020
      }
    });
    stash.loadDataMaps({
      Address: [
        {
          'Type': 'Home',
          'Castle': 'WinterFell'
        },
        {
          'Type': 'Work',
          'Castle': 'Castle Black'
        }
      ]
    });
    dp.processMaps();
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

  it('processData - no map', () => {
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

  it('processData - with basic map - object', () => {
    let data = {
      'Name': '@DATA:MAP::User.Name@'
    };
    data = dp.processData(data);
    expect(data).deep.equals({
      Name: 'Snow'
    });
  });

  it('processData - with basic map - array', () => {
    let data = {
      'Address': '@DATA:MAP::Address@'
    };
    data = dp.processData(data);
    expect(data).deep.equals({
      Address: [
        {
          'Type': 'Home',
          'Castle': 'WinterFell'
        },
        {
          'Type': 'Work',
          'Castle': 'Castle Black'
        }
      ]});
  });

  after(() => {
    stash.clearDataMaps();
  });

});

describe('Data Processing - Actual Data - Both Templates & Maps', () => {

  before(() => {
    stash.clearDataTemplates();
    stash.clearDataMaps();
    stash.loadDataTemplates({
      'User': {
        Name: '@DATA:MAP::User.Name@',
        Age: '@DATA:MAP::User.Age@'
      }
    });
    stash.loadDataTemplates({
      'Users': [
        {
          '@DATA:TEMPLATE@': 'User'
        },
        {
          '@DATA:TEMPLATE@': 'User',
          '@OVERRIDES@': {
            Age: 12,
            Education: '@DATA:MAP::Education@'
          }
        }
      ]
    });
    stash.loadDataMaps({
      User: {
        Name: 'Snow',
        Age: 18
      },
      Education: {
        Degree: 'Black Brother',
        Passed: true,
        Year: 2020
      }
    });
    dp.processMaps();
    dp.processTemplates();
  });

  it('processData - with basic template with overrides - object', () => {
    let data = {
      '@DATA:TEMPLATE@': 'User',
      '@OVERRIDES@': {
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
      Age: 18,
      Address: [
        {
          Street: 'Kings Road'
        }
      ]
    });
  });

  it('processData - with basic template & overrides - array', () => {
    let data = {
      '@DATA:TEMPLATE@': 'Users',
      '@OVERRIDES@': [
        {
          Name: 'Stark'
        }
      ]
    };
    data = dp.processData(data);
    expect(data).deep.equals([
      {
        Name: 'Stark',
        Age: 18
      },
      {
        Name: 'Snow',
        Age: 12,
        Education: {
          Degree: 'Black Brother',
          Passed: true,
          Year: 2020
        }
      }
    ]);
  });

  after(() => {
    stash.clearDataTemplates();
    stash.clearDataMaps();
  });

});