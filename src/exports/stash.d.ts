/**
 * loads data templates & maps from file system
 * @example
 * stash.loadData('./data');
 */
export function loadData(path?: string): void;

/**
 * adds data maps
 * @example
 * stash.addDataMap({
 *  'User': {
 *    name: 'Snow',
 *    age: 26
 *  }
 * });
 */
export function addDataMap(maps: object): void;

/**
 * adds data maps
 * @example
 * stash.addDataMap([
 *  {
 *    'UserOne': { name: 'Snow' }
 *  }
 *  {
 *    'UserTwo': { name: 'John' }
 *  }
 * ]);
 */
export function addDataMap(maps: object[]): void;

/**
 * adds data maps
 * @example
 * stash.addDataMap('PASSWORD', 'password@123');
 * stash.addDataMap('CREDENTIALS', { username: 'john', password: 'password@123' });
 */
export function addDataMap(key: string, value: any): void;

/**
 * returns data map
 */
export function getDataMap(): object;

/**
 * @example
 * const username = stash.getDataMap('CREDENTIALS.username');
 */
export function getDataMap(path: string): any;

export function clearDataMaps(): void;

/**
 * adds data templates
 * @example
 * stash.addDataTemplate({
 *  'User:NewUser': {
 *    'Name': 'Snow',
 *    'Age': 26,
 *    'Address': []
 *  }
 * });
 */
export function addDataTemplate(templates: object): void;
export function addDataTemplate(templates: object[]): void;

/**
 *
 * @example
 * stash.addDataTemplate('USER:NEW', { name: 'john', age: 28 });
 */
export function addDataTemplate(key: string, value: object): void;


export function getDataTemplate(): object;

/**
 * @example
 * const credentials = stash.getDataTemplate('CREDENTIALS');
 */
export function getDataTemplate(path: string): object;

export function clearDataTemplates(): void;


/**
 * adds data store
 * @example
 * stash.addDataStore({
 *  'User': {
 *    name: 'Snow',
 *    age: 26
 *  }
 * });
 */
export function addDataStore(store: object): void;

/**
 * adds data stores
 * @example
 * stash.addDataStore('PASSWORD', 'password@123');
 * stash.addDataStore('CREDENTIALS', { username: 'john', password: 'password@123' });
 */
export function addDataStore(key: string, value: any): void;

export function getDataStore(): object;
export function getDataStore(path: string): any;
export function clearDataStores(): void;

export function getStoreKey(key: string): string;
export function getMapKey(key: string): string;
export function getFunctionKey(key: string): string;
export function setDirectOverride(value: boolean): void;