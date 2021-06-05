const { validator } = require('@exodus/schemasafe');

function validate(schema, target) {
  const validate = validator(schema, { includeErrors: true });
  validate(target);
  if (validate.errors) {
    return JSON.stringify(validate.errors, null, 2);
  }
}

module.exports = {
  validate
};