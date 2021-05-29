const url = require('url');
const processor = require('./dataProcessor');
const helper = require('./helper');
const config = require('../config');

const requestProcessor = {

  process(request) {
    processor.processMaps();
    processor.processTemplates();
    request = processor.processData(request);
    setBaseUrl(request);
    setPathParams(request);
    setGraphQLParams(request);
    setQueryParams(request);
    setBody(request);
    setMultiPartFormData(request);
    setFollowRedirects(request);
    setHeaders(request);
    request.timeout = request.timeout || config.request.timeout;
    return request;
  }

};

function setBaseUrl(request) {
  if (config.request.baseUrl && !request.url.startsWith('http')) {
    request.url = config.request.baseUrl + request.url;
  }
  const _url = url.parse(request.url);
  request.path = unescape(_url.pathname);
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

function setMultiPartFormData(request) {
  if (request._multiPartFormData) {
    request.data = request._multiPartFormData.getBuffer();
    const multiPartHeaders = request._multiPartFormData.getHeaders();
    if (!request.headers) {
      request.headers = multiPartHeaders;
    } else {
      for (const prop in multiPartHeaders) {
        request.headers[prop] = multiPartHeaders[prop];
      }
    }
    delete request._multiPartFormData;
  }
}

function setFollowRedirects(request) {
  if (config.request.followRedirects && typeof request.followRedirects === 'undefined') {
    request.followRedirects = config.request.followRedirects;
  }
}

module.exports = requestProcessor;