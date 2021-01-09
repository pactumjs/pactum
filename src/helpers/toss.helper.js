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

function getPathValueFromSpec(path, spec) {
  let data;
  if (path.startsWith('req.headers')) {
    path = path.replace('req.headers', '');
    data = spec._request.headers;
  } else if (path.startsWith('req.body')) {
    path = path.replace('req.body', '');
    data = spec._request.body;
  } else if (path.startsWith('res.headers')) {
    path = path.replace('res.headers', '');
    data = spec._response.headers;
  } else {
    path = path.replace('res.body', '');
    data = spec._response.json;
  }
  return jqy(path, { data }).value;
}

function storeSpecData(spec, stores) {
  const ctx = { req: spec._request, res: spec._response };
  for (let i = 0; i < stores.length; i++) {
    const store = stores[i];
    const specData = {};
    const captureHandler = getCaptureHandlerName(store.path);
    if (captureHandler) {
      specData[store.name] = hr.capture(captureHandler, ctx);
    } else {
      specData[store.name] = getPathValueFromSpec(store.path, spec);
    }
    stash.addDataStore(specData);
  }
}

function recordSpecData(spec, recorders) {
  const ctx = { req: spec._request, res: spec._response };
  recorders.forEach(recorder => {
    const { name, path } = recorder;
    const captureHandler = getCaptureHandlerName(path);
    if (captureHandler) {
      spec.recorded[name] = hr.capture(captureHandler, ctx);
    } else {
      spec.recorded[name] = getPathValueFromSpec(path, spec);
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
        outputs.push(getPathValueFromSpec(_return, spec));
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

module.exports = {
  storeSpecData,
  recordSpecData,
  getOutput
};