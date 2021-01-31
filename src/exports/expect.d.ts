export interface Have {
  status(code: number): void;
  header(key: string, value: any): void;
  headerContains(key: string, value: any): void;
  body(value: any): void;
  bodyContains(value: any): void;
  json(value: any): void;
  jsonAt(path: string, value: any): void;
  jsonLike(value: any): void;
  jsonLikeAt(path: string, value: any): void;
  jsonSchema(schema: object): void;
  jsonSchemaAt(path: string, schema: object): void;
  jsonMatch(value: object): void;
  jsonMatchAt(path: string, value: object): void;
  responseTimeLessThan(ms: number): void;
  _(handler: string, data: any): Promise<void>;
}

export interface To {
  have: Have;
}

export interface Expect {
  to: To;
  should: To;
}

declare function expect(response: any): Expect;

export = expect;