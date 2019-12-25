const pactum = require('../../src/index');

describe('JSON Placeholder', () => {

  it('param id', async () => {
    await pactum
      .get('https://jsonplaceholder.typicode.com/todos/1')
      .expectStatus(200)
      .expectHeader('content-type')
      .expectHeader('content-type', 'application/json; charset=utf-8')
      .expectHeaderContains('content-length')
      .expectHeaderContains('content-type', 'application/json')
      .expectJson({
        "userId": 1,
        "id": 1,
        "title": "delectus aut autem",
        "completed": false
      })
      .expectJsonLike({
        "userId": 1,
        "title": /\w+/g
      })
      .expectBodyContains('userId')
      .expectJsonQuery('userId', 1)
      .expectJsonQuery('title', "delectus aut autem")
      .expectJsonQuery('completed', false)
      .toss();
  });

});