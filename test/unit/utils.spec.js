const expect = require('chai').expect;
const { like, regex } = require('pactum-matchers');

const Interaction = require('../../src/models/Interaction.model');
const utils = require('../../src/helpers/utils');

describe('getMatchingInteraction', () => {

  beforeEach(() => {
    this.interactionsMap = new Map();
  });

  it('single - matching', () => {
    const rawInteraction = {
      request: {
        method: 'GET',
        path: '/api/projects/1'
      },
      response: {
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
    const interaction = new Interaction(rawInteraction);
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
      request: {
        method: 'GET',
        path: '/api/projects/1'
      },
      response: {
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
    const interaction = new Interaction(rawInteraction);
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
      request: {
        method: 'GET',
        path: '/api/projects/1'
      },
      response: {
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
    const interaction = new Interaction(rawInteraction);
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
      request: {
        method: 'GET',
        path: '/api/projects/1',
        queryParams: {}
      },
      response: {
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
    const interaction = new Interaction(rawInteraction);
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
      request: {
        method: 'GET',
        path: '/api/projects/1',
        queryParams: {
          id: '1',
          name: 'Fake',
          married: 'true'
        }
      },
      response: {
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
    const interaction = new Interaction(rawInteraction);
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

  it('single - matching by extra property in actual query', () => {
    const rawInteraction = {
      strict: false,
      request: {
        method: 'GET',
        path: '/api/projects/1',
        queryParams: {
          id: '1',
          name: 'Fake'
        }
      },
      response: {
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
    const interaction = new Interaction(rawInteraction);
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

  it('single - not matching by extra property in expected query', () => {
    const rawInteraction = {
      request: {
        method: 'GET',
        path: '/api/projects/1',
        queryParams: {
          id: '1',
          name: 'Fake',
          married: 'true'
        }
      },
      response: {
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
    const interaction = new Interaction(rawInteraction);
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
      request: {
        method: 'GET',
        path: '/api/projects/1',
        queryParams: {
          id: '1',
          name: 'Fake',
          married: 'true'
        }
      },
      response: {
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
    const interaction = new Interaction(rawInteraction);
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
      request: {
        method: 'GET',
        path: '/api/projects/1',
        queryParams: {
          id: like('1'),
          name: regex('Fake', '\\w+'),
          married: 'true'
        }
      },
      response: {
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
    const interaction = new Interaction(rawInteraction);
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
      request: {
        method: 'GET',
        path: '/api/projects/1',
        queryParams: {
          id: like('1'),
          name: regex('Fake', '/Fake/g'),
          married: 'true'
        }
      },
      response: {
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
    const interaction = new Interaction(rawInteraction);
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
      request: {
        method: 'GET',
        path: '/api/projects/1',
        queryParams: {
          id: like('1'),
          name: regex('Fake', '/Fake/g'),
          married: 'true'
        }
      },
      response: {
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
    const interaction = new Interaction(rawInteraction);
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
      request: {
        method: 'GET',
        path: '/api/projects/1',
        body: {
          id: 1,
          name: 'Fake',
          married: true,
          scores: null
        }
      },
      response: {
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
    const interaction = new Interaction(rawInteraction);
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

  it('single - matching by extra property in actual body - mock', () => {
    const rawInteraction = {
      strict: false,
      request: {
        method: 'GET',
        path: '/api/projects/1',
        body: {
          id: 1,
          name: 'Fake',
          married: true
        }
      },
      response: {
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
    const interaction = new Interaction(rawInteraction);
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

  it('single - not matching by extra property in expected body', () => {
    const rawInteraction = {
      request: {
        method: 'GET',
        path: '/api/projects/1',
        body: {
          id: 1,
          name: 'Fake',
          married: true,
          scores: null
        }
      },
      response: {
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
    const interaction = new Interaction(rawInteraction);
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
      request: {
        method: 'GET',
        path: '/api/projects/1',
        body: {
          id: like('1'),
          name:  regex('Fake', '\\w+'),
          married: 'true'
        }
      },
      response: {
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
    const interaction = new Interaction(rawInteraction);
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
      request: {
        method: 'GET',
        path: '/api/projects/1',
        body: {
          id: like('1'),
          name: regex('Fake', '/Fake/g'),
          married: 'true'
        }
      },
      response: {
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
    const interaction = new Interaction(rawInteraction);
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
      request: {
        method: 'GET',
        path: '/api/projects/1',
        body: {
          id: like('1'),
          name: regex('Fake', '/Fake/g'),
          married: 'true'
        }
      },
      response: {
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
    const interaction = new Interaction(rawInteraction);
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
      strict: false,
      request: {
        method: 'GET',
        path: '/api/projects/1',
        queryParams: {
          id: like('1'),
          name: regex('Fake', '\\w+'),
          married: 'true'
        },
        body: {
          id: like('1'),
          name: regex('Fake', '\\w+'),
          married: 'true'
        }
      },
      response: {
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
    const interaction = new Interaction(rawInteraction);
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
      strict: false,
      request: {
        method: 'GET',
        path: '/api/projects/1',
        queryParams: {
          id: like('1'),
          name: regex('Fake', '\\w+'),
          married: 'true'
        },
        body: {
          id: like('1'),
          married: 'true'
        }
      },
      response: {
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
    const interaction = new Interaction(rawInteraction);
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

  it('single - not matching - with body, query & matching rules', () => {
    const rawInteraction = {
      request: {
        method: 'GET',
        path: '/api/projects/1',
        queryParams: {
          id: like('1'),
          name: regex('Fake', '\\w+'),
          married: 'true'
        },
        body: {
          id: like('1'),
          married: 'false'
        }
      },
      response: {
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
    const interaction = new Interaction(rawInteraction);
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