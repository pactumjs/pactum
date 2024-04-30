const { spec } = require('../../src/index');

describe('useDataMap', () => {

  it('with key and value', async () => {
    await spec()
      .useDataMap('USE_DATA_MAP_PATH', '/default/get')
      .useInteraction('default get')
      .get('http://localhost:9393/default/get')
      .expectStatus(200)
      .expectJson({
        method: 'GET',
        path: '$M{USE_DATA_MAP_PATH}'
      });
  });

  it('with multiple key and value', async () => {
    await spec()
      .useDataMap('USE_DATA_MAP_METHOD', 'GET')
      .useDataMap('USE_DATA_MAP_PATH', '/default/get')
      .useInteraction('default get')
      .get('http://localhost:9393/default/get')
      .expectStatus(200)
      .expectJson({
        method: '$M{USE_DATA_MAP_METHOD}',
        path: '$M{USE_DATA_MAP_PATH}'
      });
  });

});