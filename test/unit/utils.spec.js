const expect = require('chai').expect;

const Interaction = require('../../src/models/interaction');
const utils = require('../../src/helpers/utils');

describe('getMatchingInteraction', () => {

  beforeEach(() => {
    this.interactionsMap = new Map();
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
      query: {
        id: 1,
        name: 'Fake',
        married: true
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
          id: 1,
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
        id: 1,
        name: 'Fake',
        married: true
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
      query: {
        id: 1,
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
      query: {
        id: '1',
        name: 'Fake',
        married: 'true'
      }
    };
    const matchingInteraction = utils.getMatchingInteraction(request, this.interactionsMap);
    expect(matchingInteraction).not.to.be.null;
  });

  it('single - matching - with query & null', () => {
    const rawInteraction = {
      withRequest: {
        method: 'GET',
        path: '/api/projects/1',
        query: {
          id: 1,
          name: 'Fake',
          married: true,
          status: null
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
        id: 1,
        name: 'Fake',
        married: true,
        status: 'null'
      }
    };
    const matchingInteraction = utils.getMatchingInteraction(request, this.interactionsMap);
    expect(matchingInteraction).not.to.be.null;
  });

  afterEach(() => {
    this.interactionsMap.clear();
  });

});