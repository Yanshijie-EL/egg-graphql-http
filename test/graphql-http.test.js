'use strict';

const mock = require('egg-mock');

describe('test/graphql-http.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/graphql-http-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, graphqlHttp')
      .expect(200);
  });
});
