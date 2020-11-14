const processor = require('./dataProcessor');
const helper = require('./helper');
const config = require('../config');

const requestProcessor = {

  process(request) {
    processor.processMaps();
    processor.processTemplates();
    request = processor.processData(request);
    const query = helper.getPlainQuery(request.qs);
    if (query) {
      request.url = request.url + '?' + query;
    }
    setBaseUrl(request);
    request.timeout = request.timeout || config.request.timeout;
    setHeaders(request);
    setMultiPartFormData(request);
    setFollowRedirects(request);
    return request;
  }

};


function setBaseUrl(request) {
  if (config.request.baseUrl && !request.url.startsWith('http')) {
    request.url = config.request.baseUrl + request.url;
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