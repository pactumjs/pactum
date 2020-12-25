const phin = require('phin');
const { PactumInteractionError } = require('./errors');
const config = require('../config');

const remote = {

  addInteraction(interactions, data, alone) {
    return addInteractions(interactions, data, 'api/pactum/interactions', alone);
  },

  // addPactInteraction(interactions, data, alone) {
  //   return addInteractions(interactions, data, 'api/pactum/pactInteractions', 'PACT', alone);
  // },

  async getInteraction(ids, alone) {
    let interactions = await Promise.all([
      get(`${config.mock.remote}/api/pactum/pactInteractions?ids=${ids.join(',')}`),
      get(`${config.mock.remote}/api/pactum/mockInteractions?ids=${ids.join(',')}`)
    ]);
    interactions = interactions[0].concat(interactions[1]);
    return alone ? interactions[0] : interactions;
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

function getRawsAndHandlers(interactions) {
  const raws = [];
  const handlers = [];
  for (let i = 0; i < interactions.length; i++) {
    const interaction = interactions[i];
    if (typeof interaction === 'string') {
      handlers.push(interaction);
    } else {
      raws.push(interaction);
    }
  }
  return { raws, handlers };
}

function getHandlersPayload(handlerNames, type, data) {
  const payload = [];
  const handlers = [];
  for (let i = 0; i < handlerNames.length; i++) {
    const name = handlerNames[i];
    handlers.push({ name, type });
  }
  if (handlers.length > 0) {
    payload.push({ handlers, data });
  }
  return payload;
}

async function addInteractions(interactions, data, path, type, alone) {
  const { raws, handlers } = getRawsAndHandlers(interactions);
  let ids = [];
  if (raws.length > 0) {
    ids = ids.concat(await post(`${config.mock.remote}/${path}`, raws));
  }
  if (handlers.length > 0) {
    const payload = getHandlersPayload(handlers, type, data);
    ids = ids.concat(await post(`${config.mock.remote}/api/pactum/handlers`, payload));
  }
  return alone ? ids[0] : ids;
}

module.exports = remote;