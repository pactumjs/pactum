const expect = require('chai').expect;
const graphQL = require('../../src/helpers/graphQL');

describe('GraphQL', () => {

  it('null objects', () => {
    const actual = null;
    const expected = null;
    expect(graphQL.compare(actual, expected)).to.be.false;
  });

  it('empty objects', () => {
    const actual = {};
    const expected = {};
    expect(graphQL.compare(actual, expected)).to.be.false;
  });

  it('plain query', () => {
    const actual = {
      query: `{ hello }`
    };
    const expected = {
      query: `{ hello }`
    };
    expect(graphQL.compare(actual, expected)).to.be.true;
  });

  it('plain query with different indentation', () => {
    const actual = {
      query: `{ hello }`
    };
    const expected = {
      query: `
        { 
          hello 
        }
      `
    };
    expect(graphQL.compare(actual, expected)).to.be.true;
  });

  it('plain query invalid', () => {
    const actual = {
      query: `{ world }`
    };
    const expected = {
      query: `{ hello }`
    };
    expect(graphQL.compare(actual, expected)).to.be.false;
  });

  it('multi line query', () => {
    const actual = {
      query: `
        {
          hero {
            name
          }
        }
      `
    };
    const expected = {
      query: `
        {
          hero {
            name
          }
        }
      `
    };
    expect(graphQL.compare(actual, expected)).to.be.true;
  });

  it('multi line query with different indentation', () => {
    const actual = {
      query: `{ hero { name } }`
    };
    const expected = {
      query: `
        {
          hero {
            name
          }
        }
      `
    };
    expect(graphQL.compare(actual, expected)).to.be.true;
  });

  it('multi line query invalid', () => {
    const actual = {
      query: `{ hero { name } }`
    };
    const expected = {
      query: `
        {
          hero {
            name
            age
          }
        }
      `
    };
    expect(graphQL.compare(actual, expected)).to.be.false;
  });

  it('nested query', () => {
    const actual = {
      query: `
        {
          hero {
            name
            # Queries can have comments!
            friends {
              name
            }
          }
        }
      `
    };
    const expected = {
      query: `
        {
          hero {
            name
            # Queries can have comments!
            friends {
              name
            }
          }
        }
      `
    };
    expect(graphQL.compare(actual, expected)).to.be.true;
  });

  it('nested query with different indentation', () => {
    const actual = {
      query: `{
        hero {
          name
          friends { name }
        }
      }`
    };
    const expected = {
      query: `
        {
          hero {
            name
            # Queries can have comments!
            friends {
              name
            }
          }
        }
      `
    };
    expect(graphQL.compare(actual, expected)).to.be.true;
  });

  it('nested query invalid', () => {
    const actual = {
      query: `
        {
          hero {
            name
            # Queries can have comments!
            friends {
              name
            }
          }
        }
      `
    };
    const expected = {
      query: `
        {
          hero {
            name
          }
        }
      `
    };
    expect(graphQL.compare(actual, expected)).to.be.false;
  });

  it('query with arguments', () => {
    const actual = {
      query: `
        {
          human(id: "1000") {
            name
            height
          }
        }
      `
    };
    const expected = {
      query: `
        {
          human(id: "1000") {
            name
            height
          }
        }
      `
    };
    expect(graphQL.compare(actual, expected)).to.be.true;
  });

  it('query with arguments & different indentation', () => {
    const actual = {
      query: `{
        human(id: "1000") {
          name
          height
        }
      }`
    };
    const expected = {
      query: `
        {
          human(id: "1000") {
            name
            height
          }
        }
      `
    };
    expect(graphQL.compare(actual, expected)).to.be.true;
  });

  it('invalid query with arguments', () => {
    const actual = {
      query: `{
        human(id: "1000") {
          name
          height
        }
      }`
    };
    const expected = {
      query: `
        {
          human() {
            name
            height
          }
        }
      `
    };
    expect(graphQL.compare(actual, expected)).to.be.false;
  });

  it('query with enum arguments', () => {
    const actual = {
      query: `
        {
          human(id: "1000") {
            name
            height(unit: FOOT)
          }
        }
      `
    };
    const expected = {
      query: `
        {
          human(id: "1000") {
            name
            height(unit: FOOT)
          }
        }
      `
    };
    expect(graphQL.compare(actual, expected)).to.be.true;
  });

  it('query with enum arguments & different indentation', () => {
    const actual = {
      query: `{
        human(id: "1000") {
          name
          height(unit: FOOT)
        }
      }`
    };
    const expected = {
      query: `
        {
          human(id: "1000") {
            name
            height(unit: FOOT)
          }
        }
      `
    };
    expect(graphQL.compare(actual, expected)).to.be.true;
  });

  it('invalid query with enum arguments', () => {
    const actual = {
      query: `{
        human(id: "1000") {
          name
          height(unit: FOOT)
        }
      }`
    };
    const expected = {
      query: `
        {
          human(id: "1000") {
            name
            height(unit: INCHES)
          }
        }
      `
    };
    expect(graphQL.compare(actual, expected)).to.be.false;
  });

  it('query with alias', () => {
    const actual = {
      query: `
        {
          empireHero: hero(episode: EMPIRE) {
            name
          }
          jediHero: hero(episode: JEDI) {
            name
          }
        }
      `
    };
    const expected = {
      query: `
        {
          empireHero: hero(episode: EMPIRE) {
            name
          }
          jediHero: hero(episode: JEDI) {
            name
          }
        }
      `
    };
    expect(graphQL.compare(actual, expected)).to.be.true;
  });

  it('query with alias & different indentation', () => {
    const actual = {
      query: `{
        empireHero: hero(episode: EMPIRE) { name }
        jediHero: hero(episode: JEDI) { name }
      }`
    };
    const expected = {
      query: `
        {
          empireHero: hero(episode: EMPIRE) {
            name
          }
          jediHero: hero(episode: JEDI) {
            name
          }
        }
      `
    };
    expect(graphQL.compare(actual, expected)).to.be.true;
  });

  it('invalid query with alias', () => {
    const actual = {
      query: `{
        empireHero: hero(episode: EMPIRE) {
          name
        }
        jediHero: hero(episode: JEDI) {
          name
        }
      }`
    };
    const expected = {
      query: `
      {
        empireHero: hero(episode: EMPIRE) {
          name
        }
        jediHero: hero(episode: MODI) {
          name
        }
      }
      `
    };
    expect(graphQL.compare(actual, expected)).to.be.false;
  });

  it('query with fragments', () => {
    const actual = {
      query: `
        {
          leftComparison: hero(episode: EMPIRE) {
            ...comparisonFields
          }
          rightComparison: hero(episode: JEDI) {
            ...comparisonFields
          }
        }

        fragment comparisonFields on Character {
          name
          appearsIn
          friends {
            name
          }
        }
      `
    };
    const expected = {
      query: `
        {
          leftComparison: hero(episode: EMPIRE) {
            ...comparisonFields
          }
          rightComparison: hero(episode: JEDI) {
            ...comparisonFields
          }
        }
        fragment comparisonFields on Character {
          name
          appearsIn
          friends {
            name
          }
        }
      `
    };
    expect(graphQL.compare(actual, expected)).to.be.true;
  });

  it('query with fragments & different indentation', () => {
    const actual = {
      query: `{
        leftComparison: hero(episode: EMPIRE) {
          ...comparisonFields
        }
        rightComparison: hero(episode: JEDI) {
          ...comparisonFields
        }
      }

      fragment comparisonFields on Character {
        name
        appearsIn
        friends {
          name
        }
      }`
    };
    const expected = {
      query: `
      {
              leftComparison: hero(episode: EMPIRE) {
          ...comparisonFields
        }
                    rightComparison: hero(episode: JEDI) {
          ...comparisonFields
        }
      }

      fragment comparisonFields on Character {
        name
        appearsIn
        friends {
          name }
      }
      `
    };
    expect(graphQL.compare(actual, expected)).to.be.true;
  });

  it('invalid query with fragments', () => {
    const actual = {
      query: `{
        leftComparison: hero(episode: EMPIRE) {
          ...comparisonFields
        }
        rightComparison: hero(episode: JEDI) {
          ...comparisonFields
        }
      }

      fragment comparisonFields on Character {
        name
        appearsIn
        friends {
          name
        }
      }`
    };
    const expected = {
      query: `
      {
        leftComparison: hero(episode: EMPIRE) {
          ...comparisonFields
        }
        rightComparison: hero(episode: JEDI) {
          ...comparisonFields
        }
      }

      fragment comparisonFields on Character {
        appearsIn
        friends {
          name
        }
      }
      `
    };
    expect(graphQL.compare(actual, expected)).to.be.false;
  });

  it('query with operation name', () => {
    const actual = {
      query: `
        query HeroNameAndFriends {
          hero {
            name
            friends {
              name
            }
          }
        }
      `
    };
    const expected = {
      query: `
        query HeroNameAndFriends {
          hero {
            name
            friends {
              name
            }
          }
        }
      `
    };
    expect(graphQL.compare(actual, expected)).to.be.true;
  });

  it('query with operation name & different indentation', () => {
    const actual = {
      query: `query HeroNameAndFriends {
        hero {
          name
          friends {
            name
          }
        }
      }`
    };
    const expected = {
      query: `
        query HeroNameAndFriends {
          hero {
            name
            friends {
              name
            }
          }
        }
      `
    };
    expect(graphQL.compare(actual, expected)).to.be.true;
  });

  it('invalid query with operation name', () => {
    const actual = {
      query: `query HeroNameAndFriends {
        hero {
          name
          friends {
            name
          }
        }
      }`
    };
    const expected = {
      query: `
        query HeroFriends {
          hero {
            name
            friends {
              name
            }
          }
        }
      `
    };
    expect(graphQL.compare(actual, expected)).to.be.false;
  });

  it('query with variables', () => {
    const actual = {
      query: `
        query HeroNameAndFriends($episode: Episode) {
          hero(episode: $episode) {
            name
            friends {
              name
            }
          }
        }
      `,
      variables: {
        "episode": "JEDI"
      }
    };
    const expected = {
      query: `
        query HeroNameAndFriends($episode: Episode) {
          hero(episode: $episode) {
            name
            friends {
              name
            }
          }
        }
      `,
      variables: {
        "episode": "JEDI"
      }
    };
    expect(graphQL.compare(actual, expected)).to.be.true;
  });

  it('query with variables & different indentation', () => {
    const actual = {
      query: `
        query HeroNameAndFriends($episode: Episode) {
          hero(episode: $episode) {
            name
            friends {
              name
            }
          }
        }
      `,
      variables: {
        "episode": "JEDI"
      }
    };
    const expected = {
      query: `
        query HeroNameAndFriends($episode: Episode) {
          hero(episode: $episode) {
            name
            friends { name }
          }
        }
      `,
      variables: {
        "episode": "JEDI"
      }
    };
    expect(graphQL.compare(actual, expected)).to.be.true;
  });

  it('invalid query with variables', () => {
    const actual = {
      query: `
        query HeroNameAndFriends($episode: Episode) {
          hero(episode: $episode) {
            name
            friends {
              name
            }
          }
        }
      `,
      variables: {
        "episode": "JEDI"
      }
    };
    const expected = {
      query: `
        query HeroNameAndFriends($episode: Episode) {
          hero(episode: $episode) {
            name
            friends {
              name
            }
          }
        }
      `,
      variables: {
        "episode": "MODI"
      }
    };
    expect(graphQL.compare(actual, expected)).to.be.false;
  });

});