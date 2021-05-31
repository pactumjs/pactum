const pactum = require('../../src/index');

describe('Cookies', () => {
  //   it('test on cookies', async () => {
  //     await pactum
  //       .spec()
  //       .useInteraction({
  //         request: {
  //           method: 'GET',
  //           path: '/api/army',
  //         },
  //         response: {
  //           status: 200,
  //           headers: {
  //             'set-cookie': 'name=snow;HttpOnly',
  //           },
  //           body: {
  //             Name: 'Golden Army',
  //             Count: 10000,
  //             Alliance: 'Stark',
  //           },
  //         },
  //       })
  //       .get('http://localhost:9393/api/army')
  //       .withCookies({
  //         name: 'snow',
  //         HttpOnly: null,
  //       })
  //       .expectStatus(200)
  //       .expectCookies({
  //         name: 'snow',
  //       });
  //   });
});
