import { BasicInteraction, MockInteraction, PactInteraction } from '../exports/mock';

export = Spec;

declare class Spec {
  constructor() {};

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
   * adds a basic mock interaction to the server
   * @example
   * await pactum
   *  .addInteraction({
   *    get: '/api/address/4'
   *    return: {
   *      city: 'WinterFell'
   *    }
   *  })
   *  .get('/api/users/4')
   *  .expectStatus(200);
   */
  addInteraction(interaction: BasicInteraction): Spec;
  
  /**
   * adds a mock interaction to the server
   * @example
   * await pactum
   *  .addMockInteraction({
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
  addMockInteraction(interaction: MockInteraction): Spec;
  
  /** 
   * adds a pact interaction to the server
   * @example
   * await pactum
   *  .addPactInteraction({
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
  addPactInteraction(interaction: PactInteraction): Spec;
  
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
  
  // TODO - delete

  /**
   * appends query param to the request url - /comments?postId=1&user=snow
   * @example
   * await pactum
   *  .get('https://jsonplaceholder.typicode.com/comments')
   *  .withQueryParam('postId', '1')
   *  .withQueryParam('user', 'snow')
   *  .expectStatus(200);
   */
  withQueryParam(key: string, value: string): Spec;

  /**
   * adds query params to the request url - /comments?postId=1&user=snow
   * @example
   * await pactum
   *  .get('https://jsonplaceholder.typicode.com/comments')
   *  .withQueryParams({ 'postId': '1', 'user': 'snow' })
   *  .expectStatus(200);
   */
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
   * appends header to the request
   * @example
   * await pactum
   *  .post('https://google.com/login')
   *  .withHeader('Authorization', 'Basic xxx')
   *  .withHeader('Accept', 'json')
   *  .expectStatus(200)
   */
  withHeader(key: string, value: string): Spec;
  withHeader(key: string, value: number): Spec;
  withHeader(key: string, value: boolean): Spec;

  /**
   * attaches headers to the request
   * @example
   * await pactum
   *  .get('https://jsonplaceholder.typicode.com/posts')
   *  .withHeaders({
   *    'content-type': 'application/json'
   *  })
   *  .expectStatus(201);
   */
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
}

declare namespace Spec {}