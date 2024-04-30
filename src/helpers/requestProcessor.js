const { URL } = require('url');
const stash = require('../exports/stash');
const processor = require('./dataProcessor');
const helper = require('./helper');
const config = require('../config');
const fd = require('../plugins/form.data')

const requestProcessor = {

  process(request, local_data_maps) {
    process_local_data_maps(local_data_maps);
    processor.processMaps();
    processor.processTemplates();
    request = processor.processData(request);
    config.request = processor.processData(config.request);
    setBaseUrl(request);
    setPathParams(request);
    setGraphQLParams(request);
    setQueryParams(request);
    setBody(request);
    setFormData(request);
    setMultiPartFormData(request);
    setFollowRedirects(request);
    setHeaders(request);
    request.timeout = request.timeout || config.request.timeout;
    return request;
  }

};

/**
 *
 * @param {any[]} local_data_maps
 */
function process_local_data_maps(local_data_maps) {
  if (local_data_maps) {
    for (const local_data_map of local_data_maps) {
      stash.addDataMap(local_data_map.key, local_data_map.value);
    }
  }
}

function setBaseUrl(request) {
  if (config.request.baseUrl && request.url && !request.url.startsWith('http')) {
    request.url = config.request.baseUrl + request.url;
  }
  const _url = new URL(request.url);
  request.path = decodeURI(_url.pathname);
}

function setPathParams(request) {
  if (request.pathParams) {
    for (const pathParam of Object.keys(request.pathParams)) {
      request.url = request.url.replace(`{${pathParam}}`, request.pathParams[pathParam]);
    }
  }
}

function setGraphQLParams(request) {
  if (request.method === 'GET' && request.data) {
    if (request.data.query) {
      request.queryParams = request.queryParams ? request.queryParams : {};
      request.queryParams.query = request.data.query;
      if (request.data.variables) request.queryParams.variables = JSON.stringify(request.data.variables);
      delete request.data;
    }
  }
}

function setQueryParams(request) {
  const query = helper.getPlainQuery(request.queryParams);
  if (query) {
    request.url = request.url + '?' + query;
  }
}

function setHeaders(request) {
  if (Object.keys(config.request.headers).length > 0) {
    if (!request.headers) {
      request.headers = {};
    }
    for (const prop in config.request.headers) {
      if (prop in request.headers) {
        continue;
      } else {
        request.headers[prop] = config.request.headers[prop];
      }
    }
  }
}

function setBody(request) {
  if (request.data) {
    request.body = request.data;
  }
  if (request.body) {
    request.data = request.body;
  }
}

function setFormData(request) {
  if (request._forms) {
    request.form = {};
    for (let i = 0; i < request._forms.length; i++) {
      const { key, value } = request._forms[i];
      if (typeof key === 'string') {
        request.form[key] = value;
      } else {
        for (const form_key of Object.keys(key)) {
          request.form[form_key] = key[form_key];
        }
      }
    }
    delete request._forms;
  }
}

function setMultiPartFormData(request) {
  if (request._multi_parts) {
    const FormData = fd.get();
    let multi_part_form_data;
    for (let i = 0; i < request._multi_parts.length; i++) {
      const { key, value, options } = request._multi_parts[i];
      if (key instanceof FormData) {
        multi_part_form_data = key;
      } else {
        if (typeof multi_part_form_data === 'undefined') {
          multi_part_form_data = new FormData();
        }
        if (typeof key === 'string') {
          multi_part_form_data.append(key, value, options);
        } else {
          for (const form_key of Object.keys(key)) {
            multi_part_form_data.append(form_key, key[form_key], options);
          }
        }

      }
    }
    request.data = multi_part_form_data.getBuffer();
    const multi_part_headers = multi_part_form_data.getHeaders();
    if (!request.headers) {
      request.headers = multi_part_headers;
    } else {
      for (const prop in multi_part_headers) {
        if (request.headers[prop] === undefined) {
          request.headers[prop] = multi_part_headers[prop];
        }
      }
    }
    delete request._multi_parts;
  }
}

function setFollowRedirects(request) {
  if (config.request.followRedirects && typeof request.followRedirects === 'undefined') {
    request.followRedirects = config.request.followRedirects;
  }
}

module.exports = requestProcessor;