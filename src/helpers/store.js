const Interaction = require('../models/interaction');
const { Pact, PactInteraction } = require('../models/pact');

const store = {

  pacts: new Map(),

  /**
   * saves interaction in the store
   * @param {Interaction} interaction 
   */
  saveInteraction(interaction) {
    const { consumer, provider } = interaction;
    const key = `${consumer}-${provider}`;
    let pact;
    if (this.pacts.has(key)) {
      pact = this.pacts.get(key);
    } else {
      pact = new Pact(consumer, provider);
      this.pacts.set(key, pact);
    }
    const pactInteraction = new PactInteraction();
    pactInteraction.request.method = interaction.withRequest.method;
    pactInteraction.request.path = interaction.withRequest.path;
    pactInteraction.request.query = getPlainQuery(interaction.withRequest.query);
    pactInteraction.response.status = interaction.willRespondWith.status;
    pactInteraction.response.body = interaction.willRespondWith.body;
    pactInteraction.response.matchingRules = getMatchingRules({}, interaction.willRespondWith.rawBody, '$.body');
    pact.interactions.push(pactInteraction);
  }

}

function getPlainQuery(query) {
  let plainQuery = '';
  for (const prop in query) {
    if (plainQuery !== '') {
      plainQuery = plainQuery + '&';
    }
    plainQuery = plainQuery + `${prop}=${query[prop]}`;
  }
  return plainQuery;
}

function getMatchingRules(matchingRules, data, path) {
  if (typeof data === 'object' && !Array.isArray(data)) {
    for (const prop in data) {
      if (typeof data[prop] === 'object' && !Array.isArray(data)) {
        if (data[prop].json_class === 'Pact::SomethingLike') {
          matchingRules[`${path}.${prop}`] = {
            match: 'type'
          };
        } else if (data[prop].json_class === 'Pact::Term') {
          matchingRules[`${path}.${prop}`] = {
            match: 'regex',
            regex: data[prop].data.matcher.s
          };
        } else if (data[prop].json_class === 'Pact::ArrayLike') {
          matchingRules[`${path}.${prop}`] = {
            min: data[prop].min
          };
          matchingRules[`${path}.${prop}[*].*`] = {
            match: 'type'
          };
          if (typeof data[prop].value[0] === 'object' && !Array.isArray(data[prop].value[0])) {
            const newPath = `${path}.${prop}[*]`;
            getMatchingRules(matchingRules, data[prop].value[0], newPath);
          }
        } else {
          const newPath = `${path}.${prop}`;
          getMatchingRules(matchingRules, data[prop], newPath);
        }
      }
    }
  }
}

// testing code

// const data = {
//   id: {
//     contents: '1',
//     value: '1',
//     json_class: "Pact::SomethingLike"
//   },
//   name: 'fake',
//   gender: {
//     data: {
//       generate: 'M',
//       matcher: {
//         json_class: "Regexp",
//         o: 0,
//         s: 'M|F',
//       },
//     },
//     value: 'M',
//     json_class: "Pact::Term"
//   },
//   grades: {
//     physics: 60,
//     maths: {
//       contents: 100,
//       value: 100,
//       json_class: "Pact::SomethingLike"
//     },
//     sciences: {
//       chemistry: 45,
//       biology: {
//         data: {
//           generate: 'M',
//           matcher: {
//             json_class: "Regexp",
//             o: 0,
//             s: 'M|F',
//           },
//         },
//         value: 'M',
//         json_class: "Pact::Term"
//       }
//     }
//   },
//   items: {
//     contents: '1',
//     value: [1],
//     json_class: "Pact::ArrayLike",
//     min: 1,
//   },
//   components: {
//     value: [{
//       id: {
//         contents: '1',
//         value: '1',
//         json_class: "Pact::SomethingLike"
//       },
//       name: 'fake'
//     }],
//     json_class: "Pact::ArrayLike",
//     min: 1,
//   }
// }
// const mm = {}
// getMatchingRules(mm, data, '$.body');

// console.log(mm)

module.exports = store;