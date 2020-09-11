export interface Have {
  status(code: number): void;
  header(key: string, value: any): void;
  headerContains(key: string, value: any): void;
  body(value: any): void;
  bodyContains(value: any): void;
  json(value: any): void;
  jsonLike(value: any): void;
  jsonQuery(path: string, value: any): void;
  jsonQueryLike(path: string, value: any): void;
  jsonSchema(schema: object): void;
  responseTimeLessThan(ms: number): void;
}

export interface To {
  have: Have;
}

export interface Expect {
  to: To;
}

declare function expect(response: any): Expect;

export = expect;