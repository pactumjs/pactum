export interface Have {
  status(code: number): void;
  header(key: string, value: any): void;
  headerContains(key: string, value: any): void;
  cookiesLike(key: any, value?: any): void;
  cookies(key: any, value?: any): void;
  body(value: any): void;
  bodyContains(value: any): void;
  json(value: any): void;
  json(path: string, value: any): void;
  jsonLike(value: any): void;
  jsonLike(path: string, value: any): void;
  jsonSchema(schema: object): void;
  jsonSchema(schema: object, options: object): void;
  jsonSchema(path: string, schema: object): void;
  jsonSchema(path: string, schema: object, options: object): void;
  jsonMatch(value: object): void;
  jsonMatch(path: string, value: object): void;
  jsonMatchStrict(value: object): void;
  jsonMatchStrict(path: string, value: object): void;
  jsonLength(value: number): void;
  jsonLength(path: string, value: number): void;
  jsonSnapshot(value?: any): void;
  jsonSnapshot(name: string, value?: any): void;
  responseTimeLessThan(ms: number): void;
  error(err?: string | object): void;
  _(handler: string, data: any): Promise<void>;
}

export interface To {
  have: Have;
}

export interface Expect {
  to: To;
  should: To;
}

export default function expect(response: any, spec: any): Expect;
