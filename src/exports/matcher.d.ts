interface EachLikeOptions {
  min?: number;
}

interface RegexOptions {
  generate: string;
  matcher: string;
}

/**
 * type matching
 */
export function like(value: any): object;
export function somethingLike(value: any): object;

/**
 * array type matching 
 */
export function eachLike(content: any, options?: EachLikeOptions): object;

export function term(value: any): object;

/**
 * regex matching
 */
export function regex(value: string): object;
export function regex(value: RegExp): object;
export function regex(options: RegexOptions): object;

/**
 * partial regex matching
 */
export function contains(value: string | number): object;