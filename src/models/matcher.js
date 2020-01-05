class Matcher {

  like(value) {
    return {
      contents: value,
      value,
      json_class: "Pact::SomethingLike"
    }
  }

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
    }
  }

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
    }
  }

}

module.exports = Matcher