/**
 * loads data map
 * @example
 * stash.loadDataMap({
 *  'User': {
 *    'Name': 'Snow',
 *    'Age': 26
 *  }
 * });
 */
export function loadDataMap(map: object): void;
/**
 * loads multiple data maps
 */
export function loadDataMaps(maps: object[]): void;
/**
 * loads data template
 * @example
 * stash.loadDataTemplate({
 *  'User.NewUser': {
 *    'Name': 'Snow',
 *    'Age': 26,
 *    'Address': []
 *  }
 * });
 */
export function loadDataTemplate(template: object): void;
/**
 * loads multiple data templates
 */
export function loadDataTemplates(templates: object[]): void;