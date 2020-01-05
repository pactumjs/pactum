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