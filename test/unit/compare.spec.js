const expect = require('chai').expect;
const Compare = require('../../src/helpers/compare');
const handler = require('../../src/exports/handler');
const settings = require('../../src/exports/settings');

describe('JSON Like - Object - Equal Properties', () => {

  it('object equals - empty', () => {
    const actual = {};
    const expected = {};
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('object equals - different types of properties', () => {
    const actual = {
      id: 1,
      name: 'bob',
      minor: true,
      any: null,
      age: 8
    };
    const expected = {
      id: 1,
      name: 'bob',
      minor: true,
      any: null,
      age: /\d+/
    };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('object not equals - one property - number', () => {
    const actual = {
      id: 1
    };
    const expected = {
      id: 2
    };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value '2' at '$.id' but found '1'`);
  });

  it('object not equals - one property - different types', () => {
    const actual = {
      id: 1
    };
    const expected = {
      id: '1'
    };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have type 'string' at '$.id' but found 'number'`);
  });

  it('object not equals - different types - actual array', () => {
    const actual = [{ id: 1 }];
    const expected = {
      id: '1'
    };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have type 'object' at '$' but found 'array'`);
  });

  it('object not equals - different types - expected array', () => {
    const expected = [{ id: 1 }];
    const actual = {
      id: '1'
    };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have type 'array' at '$' but found 'object'`);
  });

  it('object not equals - one property - string', () => {
    const actual = {
      id: "1"
    };
    const expected = {
      id: "2"
    };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value '2' at '$.id' but found '1'`);
  });

  it('object not equals - one property - boolean', () => {
    const actual = {
      id: false
    };
    const expected = {
      id: true
    };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value 'true' at '$.id' but found 'false'`);
  });

  it('object not equals - one property - null', () => {
    const actual = {
      id: {}
    };
    const expected = {
      id: null
    };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).contains(`Json doesn't have value 'null' at '$.id' but found`);
  });

  it('object not equals - one property - RegEx', () => {
    const actual = {
      id: 1
    };
    const expected = {
      id: /\W+/
    };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't match with '/\\W+/' at '$.id' but found '1'`);
  });

  it('object not equals - multiple properties', () => {
    const actual = {
      id: 1,
      name: 'hunt'
    };
    const expected = {
      id: 1,
      name: 'bent'
    };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value 'bent' at '$.name' but found 'hunt'`);
  });

  it('nested objects equals - multiple properties', () => {
    const actual = {
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80,
        sciences: {
          physics: 40,
          chemistry: 45
        }
      }
    };
    const expected = {
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80,
        sciences: {
          physics: 40,
          chemistry: 45
        }
      }
    };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('nested objects not equals - multiple properties', () => {
    const actual = {
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80,
        sciences: {
          physics: 40,
          chemistry: 45
        }
      }
    };
    const expected = {
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80,
        sciences: {
          physics: 50,
          chemistry: 45
        }
      }
    };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value '50' at '$.scores.sciences.physics' but found '40'`);
  });

});

describe('JSON Like - Object - Extra Properties', () => {

  it('object not equals - one property', () => {
    const actual = {
      id: "1"
    };
    const expected = {
      name: "2"
    };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have property 'name' at '$'`);
  });

  it('object equals - multiple properties', () => {
    const actual = {
      id: 1,
      name: 'hunt'
    };
    const expected = {
      id: 1
    };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('object not equals - multiple properties', () => {
    const actual = {
      id: 1,
      name: 'hunt'
    };
    const expected = {
      id: 1,
      age: 26
    };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have property 'age' at '$'`);
  });

  it('nested object equals - multiple properties', () => {
    const actual = {
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80
      }
    };
    const expected = {
      name: 'hunt',
      scores: {
        social: 80,
      }
    };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('nested object not equals - multiple properties', () => {
    const actual = {
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80
      }
    };
    const expected = {
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80,
        art: 12
      }
    };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have property 'art' at '$.scores'`);
  });

  it('nested objects equals - multiple properties', () => {
    const actual = {
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80,
        sciences: {
          physics: 40,
          chemistry: 45
        }
      }
    };
    const expected = {
      name: 'hunt',
      scores: {
        social: 80,
        sciences: {
          physics: 40
        }
      }
    };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('nested objects not equals - multiple properties', () => {
    const actual = {
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80,
        sciences: {
          physics: 40,
          chemistry: 45
        }
      }
    };
    const expected = {
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80,
        sciences: {
          physics: 40,
          chemistry: 45,
          biology: 21
        }
      }
    };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have property 'biology' at '$.scores.sciences'`);
  });

});

describe('JSON Like - Array', () => {

  it('array equals - empty', () => {
    const actual = [];
    const expected = [];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('array equals - one item - number', () => {
    const actual = [1];
    const expected = [1];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('array not equals - one item - number', () => {
    const actual = [1];
    const expected = [2];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value '2' at '$[0]' but found '1'`);
  });

  it('array equals - multiple items - number', () => {
    const actual = [1, 2, 3];
    const expected = [1, 2, 3];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('array equals - multiple items (reverse order) - number', () => {
    const actual = [1, 2, 3];
    const expected = [3, 2, 1];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('array not equals - multiple expected items', () => {
    const actual = [1];
    const expected = [2, 3];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have 'array' with length '2' at '$' but found 'array' with length '1'`);
  });

  it('array not equals - multiple actual items', () => {
    const actual = [1, 4];
    const expected = [2, 3];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value '2' at '$[0]' but found '1'`);
  });

  it('array not equals - multiple actual items - last item doesn\'t match', () => {
    const actual = [1, 4];
    const expected = [1, 3];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value '3' at '$[1]' but found '4'`);
  });

  it('nested array equals - multiple items - number', () => {
    const actual = [[1, 2], [2, 4]];
    const expected = [[1, 2], [2, 4]];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('nested array equals - multiple items (reverse) - number', () => {
    const actual = [[1, 2], [2, 4]];
    const expected = [[2, 4], [1, 2]];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('nested array not equals - multiple items - number', () => {
    const actual = [[1, 2], [2, 4]];
    const expected = [[1, 2], [3, 5]];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value '3' at '$[1][0]' but found '2'`);
  });

  it('nested array not equals - multiple actual items - number', () => {
    const actual = [[1, 2], [2, 4], [3, 4]];
    const expected = [[1, 2], [3, 5]];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value '3' at '$[1][0]' but found '2'`);
  });

  it('array equals - multiple expected items - number', () => {
    const actual = [1, 2, 3, 2];
    const expected = [2, 2];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('array not equals - multiple expected items - number', () => {
    const actual = [1, 2, 3];
    const expected = [2, 2];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have expected value at '$[1]'`);
  });

});

describe('JSON Like Array of Objects', () => {

  it('equals - empty arrays', () => {
    const actual = [{}];
    const expected = [{}];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('equals - empty expected array', () => {
    const actual = [{
      id: 1
    }];
    const expected = [{}];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('equals - array of one object with one property', () => {
    const actual = [{
      id: 1
    }];
    const expected = [{
      id: 1
    }];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('not equals - array of one object with one property', () => {
    const actual = [{
      id: 1
    }];
    const expected = [{
      id: 2
    }];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value '2' at '$[0].id' but found '1'`);
  });

  it('equals - array of one object with multiple properties', () => {
    const actual = [{
      id: 1,
      name: 'hunt'
    }];
    const expected = [{
      id: 1,
      name: 'hunt'
    }];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('not equals - array of one object with multiple properties', () => {
    const actual = [{
      id: 1,
      name: 'hunt'
    }];
    const expected = [{
      id: 1,
      name: 'bent'
    }];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value 'bent' at '$[0].name' but found 'hunt'`);
  });

  it('equals - array of one nested object', () => {
    const actual = [{
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80
      }
    }];
    const expected = [{
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80
      }
    }];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('not equals - array of one nested object', () => {
    const actual = [{
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80
      }
    }];
    const expected = [{
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 70
      }
    }];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value '70' at '$[0].scores.social' but found '80'`);
  });

  it('equals - array of one with nested objects', () => {
    const actual = [{
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80,
        sciences: {
          physics: 40,
          chemistry: 45
        }
      }
    }];
    const expected = [{
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80,
        sciences: {
          physics: 40,
          chemistry: 45
        }
      }
    }];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('not equals - array of one with nested objects', () => {
    const actual = [{
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80,
        sciences: {
          physics: 40,
          chemistry: 45
        }
      }
    }];
    const expected = [{
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80,
        sciences: {
          physics: 30,
          chemistry: 45
        }
      }
    }];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value '30' at '$[0].scores.sciences.physics' but found '40'`);
  });

  it('equals - array of one with nested objects & array of numbers', () => {
    const actual = [{
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80,
        sciences: {
          physics: 40,
          chemistry: 45
        },
        languages: [21, 22]
      }
    }];
    const expected = [{
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80,
        sciences: {
          physics: 40,
          chemistry: 45
        },
        languages: [21, 22]
      }
    }];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('not equals - array of one with nested objects & array of numbers', () => {
    const actual = [{
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80,
        sciences: {
          physics: 40,
          chemistry: 45
        },
        languages: [21, 22]
      }
    }];
    const expected = [{
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80,
        sciences: {
          physics: 40,
          chemistry: 45
        },
        languages: [20, 22]
      }
    }];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value '20' at '$[0].scores.languages[0]' but found '21'`);
  });

  it('equals - array of one with nested objects & array of objects', () => {
    const actual = [{
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80,
        sciences: {
          physics: 40,
          chemistry: 45
        },
        languages: [
          {
            english: 44,
            telugu: 49
          },
          {
            english: 42,
            telugu: 50
          }
        ]
      }
    }];
    const expected = [{
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80,
        sciences: {
          physics: 40,
          chemistry: 45
        },
        languages: [
          {
            english: 44,
            telugu: 49
          },
          {
            english: 42,
            telugu: 50
          }
        ]
      }
    }];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('not equals - array of one with nested objects & array of objects', () => {
    const actual = [{
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80,
        sciences: {
          physics: 40,
          chemistry: 45
        },
        languages: [
          {
            english: 44,
            telugu: 49
          },
          {
            english: 42,
            telugu: 50
          }
        ]
      }
    }];
    const expected = [{
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80,
        sciences: {
          physics: 40,
          chemistry: 45
        },
        languages: [
          {
            english: 44,
            telugu: 49
          },
          {
            english: 41,
            telugu: 50
          }
        ]
      }
    }];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value '41' at '$[0].scores.languages[1].english' but found '42'`);
  });

  it('equals - array of multiple with nested objects & array of objects', () => {
    const actual = [
      {
        id: 1,
        name: 'hunt',
        scores: {
          maths: 90,
          social: 80,
          sciences: {
            physics: 40,
            chemistry: 45
          },
          languages: [
            {
              english: 44,
              telugu: 49
            },
            {
              english: 42,
              telugu: 50
            }
          ]
        }
      },
      {
        id: 2,
        name: 'bent',
        scores: {
          maths: 99,
          social: 60,
          sciences: {
            physics: 49,
            chemistry: 46
          },
          languages: [
            {
              english: 43,
              telugu: 42
            },
            {
              english: 41,
              telugu: 40
            }
          ]
        }
      }
    ];
    const expected = [{
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80,
        sciences: {
          physics: 40,
          chemistry: 45
        },
        languages: [
          {
            english: 44,
            telugu: 49
          },
          {
            english: 42,
            telugu: 50
          }
        ]
      }
    }];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('equals - array of multiple with nested objects & array of objects - trimmed expected', () => {
    const actual = [
      {
        id: 1,
        name: 'hunt',
        scores: {
          maths: 90,
          social: 80,
          sciences: {
            physics: 40,
            chemistry: 45
          },
          languages: [
            {
              english: 44,
              telugu: 49
            },
            {
              english: 42,
              telugu: 50
            }
          ]
        }
      },
      {
        id: 2,
        name: 'bent',
        scores: {
          maths: 99,
          social: 60,
          sciences: {
            physics: 49,
            chemistry: 46
          },
          languages: [
            {
              english: 43,
              telugu: 42
            },
            {
              english: 41,
              telugu: 40
            }
          ]
        }
      }
    ];
    const expected = [
      {
        id: 1,
        name: 'hunt',
        scores: {
          maths: 90,
          social: 80,
          sciences: {
            physics: 40,
            chemistry: 45
          },
          languages: [
            {
              english: 44,
              telugu: 49
            },
            {
              english: 42,
              telugu: 50
            }
          ]
        }
      },
      {
        id: 2,
        name: 'bent',
        scores: {
          social: 60,
          sciences: {
            chemistry: 46
          },
          languages: [
            {
              english: 43,
            },
            {
              telugu: 40
            }
          ]
        }
      }
    ];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('not equals - array of multiple with nested objects & array of objects - trimmed expected', () => {
    const actual = [
      {
        id: 1,
        name: 'hunt',
        scores: {
          maths: 90,
          social: 80,
          sciences: {
            physics: 40,
            chemistry: 45
          },
          languages: [
            {
              english: 44,
              telugu: 49
            },
            {
              english: 42,
              telugu: 50
            }
          ]
        }
      },
      {
        id: 2,
        name: 'bent',
        scores: {
          maths: 99,
          social: 60,
          sciences: {
            physics: 49,
            chemistry: 46
          },
          languages: [
            {
              english: 43,
              telugu: 42
            },
            {
              english: 41,
              telugu: 40
            }
          ]
        }
      }
    ];
    const expected = [
      {
        id: 1,
        name: 'hunt',
        scores: {
          maths: 90,
          social: 80,
          sciences: {
            physics: 40,
            chemistry: 45
          },
          languages: [
            {
              english: 44,
              telugu: 49
            },
            {
              english: 42,
              telugu: 50
            }
          ]
        }
      },
      {
        id: 2,
        name: 'bent',
        scores: {
          social: 60,
          sciences: {
            chemistry: 46
          },
          languages: [
            {
              english: 42,
            },
            {
              telugu: 40
            }
          ]
        }
      }
    ];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value '42' at '$[1].scores.languages[0].english' but found '43'`);
  });

  it('equals - different order', () => {
    const actual = [
      {
        id: 1
      },
      {
        id: 2
      },
      {
        id: 3
      },
      {
        id: 4
      },
      {
        id: 5
      },
      {
        id: 6
      }
    ];
    const expected = [
      {
        id: 4
      },
      {
        id: 3
      },
      {
        id: 5
      },
      {
        id: 6
      },
      {
        id: 2
      },
      {
        id: 1
      }
    ];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('not equals - different order', () => {
    const actual = [
      {
        id: 1
      },
      {
        id: 2
      },
      {
        id: 3
      },
      {
        id: 4
      }
    ];
    const expected = [
      {
        id: 4
      },
      {
        id: 3
      },
      {
        id: 1
      },
      {
        id: 1
      }
    ];
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have expected value at '$[3]'`);
  });

});

describe('JSON Like - Assert Expressions', () => {

  it('object fulfil simple expression', () => {
    const actual = { id: 1 };
    const expected = { id: '$V === 1'};
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('object does not fulfil simple expression', () => {
    const actual = { id: 1 };
    const expected = { id: '$V > 1'};
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't fulfil expression '$.id > 1'`);
  });

  it('array fulfil simple expression', () => {
    const actual = [{ id: 1 }];
    const expected = '$V.length === 1';
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('array does not fulfil simple expression', () => {
    const actual = [{ id: 1 }];
    const expected = '$V.length > 1';
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't fulfil expression '$.length > 1'`);
  });

  it('object fulfil complex expression', () => {
    const actual = { id: 1, marks: { maths: 70 } };
    const expected = { id: 1, marks: { maths: '$V > 50' } };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('object does not fulfil complex expression', () => {
    const actual = { id: 1, marks: { maths: 70 } };
    const expected = { id: 1, marks: { maths: '$V > 80' } };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't fulfil expression '$.marks.maths > 80'`);
  });

  it('object fulfil simple custom includes expression', () => {
    settings.setAssertExpressionIncludes('$');
    const actual = { id: 1 };
    const expected = { id: '$ === 1'};
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  afterEach(() => {
    settings.setAssertExpressionIncludes('$V');
  });

});

describe('JSON Like - Assert Handlers', () => {

  before(() => {
    handler.addAssertHandler('number', (ctx) => {
      return typeof ctx.data === 'number';
    });
    handler.addAssertHandler('type', (ctx) => {
      return typeof ctx.data === ctx.args[0];
    });
  });

  it('object fulfil simple assert', () => {
    const actual = { id: 1 };
    const expected = { id: '#number'};
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('object does not fulfil simple assert', () => {
    const actual = { id: '1' };
    const expected = { id: '#number'};
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't fulfil assertion '#number' at '$.id'`);
  });

  it('object fulfil simple assert with args', () => {
    const actual = { id: 1 };
    const expected = { id: '#type:number'};
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('simple assert does not exist', () => {
    const actual = { id: '1' };
    const expected = { id: '#number py'};
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value '#number py' at '$.id' but found '1'`);
  });

  it('object fulfil simple custom starts with assert', () => {
    settings.setAssertHandlerStartsWith('#$');
    const actual = { id: 1 };
    const expected = { id: '#$number'};
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  afterEach(() => {
    settings.setAssertHandlerStartsWith('#');
  });

});

describe('JSON Match - Object - no matching rules', () => {

  before(() => {
    this.compare = new Compare();
  });

  it('empty objects', () => {
    const actual = {};
    const expected = {};
    const matchingRules = {};
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('empty expected', () => {
    const actual = {
      id: 1
    };
    const expected = {};
    const matchingRules = {};
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('objects equal - one property', () => {
    const actual = {
      id: 1
    };
    const expected = {
      id: 1
    };
    const matchingRules = {};
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('objects not equal type - one property', () => {
    const actual = {
      id: 1
    };
    const expected = {
      id: '1'
    };
    const matchingRules = {};
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have type "string" at "$.body.id" but found "number"`);
  });

  it('objects not equal - one property', () => {
    const actual = {
      id: 1
    };
    const expected = {
      id: 12
    };
    const matchingRules = {};
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value "12" at "$.body.id" but found "1"`);
  });

  it('objects not equal - one different property', () => {
    const actual = {
      id: 1
    };
    const expected = {
      typeId: 1
    };
    const matchingRules = {};
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have "typeId" at "$.body"`);
  });

  it('objects equal - multiple properties', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: false
    };
    const expected = {
      id: 1,
      name: 'Fake',
      married: false
    };
    const matchingRules = {};
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('objects not equal type - multiple properties', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: 'false'
    };
    const expected = {
      id: 1,
      name: 'Fake',
      married: false
    };
    const matchingRules = {};
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have type "boolean" at "$.body.married" but found "string"`);
  });

  it('objects not equal - boolean - multiple properties', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: true
    };
    const expected = {
      id: 1,
      name: 'Fake',
      married: false
    };
    const matchingRules = {};
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value "false" at "$.body.married" but found "true"`);
  });

  it('objects not equal - string - multiple properties', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: true
    };
    const expected = {
      id: 1,
      name: 'Bake',
      married: true
    };
    const matchingRules = {};
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value "Bake" at "$.body.name" but found "Fake"`);
  });

  it('objects with multiple properties not equal - one different property ', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: true
    };
    const expected = {
      id: 1,
      name: 'Fake',
      age: 43
    };
    const matchingRules = {};
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have "age" at "$.body"`);
  });

  it('objects equal - nested', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: false,
      address: {
        street: {
          line: 'Road No. 60'
        }
      }
    };
    const expected = {
      id: 1,
      name: 'Fake',
      married: false,
      address: {
        street: {
          line: 'Road No. 60'
        }
      }
    };
    const matchingRules = {};
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('objects not equal - nested', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: false,
      address: {
        street: {
          line: 'Road No. 60',
          area: 'not a society',
          number: '60'
        }
      }
    };
    const expected = {
      id: 1,
      name: 'Fake',
      married: false,
      address: {
        street: {
          line: 'Road No. 60',
          area: 'society',
          number: '60'
        }
      }
    };
    const matchingRules = {};
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value "society" at "$.body.address.street.area" but found "not a society"`);
  });

});

describe('JSON Match - Object - matching rules', () => {

  before(() => {
    this.compare = new Compare();
  });

  it('empty objects', () => {
    const actual = {};
    const expected = {};
    const matchingRules = {
      "$.body.id": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals('Matching Rule - "type" failed at "$.body.id"');
  });

  it('objects equal - one property', () => {
    const actual = {
      id: 1
    };
    const expected = {
      id: 1
    };
    const matchingRules = {
      "$.body.id": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('objects not equal type - one property', () => {
    const actual = {
      id: 1
    };
    const expected = {
      id: '1'
    };
    const matchingRules = {
      "$.body.id": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have type "string" at "$.body.id" but found "number"`);
  });

  it('objects equal by type - one property', () => {
    const actual = {
      id: 1
    };
    const expected = {
      id: 12
    };
    const matchingRules = {
      "$.body.id": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('objects not equal - one different property', () => {
    const actual = {
      id: 1
    };
    const expected = {
      typeId: 1
    };
    const matchingRules = {
      "$.body.typeId": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have "typeId" at "$.body"`);
  });

  it('objects equal - multiple properties', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: false
    };
    const expected = {
      id: 1,
      name: 'Fake',
      married: false
    };
    const matchingRules = {
      "$.body.id": {
        "match": "type"
      },
      "$.body.name": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('objects not equal type - multiple properties', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: 'false'
    };
    const expected = {
      id: 1,
      name: 'Fake',
      married: false
    };
    const matchingRules = {
      "$.body.id": {
        "match": "type"
      },
      "$.body.married": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have type "boolean" at "$.body.married" but found "string"`);
  });

  it('objects not by type matching - boolean - multiple properties', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: true
    };
    const expected = {
      id: 1,
      name: 'Fake',
      married: false
    };
    const matchingRules = {
      "$.body.id": {
        "match": "type"
      },
      "$.body.married": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('objects equal by type matching - string - multiple properties', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: true
    };
    const expected = {
      id: 1,
      name: 'Bake',
      married: true
    };
    const matchingRules = {
      "$.body.name": {
        "match": "type"
      },
      "$.body.married": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('objects with multiple properties not equal - one different property ', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: true
    };
    const expected = {
      id: 1,
      name: 'Fake',
      age: 43
    };
    const matchingRules = {
      "$.body.name": {
        "match": "type"
      },
      "$.body.age": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have "age" at "$.body"`);
  });

  it('objects equal by regex (same value) - one property', () => {
    const actual = {
      gender: 'M'
    };
    const expected = {
      gender: 'M'
    };
    const matchingRules = {
      "$.body.gender": {
        "match": "regex",
        "regex": "F|M"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('objects equal by regex (different value) - one property', () => {
    const actual = {
      gender: 'M'
    };
    const expected = {
      gender: 'F'
    };
    const matchingRules = {
      "$.body.gender": {
        "match": "regex",
        "regex": "F|M"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('objects not equal by regex - one property', () => {
    const actual = {
      gender: 'Male'
    };
    const expected = {
      gender: 'M'
    };
    const matchingRules = {
      "$.body.gender": {
        "match": "regex",
        "regex": "^(M|F){1}$"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't match with "^(M|F){1}$" at "$.body.gender" but found "Male"`);
  });

  it('invalid regex', () => {
    const actual = {
      gender: 'Male'
    };
    const expected = {
      gender: 'M'
    };
    const matchingRules = {
      "$.body.gender": {
        "match": "regex",
        "regex": "\\"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Invalid RegExp provided "\\" at "$.body.gender"`);
  });

  it('objects equal by array min - one property', () => {
    const actual = {
      books: ['Harry']
    };
    const expected = {
      books: ['Harry']
    };
    const matchingRules = {
      "$.body.books": {
        "min": 1
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('objects not equal by array min - one property', () => {
    const actual = {
      books: ['Harry']
    };
    const expected = {
      books: ['Harry']
    };
    const matchingRules = {
      "$.body.books": {
        "min": 2
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have array with length "2" at "$.body.books" but found with length "1"`);
  });

  it('objects not equal by array type - one property', () => {
    const actual = {
      books: 'Harry'
    };
    const expected = {
      books: ['Harry']
    };
    const matchingRules = {
      "$.body.books": {
        "min": 2
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have type "array" at "$.body.books" but found "string"`);
  });

  it('objects equal by array min & type - one property', () => {
    const actual = {
      books: ['Harry']
    };
    const expected = {
      books: ['Harry']
    };
    const matchingRules = {
      "$.body.books": {
        "min": 1
      },
      "$.body.books[*].*": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('objects equal array has more elements - one property', () => {
    const actual = {
      books: ['Harry', 'Jon', 'Tom']
    };
    const expected = {
      books: ['Harry']
    };
    const matchingRules = {
      "$.body.books": {
        "min": 1
      },
      "$.body.books[*].*": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('objects not equal by array has different type - one property', () => {
    const actual = {
      books: ['Harry', 'Jon', 12]
    };
    const expected = {
      books: ['Harry']
    };
    const matchingRules = {
      "$.body.books": {
        "min": 1
      },
      "$.body.books[*].*": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have type "string" at "$.body.books[2]" but found "number"`);
  });

  it('objects equal by array min - multiple properties', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: false,
      books: ['Harry'],
      movies: ['Game']
    };
    const expected = {
      id: 1,
      name: 'Fake',
      married: false,
      books: ['Harry'],
      movies: ['Game']
    };
    const matchingRules = {
      "$.body.books": {
        "min": 1
      },
      "$.body.books[*].*": {
        "match": "type"
      },
      "$.body.movies": {
        "min": 1
      },
      "$.body.movies[*].*": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('objects not equal by array min - multiple properties', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: false,
      books: ['Harry'],
      movies: ['Game']
    };
    const expected = {
      id: 1,
      name: 'Fake',
      married: false,
      books: ['Harry'],
      movies: ['Game']
    };
    const matchingRules = {
      "$.body.books": {
        "min": 1
      },
      "$.body.books[*].*": {
        "match": "type"
      },
      "$.body.movies": {
        "min": 2
      },
      "$.body.movies[*].*": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have array with length "2" at "$.body.movies" but found with length "1"`);
  });

  it('objects equal array has more elements - multiple property', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: false,
      books: ['Harry', 'Porter'],
      movies: ['Game', 'Of', 'Thrones']
    };
    const expected = {
      id: 1,
      name: 'Fake',
      married: false,
      books: ['Harry'],
      movies: ['Game']
    };
    const matchingRules = {
      "$.body.books": {
        "min": 1
      },
      "$.body.books[*].*": {
        "match": "type"
      },
      "$.body.movies": {
        "min": 2
      },
      "$.body.movies[*].*": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('objects not equal by array has different type - one property', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: false,
      books: ['Harry', 'Porter'],
      movies: ['Game', 'Of', 'Thrones', 2]
    };
    const expected = {
      id: 1,
      name: 'Fake',
      married: false,
      books: ['Harry'],
      movies: ['Game']
    };
    const matchingRules = {
      "$.body.books": {
        "min": 1
      },
      "$.body.books[*].*": {
        "match": "type"
      },
      "$.body.movies": {
        "min": 2
      },
      "$.body.movies[*].*": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have type "string" at "$.body.movies[3]" but found "number"`);
  });

  it('objects not equal - array has more elements - multiple property', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: false,
      books: ['Harry', 'Porter'],
      movies: ['Game', 'Of', 'Thrones'],
      country: 'IND'
    };
    const expected = {
      id: 1,
      name: 'Fake',
      married: false,
      books: ['Harry'],
      movies: ['Game'],
      country: 'US'
    };
    const matchingRules = {
      "$.body.books": {
        "min": 1
      },
      "$.body.books[*].*": {
        "match": "type"
      },
      "$.body.movies": {
        "min": 2
      },
      "$.body.movies[*].*": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value "US" at "$.body.country" but found "IND"`);
  });

  it('objects equal - nested - by type', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: false,
      address: {
        street: {
          line: 'Road No. 4',
          number: '60'
        }
      }
    };
    const expected = {
      id: 1,
      name: 'Fake',
      married: false,
      address: {
        street: {
          line: 'Road No. 64',
          number: '60'
        }
      }
    };
    const matchingRules = {
      "$.body.address": {
        "match": "type"
      },
      "$.body.address.street.line": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('objects not equal - nested - by type', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: false,
      address: {
        street: {
          line: 'Road No. 4',
          number: 60
        }
      }
    };
    const expected = {
      id: 1,
      name: 'Fake',
      married: false,
      address: {
        street: {
          line: 'Road No. 64',
          number: '60'
        }
      }
    };
    const matchingRules = {
      "$.body.address.street.line": {
        "match": "type"
      },
      "$.body.address.street.number": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have type "string" at "$.body.address.street.number" but found "number"`);
  });

  it('objects equal by array min - nested', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: false,
      books: ['Harry'],
      address: {
        street: {
          lines: ['Road 60']
        }
      },
      movies: ['Game']
    };
    const expected = {
      id: 1,
      name: 'Fake',
      married: false,
      books: ['Harry'],
      address: {
        street: {
          lines: ['Road 60']
        }
      },
      movies: ['Game']
    };
    const matchingRules = {
      "$.body.books": {
        "min": 1
      },
      "$.body.books[*].*": {
        "match": "type"
      },
      "$.body.address.street.lines": {
        "min": 1
      },
      "$.body.address.street.lines[*].*": {
        "match": "type"
      },
      "$.body.movies": {
        "min": 1
      },
      "$.body.movies[*].*": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('objects not equal by array min - nested', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: false,
      books: ['Harry'],
      address: {
        street: {
          lines: []
        }
      },
      movies: ['Game']
    };
    const expected = {
      id: 1,
      name: 'Fake',
      married: false,
      books: ['Harry'],
      address: {
        street: {
          lines: ['Road 60']
        }
      },
      movies: ['Game']
    };
    const matchingRules = {
      "$.body.books": {
        "min": 1
      },
      "$.body.books[*].*": {
        "match": "type"
      },
      "$.body.address.street.lines": {
        "min": 1
      },
      "$.body.address.street.lines[*].*": {
        "match": "type"
      },
      "$.body.movies": {
        "min": 1
      },
      "$.body.movies[*].*": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have array with length "1" at "$.body.address.street.lines" but found with length "0"`);
  });

  it('objects not equal by type - nested', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: false,
      books: ['Harry'],
      address: {
        street: {
          street: 60,
          lines: [60]
        }
      },
      movies: ['Game']
    };
    const expected = {
      id: 1,
      name: 'Fake',
      married: false,
      books: ['Harry'],
      address: {
        street: {
          lines: ['Road 60']
        }
      },
      movies: ['Game']
    };
    const matchingRules = {
      "$.body.books": {
        "min": 1
      },
      "$.body.books[*].*": {
        "match": "type"
      },
      "$.body.address.street.lines": {
        "min": 1
      },
      "$.body.address.street.lines[*].*": {
        "match": "type"
      },
      "$.body.movies": {
        "min": 1
      },
      "$.body.movies[*].*": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have type "string" at "$.body.address.street.lines[0]" but found "number"`);
  });

  it('root matching rule - equal object', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: false,
      scores: {
        language: 20,
        sciences: {
          biology: 23
        }
      }
    };
    const expected = {
      id: 2,
      name: 'Bake',
      married: true,
      scores: {
        language: 20,
        sciences: {
          biology: 23
        }
      }
    };
    const matchingRules = {
      "$.body": {
        "match": "type"
      },
      "$.body.name": {
        "match": "regex",
        "regex": "Fake|Bake"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('root matching rule - not equal object', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: 'false',
      scores: {
        language: 20,
        sciences: {
          biology: 23
        }
      }
    };
    const expected = {
      id: 2,
      name: 'Bake',
      married: true,
      scores: {
        language: 20,
        sciences: {
          biology: 23
        }
      }
    };
    const matchingRules = {
      "$.body": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have type "boolean" at "$.body.married" but found "string"`);
  });

  it('root matching rule - not equal object - regex', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: false,
      scores: {
        language: 20,
        sciences: {
          biology: 23
        }
      }
    };
    const expected = {
      id: 2,
      name: 'Bake',
      married: true,
      scores: {
        language: 20,
        sciences: {
          biology: 23
        }
      }
    };
    const matchingRules = {
      "$.body": {
        "match": "type"
      },
      "$.body.name": {
        "match": "regex",
        "regex": "Snake|Brake"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't match with "Snake|Brake" at "$.body.name" but found "Fake"`);
  });

  it('root matching rule - not equal object - deep', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: false,
      scores: {
        language: 20,
        sciences: {
          biology: 23
        }
      }
    };
    const expected = {
      id: 2,
      name: 'Bake',
      married: true,
      scores: {
        language: 20,
        sciences: {
          biology: 24
        }
      }
    };
    const matchingRules = {
      "$.body": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value "24" at "$.body.scores.sciences.biology" but found "23"`);
  });

  it('root matching rule - equal object - deep', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: false,
      scores: {
        language: 20,
        sciences: {
          biology: 23
        }
      }
    };
    const expected = {
      id: 2,
      name: 'Bake',
      married: true,
      scores: {
        language: 20,
        sciences: {
          biology: 24
        }
      }
    };
    const matchingRules = {
      "$.body": {
        "match": "type"
      },
      "$.body.scores.sciences": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('root matching rule & matching rule at exact item - equal object - deep', () => {
    const actual = {
      id: 1,
      name: 'Fake',
      married: false,
      scores: {
        language: 20,
        sciences: {
          biology: 23
        }
      }
    };
    const expected = {
      id: 2,
      name: 'Bake',
      married: true,
      scores: {
        language: 20,
        sciences: {
          biology: 24
        }
      }
    };
    const matchingRules = {
      "$.body": {
        "match": "type"
      },
      "$.body.scores.sciences.biology": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('root matching rule - equal array - deep', () => {
    const actual = [{
      id: 1,
      name: 'Fake',
      married: true,
      scores: {
        language: 20,
        sciences: {
          biology: 23
        }
      }
    }];
    const expected = [{
      id: 1,
      name: 'Fake',
      married: true,
      scores: {
        language: 20,
        sciences: {
          biology: 23
        }
      }
    }];
    const matchingRules = {
      "$.body": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('root matching rule - not equal array - deep', () => {
    const actual = [{
      id: 1,
      name: 'Fake',
      married: true,
      scores: {
        language: 20,
        sciences: {
          biology: 23
        }
      }
    }];
    const expected = [{
      id: 1,
      name: 'Fake',
      married: true,
      scores: {
        language: 21,
        sciences: {
          biology: 23
        }
      }
    }];
    const matchingRules = {
      "$.body": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value "21" at "$.body[0].scores.language" but found "20"`);
  });

  it('root matching rule - not equal array - length', () => {
    const actual = [{
      id: 1,
      name: 'Fake',
      married: true,
      scores: {
        language: 20,
        sciences: {
          biology: 23
        }
      }
    }];
    const expected = [
      {
        id: 1,
        name: 'Fake',
        married: true,
        scores: {
          language: 21,
          sciences: {
            biology: 23
          }
        }
      },
      {
        id: 2,
        name: 'Bake',
        married: true,
        scores: {
          language: 21,
          sciences: {
            biology: 23
          }
        }
      }
    ];
    const matchingRules = {
      "$.body": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have array with length "2" at "$.body" but found with length "1"`);
  });

});

describe('JSON Match - Array - no matching rules', () => {

  before(() => {
    this.compare = new Compare();
  });

  it('empty objects', () => {
    const actual = [];
    const expected = [];
    const matchingRules = {};
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('empty expected', () => {
    const actual = [{
      id: 1
    }];
    const expected = {};
    const matchingRules = {};
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('equal objects', () => {
    const actual = [
      {
        id: 1,
        name: 'Fake',
        married: false,
        books: ['Harry'],
        address: {
          street: {
            street: 60,
            lines: [60]
          }
        },
        movies: ['Game']
      }
    ];
    const expected = [
      {
        id: 1,
        name: 'Fake',
        married: false,
        books: ['Harry'],
        address: {
          street: {
            street: 60,
            lines: [60]
          }
        },
        movies: ['Game']
      }
    ];
    const matchingRules = {};
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('unequal objects - array', () => {
    const actual = [
      {
        id: 1,
        name: 'Fake',
        married: false,
        books: ['Harry'],
        address: {
          street: {
            street: 60,
            lines: [60]
          }
        },
        movies: ['Game']
      }
    ];
    const expected = [
      {
        id: 1,
        name: 'Fake',
        married: false,
        books: ['Harry'],
        address: {
          street: {
            street: 60,
            lines: [60, 50]
          }
        },
        movies: ['Game']
      }
    ];
    const matchingRules = {};
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have array with length "2" at "$.body[0].address.street.lines" but found with length "1"`);
  });

  it('unequal objects - no property', () => {
    const actual = [
      {
        id: 1,
        name: 'Fake',
        married: false,
        books: ['Harry'],
        address: {
          street: {
            street: 60,
            lines: [60]
          }
        },
        movies: ['Game']
      }
    ];
    const expected = [
      {
        id: 1,
        name: 'Fake',
        married: false,
        books: ['Harry'],
        address: {
          street: {
            street: 60,
            pin: 1,
            lines: [60]
          }
        },
        movies: ['Game']
      }
    ];
    const matchingRules = {};
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have "pin" at "$.body[0].address.street"`);
  });

  it('unequal objects - no property', () => {
    const actual = [
      {
        id: 1,
        name: 'Fake',
        married: false,
        books: ['Harry'],
        address: {
          street: {
            street: 60,
            lines: [60],
            pin: 2
          }
        },
        movies: ['Game']
      }
    ];
    const expected = [
      {
        id: 1,
        name: 'Fake',
        married: false,
        books: ['Harry'],
        address: {
          street: {
            street: 60,
            pin: 1,
            lines: [60]
          }
        },
        movies: ['Game']
      }
    ];
    const matchingRules = {};
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value "1" at "$.body[0].address.street.pin" but found "2"`);
  });

});

describe('JSON Match - Array - matching rules', () => {

  before(() => {
    this.compare = new Compare();
  });

  it('empty objects', () => {
    const actual = [];
    const expected = [];
    const matchingRules = {
      "$.body": {
        "min": 0
      },
      "$.body[*].*": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('array of strings - equal', () => {
    const actual = ["Game", "Thrones"];
    const expected = ["Game"];
    const matchingRules = {
      "$.body": {
        "min": 1
      },
      "$.body[*].*": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('array of strings - not equal by length', () => {
    const actual = ["Game", "Thrones"];
    const expected = ["Game"];
    const matchingRules = {
      "$.body": {
        "min": 3
      },
      "$.body[*].*": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have array with length "3" at "$.body" but found with length "2"`);
  });

  it('array of strings - not equal by type', () => {
    const actual = ["Game", "Thrones", 3];
    const expected = ["Game"];
    const matchingRules = {
      "$.body": {
        "min": 2
      },
      "$.body[*].*": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have type "string" at "$.body[2]" but found "number"`);
  });

  it('array of objects - equal', () => {
    const actual = [
      {
        id: 1,
        name: 'Fake',
        married: false,
        scores: {
          language: 20,
          sciences: {
            biology: 23
          }
        }
      }
    ];
    const expected = [
      {
        id: 2,
        name: 'Bake',
        married: true,
        scores: {
          language: 20,
          sciences: {
            biology: 23
          }
        }
      }
    ];
    const matchingRules = {
      "$.body": {
        "min": 1
      },
      "$.body[*].*": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('array of objects - equal - with deep matching rule', () => {
    const actual = [
      {
        id: 1,
        name: 'Fake',
        married: false,
        scores: {
          language: 20,
          sciences: {
            biology: 23
          }
        }
      }
    ];
    const expected = [
      {
        id: 2,
        name: 'Bake',
        married: true,
        scores: {
          language: 20,
          sciences: {
            biology: 24
          }
        }
      }
    ];
    const matchingRules = {
      "$.body": {
        "min": 1
      },
      "$.body[*].*": {
        "match": "type"
      },
      "$.body[*].scores.sciences": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('array of objects - not equal - root', () => {
    const actual = [
      {
        id: 1,
        name: 'Fake',
        married: false,
        scores: {
          language: 20,
          sciences: {
            biology: 24
          }
        }
      },
      {
        id: 1,
        name: 'Fake',
        married: false,
        scores: {
          language: 20,
          sciences: {
            biology: 23
          }
        }
      }
    ];
    const expected = [
      {
        id: 2,
        name: 'Bake',
        married: true,
        scores: {
          language: 20,
          sciences: {
            biology: 24
          }
        }
      }
    ];
    const matchingRules = {
      "$.body": {
        "min": 1
      },
      "$.body[*].*": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value "24" at "$.body[1].scores.sciences.biology" but found "23"`);
  });

  it('array of nested objects - equal - with deep matching rule', () => {
    const actual = [
      {
        id: 1,
        name: 'Fake',
        married: false,
        schools: [
          {
            id: 1,
            name: 'Joseph'
          },
          {
            id: 2,
            name: 'Alpha'
          }
        ],
        scores: {
          language: 20,
          sciences: {
            biology: 23
          }
        }
      }
    ];
    const expected = [
      {
        id: 2,
        name: 'Bake',
        married: true,
        schools: [
          {
            id: 3,
            name: 'Ants'
          },
          {
            id: 4,
            name: 'Mary'
          }
        ],
        scores: {
          language: 20,
          sciences: {
            biology: 24
          }
        }
      }
    ];
    const matchingRules = {
      "$.body": {
        "min": 1
      },
      "$.body[*].*": {
        "match": "type"
      },
      "$.body[*].schools": {
        "min": 1
      },
      "$.body[*].schools[*].*": {
        "match": "type"
      },
      "$.body[*].scores.sciences": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

  it('array of nested objects - not equal - with deep matching rule', () => {
    const actual = [
      {
        id: 1,
        name: 'Fake',
        married: false,
        schools: [
          {
            id: 1,
            name: 'Joseph'
          },
          {
            id: 2,
            name: 'Alpha'
          }
        ],
        scores: {
          language: 20,
          sciences: {
            biology: 23
          }
        }
      }
    ];
    const expected = [
      {
        id: 2,
        name: 'Bake',
        married: true,
        schools: [
          {
            id: '3',
            name: 'Ants'
          }
        ],
        scores: {
          language: 20,
          sciences: {
            biology: 24
          }
        }
      }
    ];
    const matchingRules = {
      "$.body": {
        "min": 1
      },
      "$.body[*].*": {
        "match": "type"
      },
      "$.body[*].schools": {
        "min": 1
      },
      "$.body[*].schools[*].*": {
        "match": "type"
      },
      "$.body[*].scores.sciences": {
        "match": "type"
      }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have type "string" at "$.body[0].schools[0].id" but found "number"`);
  });

  it('array of objects - equal - matching rule for type of items in array', () => {
    const actual = [
      {
        useIntentionCode: 'AAA',
        useIntentionDescFr: 'Ab',
        useIntentionDescEn: 'Buying of a house'
      }
    ];
    const expected = [
      {
        useIntentionCode: 'AAA',
        useIntentionDescFr: 'Ab',
        useIntentionDescEn: 'Buying of a house'
      }
    ];
    const matchingRules = {
      '$.body': { min: 1 },
      '$.body[*].*': { match: 'type' },
      '$.body[*].useIntentionCode': { match: 'type' },
      '$.body[*].useIntentionDescFr': { match: 'type' },
      '$.body[*].useIntentionDescEn': { match: 'type' }
    };
    const res = this.compare.jsonMatch(actual, expected, matchingRules);
    expect(res.equal).equals(true);
  });

});