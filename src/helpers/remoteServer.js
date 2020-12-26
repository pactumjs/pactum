const phin = require('phin');
const { PactumInteractionError } = require('./errors');
const config = require('../config');

const remote = {

  addInteraction(interactions, data, alone) {
    return addInteractions(interactions, data, alone);
  },

  async getInteraction(ids, alone) {
    const interactions = await get(`${config.mock.remote}/api/pactum/interactions?ids=${ids.join(',')}`);
    return alone ? interactions[0] : interactions;
  },

  removeInteraction(ids) {
    return del(`${config.mock.remote}/api/pactum/interactions?ids=${ids.join(',')}`);
  },

  clearInteractions() {
    return del(`${config.mock.remote}/api/pactum/interactions`);
  }

};

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

function getRawsAndHandlers(interactions, data) {
  const raws = [];
  const handlers = [];
  for (let i = 0; i < interactions.length; i++) {
    const interaction = interactions[i];
    if (typeof interaction === 'string') {
      handlers.push({ name: interaction, data });
    } else if (typeof interaction === 'object' && typeof interaction.name === 'string') {
      handlers.push({ name: interaction.name, data: interaction.data || data });
    } else {
      raws.push(interaction);
    }
  }
  return { raws, handlers };
}

async function addInteractions(interactions, data, alone) {
  const { raws, handlers } = getRawsAndHandlers(interactions, data);
  let ids = [];
  if (raws.length > 0) {
    ids = ids.concat(await post(`${config.mock.remote}/api/pactum/interactions`, raws));
  }
  if (handlers.length > 0) {
    ids = ids.concat(await post(`${config.mock.remote}/api/pactum/handlers`, handlers));
  }
  return alone ? ids[0] : ids;
}

module.exports = remote;