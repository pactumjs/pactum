class PactumInteractionError extends Error {}
class ConfigurationError extends Error {}
class MatcherError extends Error {}
class VerificationError extends Error {}

module.exports = {
  PactumInteractionError,
  ConfigurationError,
  MatcherError,
  VerificationError
}