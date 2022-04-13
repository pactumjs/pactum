/**
 * loads data templates & maps from file system
 * @example
 * stash.loadData('./data');
 */
export function loadData(path?: string): void;

/**
 * loads data maps
 * @example
 * stash.addDataMap({
 *  'User': {
 *    'Name': 'Snow',
 *    'Age': 26
 *  }
 * });
 */
export function addDataMap(maps: object): void;
export function addDataMap(maps: object[]): void;

/**
 * loads data templates
 * @example
 * stash.addDataTemplate({
 *  'User.NewUser': {
 *    'Name': 'Snow',
 *    'Age': 26,
 *    'Address': []
 *  }
 * });
 */
export function addDataTemplate(templates: object): void;
export function addDataTemplate(templates: object[]): void;

export function getDataMap(): object;
export function getDataTemplate(): object;
export function getDataStore(): object;
export function getStoreKey(key: string): string;
export function getMapKey(key: string): string;
export function getFunctionKey(key: string): string;