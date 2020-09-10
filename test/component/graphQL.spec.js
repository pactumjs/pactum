const pactum = require('../../src/index');

describe('GraphQL', () => {

  it('with single line graphql query', async () => {
    await pactum
      .useMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/api/graphql',
          graphQL: {
            query: `{ hello }`
          }
        },
        willRespondWith: {
          status: 200,
          body: {
            data: {
              hello: 'Hello World'
            }
          }
        }
      })
      .post('http://localhost:9393/api/graphql')
      .withGraphQLQuery(`{ hello }`)
      .expectStatus(200)
      .expectJson({
        data: {
          hello: 'Hello World'
        }
      })
      .toss();
  });

  it('with multi line graphql query', async () => {
    await pactum
      .useMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/api/graphql',
          graphQL: {
            query: `
              {
                hero {
                  name
                }
              }
            `
          }
        },
        willRespondWith: {
          status: 200,
          body: {
            data: {
              hero: {
                name: 'R2-D2'
              }
            }
          }
        }
      })
      .post('http://localhost:9393/api/graphql')
      .withJson({
        query: `
          {
            hero {
              name
            }
          }
        `
      })
      .expectStatus(200)
      .expectJson({
        data: {
          hero: {
            name: 'R2-D2'
          }
        }
      })
      .toss();
  });

  it('with nested graphql query', async () => {
    await pactum
      .useMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/api/graphql',
          graphQL: {
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
          }
        },
        willRespondWith: {
          status: 200,
          body: {
            "data": {
              "hero": {
                "name": "R2-D2",
                "friends": [
                  {
                    "name": "Luke"
                  },
                  {
                    "name": "Han Solo"
                  },
                  {
                    "name": "Organa"
                  }
                ]
              }
            }
          }
        }
      })
      .post('http://localhost:9393/api/graphql')
      .withJson({
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
      })
      .expectStatus(200)
      .expectJson({
        "data": {
          "hero": {
            "name": "R2-D2",
            "friends": [
              {
                "name": "Luke"
              },
              {
                "name": "Han Solo"
              },
              {
                "name": "Organa"
              }
            ]
          }
        }
      })
      .toss();
  });

  it('with arguments graphql query', async () => {
    await pactum
      .useMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/api/graphql',
          graphQL: {
            query: `
              {
                human(id: "1000") {
                  name
                  height
                }
              }
            `
          }
        },
        willRespondWith: {
          status: 200,
          body: {
            "data": {
              "human": {
                "name": "Luke",
                "height": 1.72
              }
            }
          }
        }
      })
      .post('http://localhost:9393/api/graphql')
      .withJson({
        query: `{ human(id: "1000") { name, height } }`
      })
      .expectStatus(200)
      .expectJson({
        "data": {
          "human": {
            "name": "Luke",
            "height": 1.72
          }
        }
      })
      .toss();
  });

  it('with enum arguments graphql query', async () => {
    await pactum
      .useMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/api/graphql',
          graphQL: {
            query: `
              {
                human(id: "1000") {
                  name
                  height(unit: FOOT)
                }
              }
            `
          }
        },
        willRespondWith: {
          status: 200,
          body: {
            "data": {
              "human": {
                "name": "Luke",
                "height": 5.6430448
              }
            }
          }
        }
      })
      .post('http://localhost:9393/api/graphql')
      .withJson({
        query: `{
          human(id: "1000") {
            name
            height(unit: FOOT)
          }
        }`
      })
      .expectStatus(200)
      .expectJson({
        "data": {
          "human": {
            "name": "Luke",
            "height": 5.6430448
          }
        }
      })
      .toss();
  });

  it('with alias graphql query', async () => {
    await pactum
      .useMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/api/graphql',
          graphQL: {
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
          }
        },
        willRespondWith: {
          status: 200,
          body: {
            "data": {
              "empireHero": {
                "name": "Luke"
              },
              "jediHero": {
                "name": "R2-D2"
              }
            }
          }
        }
      })
      .post('http://localhost:9393/api/graphql')
      .withJson({
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
      })
      .expectStatus(200)
      .expectJson({
        "data": {
          "empireHero": {
            "name": "Luke"
          },
          "jediHero": {
            "name": "R2-D2"
          }
        }
      })
      .toss();
  });

  it('with fragments graphql query', async () => {
    await pactum
      .useMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/api/graphql',
          graphQL: {
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
          }
        },
        willRespondWith: {
          status: 200,
          body: {
            "data": {
              "leftComparison": {
                "name": "Luke",
                "appearsIn": [
                  "EMPIRE",
                  "JEDI"
                ],
                "friends": [
                  {
                    "name": "Han Solo"
                  },
                  {
                    "name": "Organa"
                  },
                  {
                    "name": "C-3PO"
                  },
                  {
                    "name": "R2-D2"
                  }
                ]
              },
              "rightComparison": {
                "name": "R2-D2",
                "appearsIn": [
                  "EMPIRE",
                  "JEDI"
                ],
                "friends": [
                  {
                    "name": "Luke"
                  },
                  {
                    "name": "Han Solo"
                  },
                  {
                    "name": "Organa"
                  }
                ]
              }
            }
          }
        }
      })
      .post('http://localhost:9393/api/graphql')
      .withJson({
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
      })
      .expectStatus(200)
      .expectJson({
        "data": {
          "leftComparison": {
            "name": "Luke",
            "appearsIn": [
              "EMPIRE",
              "JEDI"
            ],
            "friends": [
              {
                "name": "Han Solo"
              },
              {
                "name": "Organa"
              },
              {
                "name": "C-3PO"
              },
              {
                "name": "R2-D2"
              }
            ]
          },
          "rightComparison": {
            "name": "R2-D2",
            "appearsIn": [
              "EMPIRE",
              "JEDI"
            ],
            "friends": [
              {
                "name": "Luke"
              },
              {
                "name": "Han Solo"
              },
              {
                "name": "Organa"
              }
            ]
          }
        }
      })
      .toss();
  });

  it('with operation name graphql query', async () => {
    await pactum
      .useMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/api/graphql',
          graphQL: {
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
          }
        },
        willRespondWith: {
          status: 200,
          body: {
            "data": {
              "hero": {
                "name": "R2-D2",
                "friends": [
                  {
                    "name": "Luke"
                  },
                  {
                    "name": "Han Solo"
                  },
                  {
                    "name": "Organa"
                  }
                ]
              }
            }
          }
        }
      })
      .post('http://localhost:9393/api/graphql')
      .withJson({
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
      })
      .expectStatus(200)
      .expectJson({
        "data": {
          "hero": {
            "name": "R2-D2",
            "friends": [
              {
                "name": "Luke"
              },
              {
                "name": "Han Solo"
              },
              {
                "name": "Organa"
              }
            ]
          }
        }
      })
      .toss();
  });

  it('with variables', async () => {
    await pactum
      .useMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/api/graphql',
          graphQL: {
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
          }
        },
        willRespondWith: {
          status: 200,
          body: {
            data: {
              hero: {
                name: 'R2-D2'
              }
            }
          }
        }
      })
      .post('http://localhost:9393/api/graphql')
      .withGraphQLQuery(`
        query HeroNameAndFriends($episode: Episode) {
          hero(episode: $episode) {
            name
            friends {
              name
            }
          }
        }`
      )
      .withGraphQLVariables({
        "episode": "JEDI"
      })
      .expectStatus(200)
      .expectJson({
        data: {
          hero: {
            name: 'R2-D2'
          }
        }
      })
      .toss();
  });

});