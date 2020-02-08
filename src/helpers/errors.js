class PactumInteractionError extends Error {}
class PactumRequestError extends Error {}
class PactumConfigurationError extends Error {}

module.exports = {
  PactumInteractionError,
  PactumRequestError,
  PactumConfigurationError
};