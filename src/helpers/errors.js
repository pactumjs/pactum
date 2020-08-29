class PactumInteractionError extends Error {}
class PactumRequestError extends Error {}
class PactumConfigurationError extends Error {}
class PactumMatcherError extends Error {}
class PactumOptionsError extends Error {}
class PactumHandlerError extends Error {}

module.exports = {
  PactumInteractionError,
  PactumRequestError,
  PactumConfigurationError,
  PactumMatcherError,
  PactumOptionsError,
  PactumHandlerError
};