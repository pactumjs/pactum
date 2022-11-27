import { RequestOptions, IncomingMessage } from 'http';
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
   * @see https://pactumjs.github.io/api/requests/name.html
   */
  name(value: string): Spec;

  /**
   * runs the specified state handler
   * @see https://pactumjs.github.io/api/requests/setState.html
   */
  setState(name: string, data?: any): Spec;

  /**
   * runs custom spec handler
   * @see https://pactumjs.github.io/api/requests/use.html
   */
  use(name: string, data?: any): Spec

  /**
   * adds a interaction to the server & auto removed after execution
   * @see https://pactumjs.github.io/api/mock/useInteraction.html
   */
  useInteraction(interaction: Interaction): Spec;
  useInteraction(handler: string, data?: any): Spec;

  /**
   * The GET method requests a representation of the specified resource.
   * @see https://pactumjs.github.io/guides/api-testing.html
   */
  get(url: string): Spec;

  /**
   * The HEAD method asks for a response identical to that of a GET request, but without the response body.
   * @see https://pactumjs.github.io/guides/api-testing.html
   */
  head(url: string): Spec;

  /**
   * The PATCH method is used to apply partial modifications to a resource.
   * @see https://pactumjs.github.io/guides/api-testing.html
   */
  patch(url: string): Spec;

  /**
   * The POST method is used to submit an entity to the specified resource, often causing a change in state or side effects on the server.
   * @see https://pactumjs.github.io/guides/api-testing.html
   */
  post(url: string): Spec;

  /**
   * The PUT method replaces all current representations of the target resource with the request payload.
   * @see https://pactumjs.github.io/guides/api-testing.html
   */
  put(url: string): Spec;

  /**
   * The DELETE method deletes the specified resource.
   * @see https://pactumjs.github.io/guides/api-testing.html
   */
  delete(url: string): Spec;

  /**
   * The OPTIONS method asks for request-methods supported by the request.
   * @see https://pactumjs.github.io/guides/api-testing.html
   */
  options(url: string): Spec;

  /**
   * The TRACE method echos the contents of an HTTP Request back to the requester
   * @see https://pactumjs.github.io/guides/api-testing.html
   */
  trace(url: string): Spec;

  /**
   * The `withMethod` method extends the support for the request-methods apart from GET, POST, DELETE, PATCH, PUT, HEAD
   * @see https://pactumjs.github.io/api/requests/withMethod.html
   */
  withMethod(method: string): Spec;

  /**
   * The `withPath` method triggers the request passed through withMethod()
   * @see https://pactumjs.github.io/api/requests/withPath.html
   */
  withPath(url: string): Spec;

  /**
   * replaces path params in the request url
   * @see https://pactumjs.github.io/api/requests/withPathParams.html
   */
  withPathParams(key: string, value: any): Spec;
  withPathParams(params: object): Spec;

  /**
   * adds query params to the request url - /comments?user=snow&sort=asc
   * @see https://pactumjs.github.io/api/requests/withQueryParams.html
   */
  withQueryParams(key: string, value?: any): Spec;
  withQueryParams(params: object): Spec;

  /**
   * appends graphQL query to the request body or query params
   * @see https://pactumjs.github.io/api/requests/withGraphQLQuery.html
   */
  withGraphQLQuery(query: string): Spec;

  /**
   * appends graphQL variables to the request body
   * @see https://pactumjs.github.io/api/requests/withGraphQLVariables.html
   */
  withGraphQLVariables(variables: object): Spec;

  /**
   * attaches headers to the request
   * @see https://pactumjs.github.io/api/requests/withHeaders.html
   */
  withHeaders(key: string, value: any): Spec;
  withHeaders(headers: object): Spec;

  /**
   * attaches cookies to the request
   * @see https://pactumjs.github.io/api/requests/withCookies.html
   */
  withCookies(key: string, value: any): Spec;
  withCookies(json: object): Spec;
  withCookies(raw: string): Spec;

  /**
   * attaches body to the request
   * @see https://pactumjs.github.io/api/requests/withBody.html
   */
  withBody(body: BodyOptions): Spec;
  withBody(body: any): Spec;


  /**
   * attaches json object to the request body
   * @see https://pactumjs.github.io/api/requests/withJson.html
   */
  withJson(json: object): Spec;
  withJson(filePath: string): Spec;

  /**
   * appends file to the form-data
   * @see https://pactumjs.github.io/api/requests/withFile.html
   */
  withFile(path: string, options?: FormData.AppendOptions): Spec;
  withFile(key: string, path: string, options?: FormData.AppendOptions): Spec;

  /**
   * attaches form data to the request with header - "application/x-www-form-urlencoded"
   * @see https://pactumjs.github.io/api/requests/withForm.html
   */
  withForm(form: object): Spec;
  withForm(key: string, value: string): Spec;

  /**
   * attaches multi part form data to the request with header - "multipart/form-data"
   * @see https://www.npmjs.com/package/form-data-lite
   * @see https://pactumjs.github.io/api/requests/withMultiPartFormData.html
   */
  withMultiPartFormData(form: FormData): Spec;
  withMultiPartFormData(form: object): Spec;
  withMultiPartFormData(key: string, value: string | Buffer | Array<any> | ArrayBuffer, options?: FormData.AppendOptions): Spec;

  /**
   * with http core options
   * @see https://nodejs.org/api/http.html#http_http_request_url_options_callback
   * @see https://pactumjs.github.io/api/requests/withCore.html
   */
  withCore(options: RequestOptions): Spec;

  /**
   * basic auth
   * @see https://pactumjs.github.io/api/requests/withAuth.html
   */
  withAuth(username: string, password: string): Spec;

  /**
   * basic auth
   * @see https://pactumjs.github.io/api/requests/withFollowRedirects.html
   */
  withFollowRedirects(follow: boolean): Spec;

  /**
   * enables compression
   * @see https://pactumjs.github.io/api/requests/withCompression.html
   */
  withCompression(): Spec;

  /**
   * retry request on specific conditions
   * @see https://pactumjs.github.io/api/requests/retry.html
   */
  retry(count?: number, delay?: number): Spec;
  retry(options: RetryOptions): Spec;

  /**
   * overrides default log level for current spec
   * @see https://pactumjs.github.io/api/requests/useLogLevel.html
   */
  useLogLevel(level: LogLevel): Spec;

  /**
   * overrides default timeout for current request in ms
   * @see https://pactumjs.github.io/api/requests/withRequestTimeout.html
   */
  withRequestTimeout(timeout: number): Spec;

  /**
   * runs specified custom expect handler
   * @see https://pactumjs.github.io/api/assertions/expect.html
   */
  expect(handlerName: string, data?: any): Spec;
  expect(handler: ExpectHandlerFunction): Spec;

  /**
   * expects a status code on the response
   * @see https://pactumjs.github.io/api/assertions/expectStatus.html
   */
  expectStatus(code: number): Spec;

  /**
   * expects a header on the response
   * @see https://pactumjs.github.io/api/assertions/expectHeader.html
   */
  expectHeader(header: string, value: any): Spec

  /**
   * expects a header in the response
   * @see https://pactumjs.github.io/api/assertions/expectHeaderContains.html
   */
  expectHeaderContains(header: string, value: any): Spec

  /**
   * expects exact match on cookie in the response
   * @see https://pactumjs.github.io/api/assertions/expectCookies.html
   */
  expectCookies(key: string, value: any): Spec;
  expectCookies(json: object): Spec;
  expectCookies(raw: string): Spec;

  /**
  * expects a partial cookie in the response
  * @see https://pactumjs.github.io/api/assertions/expectCookiesLike.html
  */
  expectCookiesLike(key: string, value: any): Spec;
  expectCookiesLike(json: object): Spec;
  expectCookiesLike(raw: string): Spec;

  /**
   * performs strict equal on body text.
   * @see https://pactumjs.github.io/api/assertions/expectBody.html
   */
  expectBody(body: any): Spec;

  /**
   * performs strict equal on body text.
   * @see https://pactumjs.github.io/api/assertions/expectBodyContains.html
   */
  expectBodyContains(value: any): Spec;

  /**
   * expects a exact json object in the response
   * @see https://pactumjs.github.io/api/assertions/expectJson.html
   */
  expectJson(json: object): Spec;
  expectJson(path: string, value: any): Spec;

  /**
   * expects a partial json object in the response
   * @see https://pactumjs.github.io/api/assertions/expectJsonLike.html
   */
  expectJsonLike(json: object): Spec;
  expectJsonLike(path: string, value: any): Spec;

  /**
   * expects the response to match with json schema
   * @see https://pactumjs.github.io/api/assertions/expectJsonSchema.html
   */
  expectJsonSchema(schema: object): Spec;
  expectJsonSchema(schema: object, options: object): Spec;
  expectJsonSchema(path: string, schema: object): Spec;
  expectJsonSchema(path: string, schema: object, options: object): Spec;

  /**
   * expects the json to match with value
   * @see https://pactumjs.github.io/api/assertions/expectJsonMatch.html
   */
  expectJsonMatch(value: object): Spec;
  expectJsonMatch(path: string, value: object): Spec;

  /**
   * expects the json to strictly match with value
   * @see https://pactumjs.github.io/api/assertions/expectJsonMatchStrict.html
   */
  expectJsonMatchStrict(value: object): Spec;
  expectJsonMatchStrict(path: string, value: object): Spec;

  /**
   * expects the json to an array with length
   * @see https://pactumjs.github.io/api/assertions/expectJsonLength.html
   */
  expectJsonLength(value: number): Spec;
  expectJsonLength(path: string, value: number): Spec;

  /**
   * expect network errors
   * @see https://pactumjs.github.io/api/assertions/expectError.html
   */
  expectError(): Spec;
  expectError(error: string): Spec;
  expectError(error: object): Spec;

  /**
   * expects the json to match with stored snapshots
   * @see https://pactumjs.github.io/api/assertions/expectJsonSnapshot.html
   */
  expectJsonSnapshot(value?: object): Spec;
  expectJsonSnapshot(name: string, value?: object): Spec;

  /**
   * updates the reference snapshot file
   * @see https://pactumjs.github.io/api/assertions/updateSnapshot.html
   */
  updateSnapshot(): Spec;

  /**
   * expects request completes within a specified duration (ms)
   * @see https://pactumjs.github.io/api/assertions/expectResponseTime.html
   */
  expectResponseTime(value: number): Spec;

  /**
   * stores spec request & response data
   * @see https://pactumjs.github.io/api/requests/stores.html
   */
  stores(name: string, path: string): Spec;
  stores(name: string, handlerName: string): Spec;

  /**
   * returns custom response from json response using custom handler
   * @see https://pactumjs.github.io/api/requests/returns.html
   */
  returns<T = Spec>(handlerName: string): T;
  returns<T = Spec>(path: string): T;
  returns<T = Spec>(handler: CaptureHandlerFunction): T;

  /**
   * records data that will be available in reports
   * @see https://pactumjs.github.io/api/requests/records.html
   */
  records(name: string, path: string): Spec;
  records(name: string, data: object): Spec;

  /**
   * waits after performing a request & before response validation
   * @see https://pactumjs.github.io/api/requests/wait.html
   */
  wait(milliseconds: number): Spec;
  wait(spec: Spec): Spec;
  wait(): Spec;
  wait(duration: number, pollingInterval: number): Spec;
  wait(handlerName: string, data?: any): Spec;

  /**
   * prints request & response
   * @see https://pactumjs.github.io/api/requests/inspect.html
   */
  inspect(): Spec;
  inspect(path: string): Spec;

  /**
   * saves response in file system
   * @see https://pactumjs.github.io/api/requests/save.html
   */
  save(path: string): Spec;

  /**
   * executes the test case
   * @see https://pactumjs.github.io/api/requests/toss.html
   */
  toss(): Promise<IncomingMessage> | Promise<any>;

  /**
   * supports promise chaining and await syntax
   */
  then(
    onFulfilled: (value: any) => any,
    onRejected: (reason: any) => any
  ): Promise<any>;

  /**
   * returns chai like assertions
   * @see https://pactumjs.github.io/api/assertions/response.html
   * @requires .toss() should be called beforehand.
   */
  response(): Expect;

  /**
   * cleanup spec for e2e testing
   * @see https://pactumjs.github.io/api/requests/clean.html
   */
  clean(name?: string, data?: any): Spec;

  /**
   * runs registered reporters
   * @see https://pactumjs.github.io/api/requests/end.html
   */
  end(): Spec;
}

declare namespace Spec { }
