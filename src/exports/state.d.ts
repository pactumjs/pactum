/**
 * runs the specified state handler
 * @example
 * await state.set('there is a user in system');
 */
export function set(name: string): Promise<void>;
/**
 * @example
 * await state.set('there is a user in system with', { name: 'stark' });
 */
export function set(name: string, data: any): Promise<void>;