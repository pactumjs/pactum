const expect = require('chai').expect;

const Interaction = require('../../src/models/interaction');
const Matcher = require('../../src/models/matcher');
const utils = require('../../src/helpers/utils');

describe('getMatchingInteraction', () => {

  beforeEach(() => {
    this.interactionsMap = new Map();
    this.matcher = new Matcher();
  });

  it('single - matching', () => {
    const rawInteraction = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1'
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    };
    const interaction = new Interaction(rawInteraction, true);
    this.interactionsMap.set(interaction.id, interaction);
    const request = {
      method: 'GET',
      path: '/api/projects/1',
      query: {}
    };
    const matchingInteraction = utils.getMatchingInteraction(request, this.interactionsMap);
    expect(matchingInteraction).not.to.be.null;
  });

  it('single - not matching by method', () => {
    const rawInteraction = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1'
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    };
    const interaction = new Interaction(rawInteraction, true);
    this.interactionsMap.set(interaction.id, interaction);
    const request = {
      method: 'POST',
      path: '/api/projects/1',
      query: {}
    };
    const matchingInteraction = utils.getMatchingInteraction(request, this.interactionsMap);
    expect(matchingInteraction).to.be.null;
  });

  it('single - not matching by path', () => {
    const rawInteraction = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1'
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    };
    const interaction = new Interaction(rawInteraction, true);
    this.interactionsMap.set(interaction.id, interaction);
    const request = {
      method: 'GET',
      path: '/api/projects/2',
      query: {}
    };
    const matchingInteraction = utils.getMatchingInteraction(request, this.interactionsMap);
    expect(matchingInteraction).to.be.null;
  });

  it('single - matching - empty query', () => {
    const rawInteraction = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1',
        query: {}
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    };
    const interaction = new Interaction(rawInteraction, true);
    this.interactionsMap.set(interaction.id, interaction);
    const request = {
      method: 'GET',
      path: '/api/projects/1',
      query: {}
    };
    const matchingInteraction = utils.getMatchingInteraction(request, this.interactionsMap);
    expect(matchingInteraction).not.to.be.null;
  });

  it('single - matching - with query', () => {
    const rawInteraction = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1',
        query: {
          id: '1',
          name: 'Fake',
          married: 'true'
        }
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    };
    const interaction = new Interaction(rawInteraction, true);
    this.interactionsMap.set(interaction.id, interaction);
    const request = {
      method: 'GET',
      path: '/api/projects/1',
      query: {
        id: '1',
        name: 'Fake',
        married: 'true'
      }
    };
    const matchingInteraction = utils.getMatchingInteraction(request, this.interactionsMap);
    expect(matchingInteraction).not.to.be.null;
  });

  it('single - not matching by extra property in actual query', () => {
    const rawInteraction = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1',
        query: {
          id: '1',
          name: 'Fake'
        }
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    };
    const interaction = new Interaction(rawInteraction, true);
    this.interactionsMap.set(interaction.id, interaction);
    const request = {
      method: 'GET',
      path: '/api/projects/1',
      query: {
        id: '1',
        name: 'Fake',
        married: 'true'
      }
    };
    const matchingInteraction = utils.getMatchingInteraction(request, this.interactionsMap);
    expect(matchingInteraction).to.be.null;
  });

  it('single - not matching by extra property in expected query', () => {
    const rawInteraction = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1',
        query: {
          id: '1',
          name: 'Fake',
          married: 'true'
        }
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    };
    const interaction = new Interaction(rawInteraction, true);
    this.interactionsMap.set(interaction.id, interaction);
    const request = {
      method: 'GET',
      path: '/api/projects/1',
      query: {
        id: '1',
        name: 'Fake'
      }
    };
    const matchingInteraction = utils.getMatchingInteraction(request, this.interactionsMap);
    expect(matchingInteraction).to.be.null;
  });

  it('single - matching - with query & diff data types', () => {
    const rawInteraction = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1',
        query: {
          id: '1',
          name: 'Fake',
          married: 'true'
        }
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    };
    const interaction = new Interaction(rawInteraction, true);
    this.interactionsMap.set(interaction.id, interaction);
    const request = {
      method: 'GET',
      path: '/api/projects/1',
      query: {
        id: '1',
        name: 'Fake',
        married: 'true'
      }
    };
    const matchingInteraction = utils.getMatchingInteraction(request, this.interactionsMap);
    expect(matchingInteraction).not.to.be.null;
  });

  it('single - matching - with query & matching rules', () => {
    const rawInteraction = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1',
        query: {
          id: this.matcher.like('1'),
          name: this.matcher.regex({ generate: 'Fake', matcher: '\\w+' }),
          married: 'true'
        }
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    };
    const interaction = new Interaction(rawInteraction, true);
    this.interactionsMap.set(interaction.id, interaction);
    const request = {
      method: 'GET',
      path: '/api/projects/1',
      query: {
        id: '2',
        name: 'Bake',
        married: 'true'
      }
    };
    const matchingInteraction = utils.getMatchingInteraction(request, this.interactionsMap);
    expect(matchingInteraction).not.to.be.null;
  });

  it('single - not matching - with query & matching rules', () => {
    const rawInteraction = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1',
        query: {
          id: this.matcher.like('1'),
          name: this.matcher.regex({ generate: 'Fake', matcher: '/Fake/g' }),
          married: 'true'
        }
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    };
    const interaction = new Interaction(rawInteraction, true);
    this.interactionsMap.set(interaction.id, interaction);
    const request = {
      method: 'GET',
      path: '/api/projects/1',
      query: {
        id: '2',
        name: 'Bake',
        married: 'true'
      }
    };
    const matchingInteraction = utils.getMatchingInteraction(request, this.interactionsMap);
    expect(matchingInteraction).to.be.null;
  });

  it('single - not matching - with query matching rule not exercised', () => {
    const rawInteraction = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1',
        query: {
          id: this.matcher.like('1'),
          name: this.matcher.regex({ generate: 'Fake', matcher: '/Fake/g' }),
          married: 'true'
        }
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    };
    const interaction = new Interaction(rawInteraction, true);
    this.interactionsMap.set(interaction.id, interaction);
    const request = {
      method: 'GET',
      path: '/api/projects/1',
      query: {
        id: '2',
        married: 'true'
      }
    };
    const matchingInteraction = utils.getMatchingInteraction(request, this.interactionsMap);
    expect(matchingInteraction).to.be.null;
  });

  it('single - matching - with body', () => {
    const rawInteraction = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1',
        body: {
          id: 1,
          name: 'Fake',
          married: true,
          scores: null
        }
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    };
    const interaction = new Interaction(rawInteraction, true);
    this.interactionsMap.set(interaction.id, interaction);
    const request = {
      method: 'GET',
      path: '/api/projects/1',
      query: {},
      body: {
        id: 1,
        married: true,
        name: 'Fake',
        scores: null
      }
    };
    const matchingInteraction = utils.getMatchingInteraction(request, this.interactionsMap);
    expect(matchingInteraction).not.to.be.null;
  });

  it('single - not matching by extra property in actual body', () => {
    const rawInteraction = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1',
        body: {
          id: 1,
          name: 'Fake',
          married: true
        }
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    };
    const interaction = new Interaction(rawInteraction, true);
    this.interactionsMap.set(interaction.id, interaction);
    const request = {
      method: 'GET',
      path: '/api/projects/1',
      query: {},
      body: {
        id: 1,
        married: true,
        name: 'Fake',
        scores: null
      }
    };
    const matchingInteraction = utils.getMatchingInteraction(request, this.interactionsMap);
    expect(matchingInteraction).to.be.null;
  });

  it('single - not matching by extra property in expected body', () => {
    const rawInteraction = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1',
        body: {
          id: 1,
          name: 'Fake',
          married: true,
          scores: null
        }
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    };
    const interaction = new Interaction(rawInteraction, true);
    this.interactionsMap.set(interaction.id, interaction);
    const request = {
      method: 'GET',
      path: '/api/projects/1',
      query: {},
      body: {
        id: 1,
        married: true,
        name: 'Fake'
      }
    };
    const matchingInteraction = utils.getMatchingInteraction(request, this.interactionsMap);
    expect(matchingInteraction).to.be.null;
  });

  it('single - matching - with body & matching rules', () => {
    const rawInteraction = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1',
        body: {
          id: this.matcher.like('1'),
          name: this.matcher.regex({ generate: 'Fake', matcher: '\\w+' }),
          married: 'true'
        }
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    };
    const interaction = new Interaction(rawInteraction, true);
    this.interactionsMap.set(interaction.id, interaction);
    const request = {
      method: 'GET',
      path: '/api/projects/1',
      query: {},
      body: {
        id: '2',
        name: 'Bake',
        married: 'true'
      }
    };
    const matchingInteraction = utils.getMatchingInteraction(request, this.interactionsMap);
    expect(matchingInteraction).not.to.be.null;
  });

  it('single - not matching - with body & matching rules', () => {
    const rawInteraction = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1',
        body: {
          id: this.matcher.like('1'),
          name: this.matcher.regex({ generate: 'Fake', matcher: '/Fake/g' }),
          married: 'true'
        }
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    };
    const interaction = new Interaction(rawInteraction, true);
    this.interactionsMap.set(interaction.id, interaction);
    const request = {
      method: 'GET',
      path: '/api/projects/1',
      query: {},
      body: {
        id: '2',
        name: 'Bake',
        married: 'true'
      }
    };
    const matchingInteraction = utils.getMatchingInteraction(request, this.interactionsMap);
    expect(matchingInteraction).to.be.null;
  });

  it('single - not matching - with body matching rule not exercised', () => {
    const rawInteraction = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1',
        body: {
          id: this.matcher.like('1'),
          name: this.matcher.regex({ generate: 'Fake', matcher: '/Fake/g' }),
          married: 'true'
        }
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    };
    const interaction = new Interaction(rawInteraction, true);
    this.interactionsMap.set(interaction.id, interaction);
    const request = {
      method: 'GET',
      path: '/api/projects/1',
      query: {},
      body: {
        id: '2',
        married: 'true'
      }
    };
    const matchingInteraction = utils.getMatchingInteraction(request, this.interactionsMap);
    expect(matchingInteraction).to.be.null;
  });

  it('single - matching - with body, query & matching rules', () => {
    const rawInteraction = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1',
        query: {
          id: this.matcher.like('1'),
          name: this.matcher.regex({ generate: 'Fake', matcher: '\\w+' }),
          married: 'true'
        },
        body: {
          id: this.matcher.like('1'),
          name: this.matcher.regex({ generate: 'Fake', matcher: '\\w+' }),
          married: 'true'
        }
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    };
    const interaction = new Interaction(rawInteraction, true);
    this.interactionsMap.set(interaction.id, interaction);
    const request = {
      method: 'GET',
      path: '/api/projects/1',
      query: {
        id: '2',
        name: 'Bake',
        married: 'true'
      },
      body: {
        id: '2',
        name: 'Bake',
        married: 'true'
      }
    };
    const matchingInteraction = utils.getMatchingInteraction(request, this.interactionsMap);
    expect(matchingInteraction).not.to.be.null;
  });

  it('single - matching - with body, query & matching rules', () => {
    const rawInteraction = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1',
        query: {
          id: this.matcher.like('1'),
          name: this.matcher.regex({ generate: 'Fake', matcher: '\\w+' }),
          married: 'true'
        },
        body: {
          id: this.matcher.like('1'),
          married: 'true'
        }
      },
      willRespondWith: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    };
    const interaction = new Interaction(rawInteraction, true);
    this.interactionsMap.set(interaction.id, interaction);
    const request = {
      method: 'GET',
      path: '/api/projects/1',
      query: {
        id: '2',
        name: 'Bake',
        married: 'true'
      },
      body: {
        id: '2',
        name: 'Bake',
        married: 'true'
      }
    };
    const matchingInteraction = utils.getMatchingInteraction(request, this.interactionsMap);
    expect(matchingInteraction).to.be.null;
  });

  afterEach(() => {
    this.interactionsMap.clear();
  });

});