class Matcher {

  like(value) {
    return {
      contents: value,
      getValue: () => {
        return value
      },
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
      getValue: () => {
        return generate
      },
      json_class: "Pact::Term"
    }
  }

  eachLike(content, options) {
    let min = 1;
    if (options && typeof options.min === 'number') {
      min = options.min;
    }
    return {
      contents: content,
      getValue: () => {
        const data = []
        for (let i = 0; i < min; i++) {
          data[i] = content
        }
        return data
      },
      json_class: "Pact::ArrayLike",
      min,
    }
  }

}

module.exports = Matcher