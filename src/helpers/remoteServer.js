const phin = require('phin');
const { PactumInteractionError } = require('./errors');
const config = require('../config');

const remote = {

  addMockInteraction(interactions, data) {
    return post(`${config.mock.remote}/api/pactum/mockInteractions`, interactions);
  },

  addPactInteraction(interaction, data) {
    return post(`${config.mock.remote}/api/pactum/pactInteractions`, interaction);
  },

  async getInteraction(ids) {
    const interactions = await Promise.all([
      get(`${config.mock.remote}/api/pactum/pactInteractions?ids=${ids.join(',')}`),
      get(`${config.mock.remote}/api/pactum/mockInteractions?ids=${ids.join(',')}`)
    ]);
    return interactions[0].concat(interactions[1]);
  },

  removeInteraction(ids) {
    return Promise.all([
      del(`${config.mock.remote}/api/pactum/pactInteractions?ids=${ids.join(',')}`),
      del(`${config.mock.remote}/api/pactum/mockInteractions?ids=${ids.join(',')}`)
    ]);
  },

  clearInteractions() {
    return Promise.all([
      del(`${config.mock.remote}/api/pactum/pactInteractions`),
      del(`${config.mock.remote}/api/pactum/mockInteractions`)
    ]);
  }

}

async function get(url) {
  const res = await phin({
    url,
    method: 'GET'
  });
  if (res.statusCode === 200) {
    return JSON.parse(res.body);
  }
  throw new PactumInteractionError(res.body.toString());
}

async function post(url, body) {
  const res = await phin({
    url,
    method: 'POST',
    data: body
  });
  if (res.statusCode === 200) {
    const ids = JSON.parse(res.body);
    if (ids.length === 1) {
      return ids[0];
    }
    return ids;
  }
  throw new PactumInteractionError(res.body.toString());
}

async function del(url) {
  const res = await phin({
    url,
    method: 'DELETE'
  });
  if (res.statusCode !== 200) {
    throw new PactumInteractionError(res.body.toString());
  }
}

module.exports = remote;