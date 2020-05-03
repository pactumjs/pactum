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
   * @param {(object|string|RegExp)} options - matching options
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
   * @param {number} options.min - min number of elements
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
  if (!(typeof options === 'object' || typeof options === 'string') || options === null) {
    throw new PactumMatcherError(`Invalid regex matching options - ${options}`);
  }
  if (typeof options === 'string') {
    const matcher = options;
    let isValid = true;
    try {
      new RegExp(matcher);
    } catch (error) {
      isValid = false;
    }
    if (!isValid) {
      throw new PactumMatcherError(`Invalid regex matching options - ${options}`);
    }
    options = {
      generate: '',
      matcher
    };
  } else if (options instanceof RegExp) {
    const matcher = options.source;
    options = {
      generate: '',
      matcher
    };
  } else {
    if (typeof options.matcher === 'object') {
      options.matcher = options.matcher.source;
    }
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