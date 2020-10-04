const { validator } = require('@exodus/schemasafe');

const jsv = {

  validate(schema, target) {
    const validate = validator(schema, { includeErrors: true });
    validate(target);
    return validate.errors;
  }

};

module.exports = jsv;