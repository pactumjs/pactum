class settings {

  constructor(pact, request, mock, logger) {
    this._pact = pact;
    this._request = request;
    this._mock = mock;
    this._logger = logger;
  }

  /**
   * sets log level
   * @param {('TRACE'|'DEBUG'|'INFO'|'WARN'|'ERROR')} level - log level
   */
  setLogLevel(level) {
    this._logger.setLevel(level);
  }

}

module.exports = settings;