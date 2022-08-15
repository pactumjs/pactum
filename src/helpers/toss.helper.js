const jqy = require('json-query');

const config = require('../config');
const helper = require('./helper');
const hr = require('./handler.runner');

const stash = require('../exports/stash');

function getCaptureHandlerName(name) {
  if (helper.matchesStrategy(name, config.strategy.capture.handler)) {
    return helper.sliceStrategy(name, config.strategy.capture.handler);
  }
}

function getPathValueFromRequestResponse(path, request, response) {
  let data;
  if (path.startsWith('req.pathParams')) {
    path = path.replace('req.pathParams', '');
    data = request.pathParams;
  } else if (path.startsWith('req.queryParams')) {
    path = path.replace('req.queryParams', '');
    data = request.query;
  } else if (path.startsWith('req.headers')) {
    path = path.replace('req.headers', '');
    data = request.headers;
  } else if (path.startsWith('req.body')) {
    path = path.replace('req.body', '');
    data = request.body;
  } else if (path.startsWith('res.headers')) {
    path = path.replace('res.headers', '');
    data = response.headers;
  } else {
    path = path.replace('res.body', '');
    data = response.json;
  }
  return jqy(path, { data }).value;
}

function storeSpecData(spec, stores) {
  const ctx = { req: spec._request, res: spec._response, store: stash.getDataStore() };
  for (let i = 0; i < stores.length; i++) {
    const store = stores[i];
    const specData = {};
    const captureHandler = getCaptureHandlerName(store.path);
    if (captureHandler) {
      specData[store.name] = hr.capture(captureHandler, ctx);
    } else {
      specData[store.name] = getPathValueFromRequestResponse(store.path, spec._request, spec._response);
    }
    stash.addDataStore(specData);
  }
}

function recordSpecData(spec, recorders) {
  const ctx = { req: spec._request, res: spec._response };
  recorders.forEach(recorder => {
    const { name, path } = recorder;
    if (typeof path === 'object') {
      spec.recorded[name] = path;
    } else {
      const captureHandler = getCaptureHandlerName(path);
      if (captureHandler) {
        spec.recorded[name] = hr.capture(captureHandler, ctx);
      } else {
        spec.recorded[name] = getPathValueFromRequestResponse(path, spec._request, spec._response);
      }
    }
  });
}

function getOutput(spec, returns) {
  const outputs = [];
  const ctx = { req: spec._request, res: spec._response };
  for (let i = 0; i < returns.length; i++) {
    const _return = returns[i];
    if (typeof _return === 'function') {
      outputs.push(_return(ctx));
    }
    if (typeof _return === 'string') {
      const captureHandler = getCaptureHandlerName(_return);
      if (captureHandler) {
        outputs.push(hr.capture(captureHandler, ctx));
      } else {
        outputs.push(getPathValueFromRequestResponse(_return, spec._request, spec._response));
      }
    }
  }
  if (outputs.length === 1) {
    return outputs[0];
  } else if (outputs.length > 1) {
    return outputs;
  } else {
    return spec._response;
  }
}

function storeInteractionData(request, interaction) {
  const interactionData = {};
  const { response, stores } = interaction;
  const ctx = { req: request, res: response, store: stash.getDataStore() };
  const names = Object.keys(stores);
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const path = stores[name];
    const captureHandler = getCaptureHandlerName(path);
    if (captureHandler) {
      interactionData[name] = hr.capture(captureHandler, ctx);
    } else {
      interactionData[name] = getPathValueFromRequestResponse(path, request, response);
    }
  }
  stash.addDataStore(interactionData);
}

module.exports = {
  storeSpecData,
  recordSpecData,
  getOutput,
  storeInteractionData,
  getPathValueFromRequestResponse
};