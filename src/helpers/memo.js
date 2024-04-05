const jmv = require('../plugins/json.match');

const specs = {};

function memorize_spec(name, props) {
  if (!specs[name]) {
    specs[name] = [];
  }
  specs[name].push({ props });
}

function is_spec_memoized(name, new_props) {
  const items = specs[name];
  if (!items) {
    return false;
  }
  for (const item of items) { 
    const rules = jmv.getMatchingRules(item.props, '$');
    const errors = jmv.validate(item.props, new_props, rules, '$', true);
    if (!errors) { 
      return true;
    }
  }
  return false;
}

module.exports = {
  memorize_spec,
  is_spec_memoized
}