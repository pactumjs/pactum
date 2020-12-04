import { RequestOptions } from 'http';
import FormData from 'form-data';
import { MockInteraction, PactInteraction } from '../exports/mock';
import { ExpectHandlerFunction, RetryHandlerFunction, ReturnHandlerFunction } from '../exports/handler';
import { LogLevel } from '../exports/settings';
import { Expect } from '../exports/expect';

declare interface RetryOptions {
  /** maximum number of retries - defaults to 3 */
  count?: number;
  /** delay between retries - defaults to 3 */
  delay?: number;
  strategy?: string|RetryHandlerFunction;
}

export = Spec;

declare class Spec {
  constructor();

  /**
   * sets a custom name for the spec
   * @example
   * await pactum
   *  .name('Get Users From The System')
   *  .get('/api/users')
   *  .expectStatus(200);
   */
  name(value: string): Spec;

  /**
   * runs the specified state handler
   * @example
   * await pactum
   *  .setState('there are users in the system')
   *  .get('/api/users')
   *  .expectStatus(200);
   */
  setState(name: string, data?: any): Spec;
  
  /**
   * adds a mock interaction to the server & auto removed after execution
   * @example
   * await pactum
   *  .useMockInteraction({
   *    withRequest: {
   *      method: 'GET',
   *      path: '/api/projects/1'
   *    },
   *    willRespondWith: {
   *      status: 200,
   *      body: {
   *        id: 1,
   *        name: 'fake'
   *      }
   *    }
   *  })
   *  .get('http://localhost:9393/projects/1')
   *  .expectStatus(200);
   */
  useMockInteraction(interaction: MockInteraction): Spec;
  useMockInteraction(handler: string, data?: any): Spec;
  
  /** 
   * adds a pact interaction to the server & auto removed after execution
   * @example
   * await pactum
   *  .usePactInteraction({
   *    provider: 'project-provider',
   *    state: 'when there is a project with id 1',
   *    uponReceiving: 'a request for project 1',
   *    withRequest: {
   *      method: 'GET',
   *      path: '/api/projects/1'
   *    },
   *    willRespondWith: {
   *      status: 200,
   *      body: {
   *        id: 1,
   *        name: 'fake'
   *      }
   *    }
   *  })
   *  .get('http://localhost:9393/projects/1')
   *  .expectStatus(200);
   */
  usePactInteraction(interaction: PactInteraction): Spec;
  usePactInteraction(handler: string, data?: any): Spec;

  /**
   * The GET method requests a representation of the specified resource.
   * @example
   * await pactum
   *  .get('https://jsonplaceholder.typicode.com/posts')
   *  .withQueryParam('postId', 1)
   *  .expectStatus(200)
   *  .expectJsonLike({
   *    userId: 1,
   *    id: 1
   *   });
   */
  get(url: string): Spec;

  /**
   * The HEAD method asks for a response identical to that of a GET request, but without the response body.
   */
  head(url: string): Spec;

  /**
   * The PATCH method is used to apply partial modifications to a resource.
   * @example
   * await pactum
   *  .patch('https://jsonplaceholder.typicode.com/posts/1')
   *  .withJson({
   *    title: 'foo'
   *  })
   *  .expectStatus(200);
   */
  patch(url: string): Spec;
  
  /**
   * The POST method is used to submit an entity to the specified resource, often causing a change in state or side effects on the server.
   * @example
   * await pactum
   *  .post('https://jsonplaceholder.typicode.com/posts')
   *  .withJson({
   *    title: 'foo',
   *    body: 'bar',
   *    userId: 1
   *  })
   *  .expectStatus(201);
   */
  post(url: string): Spec;
  
  /**
   * The PUT method replaces all current representations of the target resource with the request payload.
   * @example
   * await pactum
   *  .put('https://jsonplaceholder.typicode.com/posts/1')
   *  .withJson({
   *    id: 1,
   *    title: 'foo',
   *    body: 'bar',
   *    userId: 1
   *  })
   *  .expectStatus(200);
   */
  put(url: string): Spec;
  
  /**
   * The DELETE method deletes the specified resource.
   * @example
   * await pactum
   *  .delete('https://jsonplaceholder.typicode.com/posts/1')
   *  .expectStatus(200);
   */
  delete(url: string): Spec;

  /**
   * replaces path params in the request url - /api/users/mike
   * @example
   * await pactum
   *  .get('/api/users/{username}')
   *  .withPathParams('username', 'mike')
   *  .expectStatus(200);
   */
  withPathParams(key: string, value: any): Spec;
  withPathParams(params: object): Spec;

  /**
   * adds query params to the request url - /comments?id=1&user=snow&sort=asc
   * @example
   * await pactum
   *  .get('/api/users')
   *  .withQueryParams('sort', 'asc')
   *  .withQueryParams({ 'id': '1', 'user': 'snow' })
   *  .expectStatus(200);
   */
  withQueryParams(key: string, value: any): Spec;
  withQueryParams(params: object): Spec;

  /**
   * appends graphQL query to the request body
   * @example
   * await pactum
   *  .post('http://www.graph.com/graphql')
   *  .withGraphQLQuery(`{ hello }`)
   *  .expectStatus(200);
   */
  withGraphQLQuery(query: string): Spec;

  /**
   * appends graphQL variables to the request body
   * @example
   * await pactum
   *  .post('http://www.graph.com/graphql')
   *  .withGraphQLQuery(`
   *    hero(episode: $episode) {
   *      name
   *    }`
   *  )
   *  .withGraphQLVariables({
   *    "episode": "JEDI"
   *  })
   *  .expectStatus(200);
   */
  withGraphQLVariables(variables: object): Spec;

  /**
   * attaches json object to the request body
   * @example
   * await pactum
   *  .post('https://jsonplaceholder.typicode.com/posts')
   *  .withJson({
   *    title: 'foo',
   *    body: 'bar',
   *    userId: 1
   *  })
   *  .expectStatus(201);
   */
  withJson(json: object): Spec;

  /**
   * attaches headers to the request
   * @example
   * await pactum
   *  .get('/api/posts')
   *  .withHeaders('Authorization', 'Basic xxx')
   *  .withHeaders({
   *    'content-type': 'application/json'
   *  })
   *  .expectStatus(201);
   */
  withHeaders(key: string, value: any): Spec;
  withHeaders(headers: object): Spec;

  /**
   * attaches body to the request
   * @example
   * await pactum
   *  .post('https://jsonplaceholder.typicode.com/posts')
   *  .withBody(JSON.stringify({
   *    title: 'foo',
   *  }))
   *  .expectStatus(201);
   */
  withBody(body: any): Spec;

  /**
   * attaches form data to the request with header - "application/x-www-form-urlencoded"
   * @example
   * await pactum
   *   .post('https://jsonplaceholder.typicode.com/posts')
   *   .withForm({
   *     'user': 'drake'
   *   })
   *   .expectStatus(200);
   */
  withForm(form: any): Spec;

  /**
   * attaches multi part form data to the request with header - "multipart/form-data"
   * @see https://www.npmjs.com/package/form-data
   * @example
   * const form = new pactum.request.FormData();
   * form.append('my_file', fs.readFileSync(path), { contentType: 'application/xml', filename: 'jUnit.xml' });
   * await pactum
   *  .post('https://jsonplaceholder.typicode.com/upload')
   *  .withMultiPartFormData(form)
   *  .expectStatus(200);
   */
  withMultiPartFormData(form: FormData): Spec;
  
  /**
   * attaches multi part form data to the request with header - "multipart/form-data"
   * @see https://www.npmjs.com/package/form-data
   * @example
   *  await pactum
   *   .post('https://jsonplaceholder.typicode.com/upload')
   *   .withMultiPartFormData('file', fs.readFileSync(path), { contentType: 'application/xml', filename: 'jUnit.xml' })
   *   .withMultiPartFormData('user', 'drake')
   *   .expectStatus(200);
   */
  withMultiPartFormData(key: string, value: string|Buffer|Array|ArrayBuffer, options?: FormData.AppendOptions): Spec;

  /**
   * with http core options
   * @see https://nodejs.org/api/http.html#http_http_request_url_options_callback
   * 
   * @example
   * await pactum.spec()
   *  .get('some-url')
   *  .withCore({
   *    agent: myAgent
   *  })
   *  .expectStatus(200);
   */
  withCore(options: RequestOptions): Spec;

  /**
   * basic auth
   */
  withAuth(username: string, password: string): Spec;

  withFollowRedirects(follow: boolean): Spec;

  /**
   * retry request on specific conditions before making assertions
   * @example
   * await pactum
   *  .get('/some/url)
   *  .retry({
   *     strategy: (req, res) => res.statusCode !== 200
   *   })
   *  .expectStatus(200);
   */
  retry(options: RetryOptions): Spec;

  /**
   * overrides default log level for current spec
   */
  __setLogLevel(level: LogLevel): Spec;

  /**
   * overrides default timeout for current request in ms
   */
  withRequestTimeout(timeout: number): Spec;

  /**
   * runs specified custom expect handler
   * @example
   * handler.addExpectHandler('hasAddress', (req, res, data) => {
   *   const json = res.json;
   *   assert.strictEqual(json.type, data);
   * });
   * await pactum
   *  .get('https://jsonplaceholder.typicode.com/users/1')
   *  .expect('isUser')
   *  .expect('hasAddress', 'home');
   */
  expect(handlerName: string, data?: any): Spec;

  /**
   * runs specified custom expect handler
   * @example
   * await pactum
   *  .get('https://jsonplaceholder.typicode.com/users/1')
   *  .expect('isUser')
   *  .expect((req, res, data) => { -- assertion code -- });
   */
  expect(handler: ExpectHandlerFunction): Spec;

  /**
   * expects a status code on the response
   * @example
   * await pactum
   *  .delete('https://jsonplaceholder.typicode.com/posts/1')
   *  .expectStatus(200);
   */
  expectStatus(code: number): Spec;

  /**
   * expects a header on the response
   * @example
   * await pactum
   *  .get('https://jsonplaceholder.typicode.com/posts/1')
   *  .expectHeader('content-type', 'application/json; charset=utf-8')
   *  .expectHeader('connection', /\w+/);
   */
  expectHeader(header: string, value: any): Spec

  /**
   * expects a header in the response
   * @example
   * await pactum
   *  .get('https://jsonplaceholder.typicode.com/comments')
   *  .expectHeaderContains('content-type', 'application/json');
   */
  expectHeaderContains(header: string, value: any): Spec

  expectBody(body: any): Spec;

  expectBodyContains(value: any): Spec;

  /**
   * expects a exact json object in the response
   * @example
   * await pactum
   *  .get('https://jsonplaceholder.typicode.com/posts/1')
   *  .expectJson({
   *    userId: 1,
   *    user: 'frank'
   *  });
   */
  expectJson(json: object): Spec;

  /**
   * expects a partial json object in the response
   * @example
   * await pactum
   *  .get('https://jsonplaceholder.typicode.com/comments')
   *  .expectJsonLike([{
   *    postId: 1,
   *    id: 1,
   *    name: /\w+/g
   *  }]);
   */
  expectJsonLike(json: object): Spec;

  /**
   * expects the response to match with json schema
   * @see https://json-schema.org/learn/
   * @example
   * await pactum
   *  .get('https://jsonplaceholder.typicode.com/posts/1')
   *  .expectJsonSchema({
   *    "properties": {
   *      "userId": {
   *        "type": "number"
   *      }
   *    },
   *    "required": ["userId", "id"]
   *  });
   */
  expectJsonSchema(schema: object): Spec;

  /**
   * expects the json at path equals to the value
   * @see https://www.npmjs.com/package/json-query
   * @example
   * await pactum
   *  .get('some-url')
   *  .expectJsonAt('[0].name', 'Matt')
   *  .expectJsonAt('[*].name', ['Matt', 'Pet', 'Don']);
   */
  expectJsonAt(path: string, query: any): Spec;

  /**
   * expects the json at path to be like the value (uses expectJsonLike internally)
   * @see https://www.npmjs.com/package/json-query
   * @example
   * await pactum
   *  .get('some-url')
   *  .expectJsonLikeAt('[*].name', ['Matt', 'Pet', 'Don']);
   */
  expectJsonLikeAt(path: string, value: any): Spec;

  /**
   * expects the response to match with json schema
   * @see https://json-schema.org/learn/
   * @example
   * await pactum
   *  .get('/api/users/1')
   *  .expectJsonSchemaAt('user.address', {
   *    "type": "object",
   *    "properties": {
   *      "city": {
   *        "type": "string"
   *      }
   *    }
   *  });
   */
  expectJsonSchemaAt(path: string, schema: object): Spec;

  /**
   * expects the json to match with value
   * @example
   * const { like } = pactum.matchers;
   * 
   * await pactum
   *  .get('/api/users')
   *  .expectJsonMatch({
   *    id: like(1),
   *    name: 'jon'
   *  });
   */
  expectJsonMatch(value: object): Spec;

  /**
   * expects the json at path to match with value
   * @see https://www.npmjs.com/package/json-query
   * @example
   * const { like } = pactum.matchers;
   * 
   * await pactum
   *  .get('/api/users')
   *  .expectJsonMatchAt('people[0]', {
   *    id: like(1),
   *    name: 'jon'
   *  });
   */
  expectJsonMatchAt(path: string, value: object): Spec;

  /**
   * expects the json to match with stored snapshots
   * @example
   * const { like } = pactum.matchers;
   * 
   * await pactum
   *  .get('/api/users')
   *  .expectJsonSnapshot({
   *    id: like(1),
   *    name: 'jon'
   *  });
   */
  expectJsonSnapshot(value?: object): Spec;

  /**
   * expects request completes within a specified duration (ms)
   */
  expectResponseTime(value: number): Spec;

  /**
   * stores spec response data 
   */
  stores(name: string, path: string): Spec;

  /**
   * returns custom response from json response using custom handler
   * @example
   * const id = await pactum
   *  .get('some-url')
   *  .expectStatus(200)
   *  .returns('GetUserId');
   */
  returns(handlerName: string): Spec;

  /**
   * returns custom response from json response using json-query
   * @example
   * const id = await pactum
   *  .get('some-url')
   *  .expectStatus(200)
   *  .returns('user.id') // json query
   * // 'id' will be equal to '123' if response is { user: { id: 123 }}
   * 
   */
  returns(query: string): Spec;

  /**
   * returns custom response from json response using custom function
   * @example
   * const resp = await pactum
   *  .get('some-url')
   *  .expectStatus(200)
   *  .returns('[0].name')
   *  .returns((req, res) => { return res.json[0].id }) // custom function
   * // 'resp' will be an array containing ['name', 'id']
   * 
   */
  returns(handler: ReturnHandlerFunction): Spec;

  /**
   * records data that will be available in reports
   */
  records(name: string, path: string): Spec;

  /**
   * waits after performing a request & before response validation
   * @example
   * await pactum.spec()
   *  .useMockInteraction('some background operation')
   *  .post('/url/)
   *  .wait(1000)
   *  .expectStatus(200)
   */
  wait(milliseconds: number): Spec;

  /**
   * prints request & response
   */
  inspect(): Spec;

  /**
   * executes the test case
   */
  toss(): Promise<T>;

  /**
   * returns chai like assertions
   * @requires .toss() should be called beforehand.
   */
  response(): Expect;

  /**
   * _should be used with pactum.e2e()_
   * 
   * returns new instance of cleanup spec
   */
  clean(name?: string, data?: any): Spec;
}

declare namespace Spec {}