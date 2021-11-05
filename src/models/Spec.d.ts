import { RequestOptions } from 'http';
import FormData from 'form-data-lite';
import { Interaction } from '../exports/mock';
import { ExpectHandlerFunction, RetryHandlerFunction, CaptureHandlerFunction } from '../exports/handler';
import { LogLevel } from '../exports/settings';
import { Expect } from '../exports/expect';

declare interface RetryOptions {
  /** maximum number of retries - defaults to 3 */
  count?: number;
  /** delay between retries - defaults to 3 */
  delay?: number;
  strategy?: string | RetryHandlerFunction;
  status?: number | number[];
}

declare interface BodyOptions {
  /** path to the file  */
  file?: string;
}

export = Spec;

declare class Spec {
  constructor();

  /**
   * sets a custom name for the spec
   * @example
   * await pactum.spec()
   *  .name('Get Users From The System')
   *  .get('/api/users')
   *  .expectStatus(200);
   */
  name(value: string): Spec;

  /**
   * runs the specified state handler
   * @example
   * await pactum.spec()
   *  .setState('there are users in the system')
   *  .get('/api/users')
   *  .expectStatus(200);
   */
  setState(name: string, data?: any): Spec;

  /**
   * runs custom spec handler
   * @see https://pactumjs.github.io/#/api-handlers?id=addspechandler
   */
  use(name: string, data?: any): Spec

  /**
   * adds a interaction to the server & auto removed after execution
   * @see https://pactumjs.github.io/#/component-testing?id=simple-component-tests
   */
  useInteraction(interaction: Interaction): Spec;
  useInteraction(handler: string, data?: any): Spec;

  /**
   * The GET method requests a representation of the specified resource.
   * @see https://pactumjs.github.io/#/request-making?id=request-method
   */
  get(url: string): Spec;

  /**
   * The HEAD method asks for a response identical to that of a GET request, but without the response body.
   * @see https://pactumjs.github.io/#/request-making?id=request-method
   */
  head(url: string): Spec;

  /**
   * The PATCH method is used to apply partial modifications to a resource.
   * @see https://pactumjs.github.io/#/request-making?id=request-method
   */
  patch(url: string): Spec;

  /**
   * The POST method is used to submit an entity to the specified resource, often causing a change in state or side effects on the server.
   * @see https://pactumjs.github.io/#/request-making?id=request-method
   */
  post(url: string): Spec;

  /**
   * The PUT method replaces all current representations of the target resource with the request payload.
   * @see https://pactumjs.github.io/#/request-making?id=request-method
   */
  put(url: string): Spec;

  /**
   * The DELETE method deletes the specified resource.
   * @see https://pactumjs.github.io/#/request-making?id=request-method
   */
  delete(url: string): Spec;

  /**
   * The OPTIONS method asks for request-methods supported by the request.
   * @see https://pactumjs.github.io/#/request-making?id=request-method
   */
  options(url: string): Spec;

  /**
   * The TRACE method echos the contents of an HTTP Request back to the requester
   * @see https://pactumjs.github.io/#/request-making?id=request-method
   */
  trace(url: string): Spec;

  /**
   * The `withMethod` method extends the support for the request-methods apart from GET, POST, DELETE, PATCH, PUT, HEAD
   * @see https://pactumjs.github.io/#/request-making?id=non-crud-methods
   */
  withMethod(method: string): Spec;

  /**
   * The `withPath` method triggers the request passed through withMethod()
   * @see https://pactumjs.github.io/#/request-making?id=non-crud-methods
   */
  withPath(url: string): Spec;

  /**
   * replaces path params in the request url 
   * @see https://pactumjs.github.io/#/request-making?id=path-params
   */
  withPathParams(key: string, value: any): Spec;
  withPathParams(params: object): Spec;

  /**
   * adds query params to the request url - /comments?user=snow&sort=asc
   * @see https://pactumjs.github.io/#/request-making?id=query-params
   */
  withQueryParams(key: string, value: any): Spec;
  withQueryParams(params: object): Spec;

  /**
   * appends graphQL query to the request body or query params
   * @see https://pactumjs.github.io/#/request-making?id=graphql
   */
  withGraphQLQuery(query: string): Spec;

  /**
   * appends graphQL variables to the request body
   * @see https://pactumjs.github.io/#/request-making?id=graphql
   */
  withGraphQLVariables(variables: object): Spec;

  /**
   * attaches headers to the request
   * @see https://pactumjs.github.io/#/request-making?id=headers
   */
  withHeaders(key: string, value: any): Spec;
  withHeaders(headers: object): Spec;

  /**
   * attaches cookies to the request
   * @see https://pactumjs.github.io/#/request-making?id=cookies
   */
  withCookies(key: string, value: any): Spec;
  withCookies(json: object): Spec;
  withCookies(raw: string): Spec;

  /**
   * attaches body to the request
   * @see https://pactumjs.github.io/#/request-making?id=body
   */
  withBody(body: BodyOptions): Spec;
  withBody(body: any): Spec;


  /**
   * attaches json object to the request body
   * @see https://pactumjs.github.io/#/request-making?id=body
   */
  withJson(json: object): Spec;
  withJson(filePath: string): Spec;

  /**
   * appends file to the form-data
   * @see https://pactumjs.github.io/#/request-making?id=file-uploads
   */
  withFile(path: string, options?: FormData.AppendOptions): Spec;
  withFile(key: string, path: string, options?: FormData.AppendOptions): Spec;

  /**
   * attaches form data to the request with header - "application/x-www-form-urlencoded"
   * @see https://pactumjs.github.io/#/request-making?id=form-data
   */
  withForm(form: any): Spec;

  /**
   * attaches multi part form data to the request with header - "multipart/form-data"
   * @see https://www.npmjs.com/package/form-data-lite
   * @see https://pactumjs.github.io/#/request-making?id=form-data
   */
  withMultiPartFormData(form: FormData): Spec;

  /**
   * attaches multi part form data to the request with header - "multipart/form-data"
   * @see https://www.npmjs.com/package/form-data-lite
   * @see https://pactumjs.github.io/#/request-making?id=form-data
   */
  withMultiPartFormData(key: string, value: string | Buffer | Array | ArrayBuffer, options?: FormData.AppendOptions): Spec;

  /**
   * with http core options
   * @see https://nodejs.org/api/http.html#http_http_request_url_options_callback
   * @see https://pactumjs.github.io/#/request-making?id=core-options
   */
  withCore(options: RequestOptions): Spec;

  /**
   * basic auth
   * @see https://pactumjs.github.io/#/request-making?id=authentication
   */
  withAuth(username: string, password: string): Spec;

  withFollowRedirects(follow: boolean): Spec;

  /**
   * retry request on specific conditions
   * @see https://pactumjs.github.io/#/integration-testing?id=retry-mechanism
   */
  retry(count?: number, delay?: number): Spec;
  retry(options: RetryOptions): Spec;

  /**
   * overrides default log level for current spec
   * @see https://pactumjs.github.io/#/api-settings?id=setloglevel
   */
  useLogLevel(level: LogLevel): Spec;

  /**
   * overrides default timeout for current request in ms
   * @see https://pactumjs.github.io/#/request-making?id=request-timeout
   */
  withRequestTimeout(timeout: number): Spec;

  /**
   * runs specified custom expect handler
   * @see https://pactumjs.github.io/#/response-validation?id=custom-validations
   */
  expect(handlerName: string, data?: any): Spec;
  expect(handler: ExpectHandlerFunction): Spec;

  /**
   * expects a status code on the response
   * @see https://pactumjs.github.io/#/response-validation?id=status-amp-headers-amp-response-time
   */
  expectStatus(code: number): Spec;

  /**
   * expects a header on the response
   * @see https://pactumjs.github.io/#/response-validation?id=status-amp-headers-amp-response-time
   */
  expectHeader(header: string, value: any): Spec

  /**
   * expects a header in the response
   * @see https://pactumjs.github.io/#/response-validation?id=status-amp-headers-amp-response-time
   */
  expectHeaderContains(header: string, value: any): Spec

  /**
   * expects exact match on cookie in the response
   * @see https://pactumjs.github.io/#/response-validation?id=expectcookies
   */
  expectCookies(key: string, value: any): Spec;
  expectCookies(json: object): Spec;
  expectCookies(raw: string): Spec;

  /**
  * expects a partial cookie in the response
  * @see https://pactumjs.github.io/#/response-validation?id=expectcookieslike
  */
  expectCookiesLike(key: string, value: any): Spec;
  expectCookiesLike(json: object): Spec;
  expectCookiesLike(raw: string): Spec;

  /**
   * performs strict equal on body text.
   * @see https://pactumjs.github.io/#/response-validation?id=expectbody
   */
  expectBody(body: any): Spec;

  /**
   * performs strict equal on body text.
   * @see https://pactumjs.github.io/#/response-validation?id=expectbodycontains
   */
  expectBodyContains(value: any): Spec;

  /**
   * expects a exact json object in the response
   * @see https://pactumjs.github.io/#/response-validation?id=expectjson
   */
  expectJson(json: object): Spec;
  expectJson(path: string, value: any): Spec;

  /**
   * expects a partial json object in the response
   * @see https://pactumjs.github.io/#/response-validation?id=expectjsonlike
   */
  expectJsonLike(json: object): Spec;
  expectJsonLike(path: string, value: any): Spec;

  /**
   * expects the response to match with json schema
   * @see https://pactumjs.github.io/#/response-validation?id=expectjsonschema
   */
  expectJsonSchema(schema: object): Spec;
  expectJsonSchema(schema: object, options: object): Spec;
  expectJsonSchema(path: string, schema: object): Spec;
  expectJsonSchema(path: string, schema: object, options: object): Spec;

  /**
   * expects the json to match with value
   * @see https://pactumjs.github.io/#/response-validation?id=expectjsonmatch
   */
  expectJsonMatch(value: object): Spec;
  expectJsonMatch(path: string, value: object): Spec;

  /**
   * expects the json to strictly match with value
   * @see https://pactumjs.github.io/#/response-validation?id=expectjsonmatch
   */
  expectJsonMatchStrict(value: object): Spec;
  expectJsonMatchStrict(path: string, value: object): Spec;

  /**
   * expects the json to an array with length
   */
  expectJsonLength(value: number): Spec;
  expectJsonLength(path: string, value: number): Spec;

  /**
   * expect network errors
   * @see https://pactumjs.github.io/#/response-validation?id=expecterror
   */
  expectError(): Spec;
  expectError(error: string): Spec;
  expectError(error: object): Spec;

  /**
   * expects the json to match with stored snapshots
   * @see https://pactumjs.github.io/#/response-validation?id=expectjsonsnapshot
   */
  expectJsonSnapshot(value?: object): Spec;

  /**
   * updates the reference snapshot file
   * @see https://pactumjs.github.io/#/response-validation?id=expectjsonsnapshot
   */
  updateSnapshot(): Spec;

  /**
   * expects request completes within a specified duration (ms)
   * @see https://pactumjs.github.io/#/response-validation?id=status-amp-headers-amp-response-time
   */
  expectResponseTime(value: number): Spec;

  /**
   * stores spec request & response data
   * @see https://pactumjs.github.io/#/integration-testing?id=stores
   */
  stores(name: string, path: string): Spec;
  stores(name: string, handlerName: string): Spec;

  /**
   * returns custom response from json response using custom handler
   * @see https://pactumjs.github.io/#/integration-testing?id=returns
   */
  returns(handlerName: string): Spec;
  returns(path: string): Spec;
  returns(handler: CaptureHandlerFunction): Spec;

  /**
   * records data that will be available in reports
   */
  records(name: string, path: string): Spec;

  /**
   * waits after performing a request & before response validation
   * @see https://pactumjs.github.io/#/component-testing?id=non-crud-endpoints
   */
  wait(milliseconds: number): Spec;
  wait(spec: Spec): Spec;
  wait(): Spec;
  wait(duration: number, pollingInterval: number): Spec;
  wait(handlerName: string, data?: any): Spec;

  /**
   * prints request & response
   */
  inspect(): Spec;

  /**
   * executes the test case
   * @see https://pactumjs.github.io/#/api-testing
   */
  toss(): Promise<T>;

  /**
   * returns chai like assertions
   * @see https://pactumjs.github.io/#/api-testing?id=testing-style
   * @requires .toss() should be called beforehand.
   */
  response(): Expect;

  /**
   * cleanup spec for e2e testing
   * @see https://pactumjs.github.io/#/e2e-testing
   */
  clean(name?: string, data?: any): Spec;

  /**
   * runs registered reporters
   * @see https://pactumjs.github.io/#/api-reporter?id=reporting-for-bdd
   */
  end(): Spec;
}

declare namespace Spec { }