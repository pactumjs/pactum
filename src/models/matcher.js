const { PactumMatcherError } = require('../helpers/errors');
class Matcher {

  /**
   * type matching
   * @param {any} value - value for which type should be matched
   */
  like(value) {
    return like(value);
  }

  /**
   * type matching
   * @param {any} value - value for which type should be matched
   */
  somethingLike(value) {
    return like(value);
  }

  /**
   * regex matching
   * @param {object} options -matching options
   * @param {string} options.generate - value to be generated
   * @param {string} options.matcher - regex
   */
  term(options) {
    return term(options);
  }

  /**
   * regex matching
   * @param {object} options - matching options
   * @param {string} options.generate - value to be generated
   * @param {string} options.matcher - regex
   */
  regex(options) {
    return term(options);
  }

  /**
   * array matcher
   * @param {any} content - value for which type should be matched
   * @param {object} options - matching options
   */
  eachLike(content, options) {
    let min = 1;
    if (options && typeof options.min === 'number') {
      min = options.min;
    }
    const data = [];
    for (let i = 0; i < min; i++) {
      data[i] = content;
    }
    return {
      contents: content,
      value: data,
      json_class: "Pact::ArrayLike",
      min,
    };
  }

  /**
   * contains matching
   * @param {string} value - value to be present
   */
  contains(value) {
    const options = {
      generate: value,
      matcher: value
    };
    return term(options);
  }

}

function like(value) {
  return {
    contents: value,
    value,
    json_class: "Pact::SomethingLike"
  };
}

function term(options) {
  if (typeof options !== 'object') {
    throw new PactumMatcherError(`Invalid matching options - ${options}`);
  }
  if (typeof options.matcher === 'object') {
    options.matcher = options.matcher.source;
  }
  const { generate, matcher } = options;
  return {
    data: {
      generate,
      matcher: {
        json_class: "Regexp",
        o: 0,
        s: matcher,
      },
    },
    value: generate,
    json_class: "Pact::Term"
  };
}

module.exports = Matcher;