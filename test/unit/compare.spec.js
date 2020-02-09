const expect = require('chai').expect;
const Compare = require('../../src/helpers/compare');

describe('JSON Like - Object - Equal Properties', () => {

  it('object equals - empty', () => {
    const actual = {};
    const expected = {};
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('object equals - one property - number', () => {
    const actual = {
      id: 1
    };
    const expected = {
      id: 1
    };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
  });

  it('object not equals - one property - null', () => {
    const actual = {
      id: null
    };
    const expected = {
      id: null
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
    expect(res.message).equals(`Json doesn't have value '1' at '$.id' but found '1'`);
  });

  it('object equals - one property - string', () => {
    const actual = {
      id: "1"
    };
    const expected = {
      id: "1"
    };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
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

  it('object equals - one property - boolean', () => {
    const actual = {
      id: true
    };
    const expected = {
      id: true
    };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
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

  it('object equals - one property - RegEx', () => {
    const actual = {
      id: 1
    };
    const expected = {
      id: /\d+/
    };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(true);
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
    expect(res.message).equals(`Json doesn't have value '/\\W+/' at '$.id' but found '1'`);
  });

  it('object equals - multiple properties', () => {
    const actual = {
      id: 1,
      name: 'hunt'
    };
    const expected = {
      id: 1,
      name: 'hunt'
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
      name: 'bent'
    };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value 'bent' at '$.name' but found 'hunt'`);
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
      id: 1,
      name: 'hunt',
      scores: {
        maths: 90,
        social: 80
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
        social: 70
      }
    };
    const compare = new Compare();
    const res = compare.jsonLike(actual, expected);
    expect(res.equal).equals(false);
    expect(res.message).equals(`Json doesn't have value '70' at '$.scores.social' but found '80'`);
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
    expect(res.message).equals(`Json doesn't have value '2' at '$[0]' but found '1'`);
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
    expect(res.message).equals(`Json doesn't have value '5' at '$[1][1]' but found '4'`);
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
    expect(res.message).equals(`Json doesn't have value '42' at '$[1].scores.languages[0].english' but found '41'`);
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
    expect(res.message).equals(`Json doesn't have value "1" at "$.body.id" but found "1"`);
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
    expect(res.message).equals(`Json doesn't have value "false" at "$.body.married" but found "false"`);
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

});