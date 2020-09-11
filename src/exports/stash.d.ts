/**
 * loads data maps
 * @example
 * stash.loadDataMaps({
 *  'User': {
 *    'Name': 'Snow',
 *    'Age': 26
 *  }
 * });
 */
export function loadDataMaps(maps: object): void;

/**
 * loads data templates
 * @example
 * stash.loadDataTemplates({
 *  'User.NewUser': {
 *    'Name': 'Snow',
 *    'Age': 26,
 *    'Address': []
 *  }
 * });
 */
export function loadDataTemplates(template: object): void;