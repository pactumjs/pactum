const expect = require('chai').expect;
const helper = require('../../src/helpers/helper');
const Matcher = require('../../src/models/matcher');

const matcher = new Matcher();
const { like, term, eachLike } = matcher;

describe('helper - setValueFromMatcher', () => {

  it('string', () => {
    let data = 'hello';
    data = helper.setValueFromMatcher(data);
    expect(data).equals('hello');
  });

  it('number', () => {
    let data = 10;
    data = helper.setValueFromMatcher(data);
    expect(data).equals(10);
  });

  it('boolean', () => {
    let data = true;
    data = helper.setValueFromMatcher(data);
    expect(data).equals(true);
  });

  it('array - one string', () => {
    let data = ['hello'];
    data = helper.setValueFromMatcher(data);
    expect(data).deep.equals(['hello']);
  });

  it('array - multiple strings', () => {
    let data = ['hello', 'world'];
    data = helper.setValueFromMatcher(data);
    expect(data).deep.equals(['hello', 'world']);
  });

  it('object', () => {
    let data = {
      id: 1,
      name: 'fake',
      married: false
    };
    data = helper.setValueFromMatcher(data);
    expect(data).deep.equals({
      id: 1,
      name: 'fake',
      married: false
    });
  });

  it('object with array of strings', () => {
    let data = {
      id: 1,
      name: 'fake',
      married: false,
      books: ['Harry Potter', 'Narnia']
    };
    data = helper.setValueFromMatcher(data);
    expect(data).deep.equals({
      id: 1,
      name: 'fake',
      married: false,
      books: ['Harry Potter', 'Narnia']
    });
  });

  it('object with array of objects', () => {
    let data = {
      id: 1,
      name: 'fake',
      married: false,
      books: [
        {
          author: 'JK',
          name: 'Harry Potter'
        },
        {
          author: 'RR',
          name: 'Song of Ice & Fire'
        }
      ]
    };
    data = helper.setValueFromMatcher(data);
    expect(data).deep.equals({
      id: 1,
      name: 'fake',
      married: false,
      books: [
        {
          author: 'JK',
          name: 'Harry Potter'
        },
        {
          author: 'RR',
          name: 'Song of Ice & Fire'
        }
      ]
    });
  });

  it('array of objects', () => {
    let data = [
      {
        id: 1,
        name: 'fake',
        married: false,
        books: [
          {
            author: 'JK',
            name: 'Harry Potter'
          },
          {
            author: 'RR',
            name: 'Song of Ice & Fire'
          }
        ]
      },
      {
        id: 2,
        name: 'hunt',
        married: true,
        books: [
          {
            author: 'JK',
            name: 'Harry Potter - Secret'
          },
          {
            author: 'RR',
            name: 'Dance With Dragons'
          }
        ]
      }
    ];
    data = helper.setValueFromMatcher(data);
    expect(data).deep.equals([
      {
        id: 1,
        name: 'fake',
        married: false,
        books: [
          {
            author: 'JK',
            name: 'Harry Potter'
          },
          {
            author: 'RR',
            name: 'Song of Ice & Fire'
          }
        ]
      },
      {
        id: 2,
        name: 'hunt',
        married: true,
        books: [
          {
            author: 'JK',
            name: 'Harry Potter - Secret'
          },
          {
            author: 'RR',
            name: 'Dance With Dragons'
          }
        ]
      }
    ]);
  });

  it('like', () => {
    let data = like('hello');
    data = helper.setValueFromMatcher(data);
    expect(data).equals('hello');
  });

  it('term', () => {
    let data = term({ matcher: 's', generate: 'hello' });
    data = helper.setValueFromMatcher(data);
    expect(data).equals('hello');
  });

  it('each like', () => {
    let data = eachLike('hello');
    data = helper.setValueFromMatcher(data);
    expect(data).deep.equals(['hello']);
  });

  it('eachLike', () => {
    let data = eachLike({
      id: 1,
      items: eachLike({
        name: 'burger',
        quantity: 2,
        value: 100
      }),
    })
    data = helper.setValueFromMatcher(data);
    expect(data).deep.equals([{
      id: 1,
      items: [{
        name: 'burger',
        quantity: 2,
        value: 100
      }]
    }]);
  });

  it('matchers mix', () => {
    let data = eachLike({
      id: 1,
      name: like('fake'),
      items: eachLike({
        name: term({
          matcher: 'burger|pizza',
          generate: 'burger'
        }),
        quantity: like(2),
        value: 100
      }),
    })
    data = helper.setValueFromMatcher(data);
    expect(data).deep.equals([{
      id: 1,
      name: 'fake',
      items: [{
        name: 'burger',
        quantity: 2,
        value: 100
      }]
    }]);
  });

});


describe('helper - setMatchingRules', () => {

  it('object', () => {
    const data = {
      id: {
        contents: '1',
        value: '1',
        json_class: "Pact::SomethingLike"
      },
      name: 'fake',
      gender: {
        data: {
          generate: 'M',
          matcher: {
            json_class: "Regexp",
            o: 0,
            s: 'M|F',
          },
        },
        value: 'M',
        json_class: "Pact::Term"
      },
      grades: {
        physics: 60,
        maths: {
          contents: 100,
          value: 100,
          json_class: "Pact::SomethingLike"
        },
        sciences: {
          chemistry: 45,
          biology: {
            data: {
              generate: 'M',
              matcher: {
                json_class: "Regexp",
                o: 0,
                s: 'M|F',
              },
            },
            value: 'M',
            json_class: "Pact::Term"
          }
        }
      },
      items: {
        contents: '1',
        value: [1],
        json_class: "Pact::ArrayLike",
        min: 1,
      },
      components: {
        value: [{
          id: {
            contents: '1',
            value: '1',
            json_class: "Pact::SomethingLike"
          },
          name: 'fake'
        }],
        json_class: "Pact::ArrayLike",
        min: 1,
      }
    }
    const mm = {}
    helper.setMatchingRules(mm, data, '$.body');
    expect(mm).deep.equals({
      '$.body.id': { match: 'type' },
      '$.body.gender': { match: 'regex', regex: 'M|F' },
      '$.body.grades.maths': { match: 'type' },
      '$.body.grades.sciences.biology': { match: 'regex', regex: 'M|F' },
      '$.body.items': { min: 1 },
      '$.body.items[*].*': { match: 'type' },
      '$.body.components': { min: 1 },
      '$.body.components[*].*': { match: 'type' },
      '$.body.components[*].id': { match: 'type' }
    });
  });

  it('object - like', () => {
    const data = {
      contents: '1',
      value: '1',
      json_class: "Pact::SomethingLike"
    }
    const mm = {}
    helper.setMatchingRules(mm, data, '$.body');
    expect(mm).deep.equals({
      '$.body': { match: 'type' }
    });
  });

  it('object - term', () => {
    const data =  {
      data: {
        generate: 'M',
        matcher: {
          json_class: "Regexp",
          o: 0,
          s: 'M|F',
        },
      },
      value: 'M',
      json_class: "Pact::Term"
    }
    const mm = {}
    helper.setMatchingRules(mm, data, '$.body');
    expect(mm).deep.equals({
      '$.body': { match: 'regex', regex: 'M|F' }
    });
  });

  it('object - like array', () => {
    const data = {
      value: [{
        id: {
          contents: '1',
          value: '1',
          json_class: "Pact::SomethingLike"
        },
        name: 'fake'
      }],
      json_class: "Pact::ArrayLike",
      min: 1
    }
    const mm = {}
    helper.setMatchingRules(mm, data, '$.body');
    expect(mm).deep.equals({
      '$.body': { min: 1 },
      '$.body[*].*': { match: 'type' },
      '$.body[*].id': { match: 'type' }
    });
  });

  it('array', () => {
    const data = [{
      contents: 100,
      value: 100,
      json_class: "Pact::SomethingLike"
    }];
    const mm = {}
    helper.setMatchingRules(mm, data, '$.body');
    expect(mm).deep.equals({
      '$.body.[*]': { match: 'type' }
    });
  })

});