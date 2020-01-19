const pactum = require('../../src/index');

xdescribe('JSON Placeholder', () => {

  it('GET', async () => {
    await pactum
      .get('https://jsonplaceholder.typicode.com/posts/1')
      .expectStatus(200)
      .expectJsonLike({
        userId: 1,
        id: 1
      })
      .toss();
  });

  it('GET - with query', async () => {
    await pactum
      .get('https://jsonplaceholder.typicode.com/comments')
      .withQuery('postId', 1)
      .expectStatus(200)
      .expectJsonLike([
        {
          postId: 1,
          id: 1,
          name: /\w+/g
        }
      ])
      .toss();
  });

  it('POST', async () => {
    await pactum
      .post('https://jsonplaceholder.typicode.com/posts')
      .withJson({
        title: 'foo',
        body: 'bar',
        userId: 1
      })
      .expectStatus(201)
      .toss();
  });

  it('POST - with headers', async () => {
    await pactum
      .post('https://jsonplaceholder.typicode.com/posts')
      .withJson({
        title: 'foo',
        body: 'bar',
        userId: 1
      })
      .withHeaders({
        "Content-Type": "application/json; charset=UTF-8"
      })
      .expectStatus(201)
      .toss();
  });

  it('PUT', async () => {
    await pactum
      .put('https://jsonplaceholder.typicode.com/posts/1')
      .withJson({
        id: 1,
        title: 'foo',
        body: 'bar',
        userId: 1
      })
      .expectStatus(200)
      .toss();
  });

  it('PATCH', async () => {
    await pactum
      .patch('https://jsonplaceholder.typicode.com/posts/1')
      .withJson({
        title: 'foo'
      })
      .expectStatus(200)
      .toss();
  });

  it('DELETE', async () => {
    await pactum
      .delete('https://jsonplaceholder.typicode.com/posts/1')
      .expectStatus(200)
      .toss();
  });

});