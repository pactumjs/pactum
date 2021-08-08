const { validator } = require('@exodus/schemasafe');

function validate(schema, target, options = {}) {
  options.includeErrors = true;
  const validate = validator(schema, options);
  validate(target);
  if (validate.errors) {
    return JSON.stringify(validate.errors, null, 2);
  }
}

module.exports = {
  validate
};