const expect = require('chai').expect;

const dp = require('../../src/helpers/dataProcessor');
const stash = require('../../src/exports/stash');
const handler = require('../../src/exports/handler');
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
    };
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
    stash.addDataTemplate({
      'User_New': {
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
      'User_New': {
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
    expect(stash.getDataTemplate('User_New.Name')).deep.equals('Snow');
  });

  it('processTemplates - template not found', () => {
    stash.addDataTemplate({
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
    stash.addDataTemplate({
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

  it('processTemplates - removes single property', () => {
    stash.addDataTemplate({
      'User': {
        'Name': 'Snow',
        'Address': {
          '@DATA:TEMPLATE@': 'Address',
          '@REMOVES@': ['Zip']
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
          'Street': 'Main'
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

  it('processTemplates - removes multiple properties', () => {
    stash.addDataTemplate({
      'User': {
        'Name': 'Snow',
        'Address': {
          '@DATA:TEMPLATE@': 'Address',
          '@REMOVES@': ['Zip', 'Street']
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
        'Address': {}
      },
      'Address': {
        'Street': 'Main',
        'Zip': '524004'
      }
    });
    expect(config.data.template.enabled).equals(true);
    expect(config.data.template.processed).equals(true);
  });

  it('processTemplates - removes non existing properties', () => {
    stash.addDataTemplate({
      'User': {
        'Name': 'Snow',
        'Address': {
          '@DATA:TEMPLATE@': 'Address',
          '@REMOVES@': ['Zip', 'Street', 'Pin']
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
        'Address': {}
      },
      'Address': {
        'Street': 'Main',
        'Zip': '524004'
      }
    });
    expect(config.data.template.enabled).equals(true);
    expect(config.data.template.processed).equals(true);
  });

  afterEach(() => {
    config.data.template.enabled = false;
    config.data.template.processed = false;
    stash.clearDataTemplates();
  });

});

describe('Data Processing - Templates - Direct Overrides', () => {

  before(() => {
    stash.setDirectOverride(true);
  });

  after(() => {
    stash.setDirectOverride(false);
  });

  afterEach(() => {
    config.data.template.enabled = false;
    config.data.template.processed = false;
    stash.clearDataTemplates();
  });

  it('processTemplates - simple with Overrides', () => {
    stash.addDataTemplate({
      'User': {
        'Name': 'Snow',
        'Address': {
          '@DATA:TEMPLATE@': 'Address',
          'Zip': '524003'
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

  it('processTemplates - complex array of objects with Overrides', () => {
    stash.addDataTemplate({
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
        'Hostage': null,
        'Address': [
          {
            '@DATA:TEMPLATE@': 'Address',
            'Castle': 'The Wall'
          },
          {
            '@DATA:TEMPLATE@': 'Address'
          }
        ]
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

  it('processTemplates - removes and overrides properties', () => {
    stash.addDataTemplate({
      'User': {
        'Name': 'Snow',
        'Address': {
          '@DATA:TEMPLATE@': 'Address',
          '@REMOVES@': ['Zip'],
          'Castle': 'The Wall',
          'Street': 'O Street'
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
          'Castle': 'The Wall',
          'Street': 'O Street'
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

});

describe('Data Processing - Maps', () => {

  it('processMaps - empty map', () => {
    dp.processMaps();
    expect(dp.map).deep.equals({});
    expect(config.data.ref.map.enabled).equals(false);
    expect(config.data.ref.map.processed).equals(true);
  });

  it('processMaps - already processed', () => {
    stash.addDataMap({
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
    stash.addDataMap({
      User: {
        Name: '$M{Users[0].Name}',
        House: '$M{Users[0].House}'
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
    expect(stash.getDataMap('User.Name')).equals('$M{Users[0].Name}');
    expect(stash.getDataMap('Users[0].Name')).equals('Snow');
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
    stash.addDataMap({
      User: {
        'Name': '$M{Defaults.User.Name}',
        'Age': '$M{Defaults.User.Age}',
        'Address': '$M{Defaults.Address[Type=Home]}'
      }
    });
    stash.addDataMap({
      Defaults: {
        'User': {
          'Name': 'Snow',
          'Age': 18
        },
        'Address': [
          {
            'Type': 'Home',
            'Castle': '$M{Defaults.Castle}'
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

  it('processMaps - multiple maps in a single string', () => {
    stash.addDataMap({
      User: {
        FirstName: 'Jon',
        LastName: 'Snow',
        FullName: '$M{User.FirstName} $M{User.LastName}'
      }
    });
    dp.processMaps();
    expect(dp.map).deep.equals({
      User: {
        'FirstName': 'Jon',
        'LastName': 'Snow',
        'FullName': 'Jon Snow'
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
    stash.addDataTemplate({
      'User': {
        Name: 'Snow'
      }
    });
    stash.addDataTemplate({
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
    let data = {};
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
    stash.addDataMap({
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
    stash.addDataMap({
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
    let data = {};
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
      'Name': '$M{User.Name}'
    };
    data = dp.processData(data);
    expect(data).deep.equals({
      Name: 'Snow'
    });
  });

  it('processData - with basic map - array', () => {
    let data = {
      'Address': '$M{Address}'
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
      ]
    });
  });

  after(() => {
    stash.clearDataMaps();
  });

});

describe('Data Processing - Actual Data - Both Templates & Maps', () => {

  before(() => {
    stash.clearDataTemplates();
    stash.clearDataMaps();
    stash.addDataTemplate({
      'User': {
        Name: '$M{User.Name}',
        Age: '$M{User.Age}'
      }
    });
    stash.addDataTemplate({
      'Users': [
        {
          '@DATA:TEMPLATE@': 'User'
        },
        {
          '@DATA:TEMPLATE@': 'User',
          '@OVERRIDES@': {
            Age: 12,
            Education: '$M{Education}'
          }
        }
      ]
    });
    stash.addDataMap({
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

describe('Data Processing - Invalid Data', () => {

  before(() => {
    stash.clearDataTemplates();
    stash.clearDataMaps();
    stash.addDataTemplate({
      'User': {
        Name: '$M{User.Name}',
        Age: '$M{User.Age}'
      }
    });
    dp.processMaps();
    dp.processTemplates();
  });

  it('processData - invalid data template & reference', () => {
    let data = {
      '@DATA:TEMPLATE@': 'NotFound',
      '@OVERRIDES@': {
        Name: '$F{Hello}'
      }
    };
    data = dp.processData(data);
    expect(data).deep.equals({
      '@DATA:TEMPLATE@': 'NotFound',
      '@OVERRIDES@': {
        Name: '$F{Hello}'
      }
    });
  });

  after(() => {
    stash.clearDataTemplates();
    stash.clearDataMaps();
  });

});

describe('Data Processing - Functions', () => {

  it('should return object data', () => {
    handler.addDataFuncHandler('GetFirstName', () => {
      return { user: 'jon' }
    });
    const data = dp.processData('$F{GetFirstName}');
    expect(data).deep.equals({ user: 'jon' });
  });

  it('should return data with plane data map patterns', () => {
    handler.addDataFuncHandler('GetFirstName', () => {
      return '$M{User.FirstName}'
    })
    stash.addDataMap({
      User: {
        FirstName: 'Jon'
      }
    });
    dp.processMaps();
    const data = dp.processData('$F{GetFirstName}');
    expect(data).deep.equals('Jon');
  });

  it('should return data with data map patterns inside object', () => {
    handler.addDataFuncHandler('GetFirstName', () => {
      return { name: '$M{User.FirstName}' }
    })
    stash.addDataMap({
      User: {
        FirstName: 'Jon'
      }
    });
    dp.processMaps();
    const data = dp.processData('$F{GetFirstName}');
    expect(data).deep.equals({ name: 'Jon' });
  });

  it('should return data passed in as parameter', () => {
    handler.addDataFuncHandler('GetParam', (ctx) => {
      return ctx.args[0]
    });

    const data = dp.processData('$F{GetParam:Jon}');
    expect(data).equals('Jon');
  });

  it('should return data passed in as parameter with semicolon', () => {
    handler.addDataFuncHandler('GetParam', (ctx) => {
      return ctx.args[0]
    });

    const data = dp.processData('$F{GetParam:Jon:Doe}');
    expect(data).equals('Jon:Doe');
  });

  afterEach(() => {
    config.data.ref.map.enabled = false;
    config.data.ref.map.processed = false;
    stash.clearDataMaps();
  });

});