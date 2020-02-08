class Matcher {

  /**
   * type matching
   * @param {any} value - value for which type should be matched
   */
  like(value) {
    return {
      contents: value,
      value,
      json_class: "Pact::SomethingLike"
    };
  }

  /**
   * type matching
   * @param {any} value - value for which type should be matched
   */
  somethingLike(value) {
    return this.like(value);
  }

  /**
   * regex matching
   * @param {object} options -matching options
   * @param {string} options.generate - value to be generated
   * @param {string} options.matcher - regex
   */
  term(options) {
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

  /**
   * regex matching
   * @param {object} options - matching options
   * @param {string} options.generate - value to be generated
   * @param {string} options.matcher - regex
   */
  regex(options) {
    return this.term(options);
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

}

module.exports = Matcher;