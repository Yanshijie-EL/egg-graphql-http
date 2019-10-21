'use strict';
const { resolveGraphiQLString } = require('apollo-server-module-graphiql');

/*
 * @param {Object} options The `options` of graphiqlKoa.
 * @return {Promise} The result of the graphiqlKoa.
 */
function graphiqlKoa(options) {
  return ctx => {
    const query = ctx.request.query;
    return resolveGraphiQLString(query, options, ctx)
      .then(graphiqlString => {
        ctx.set('Content-Type', 'text/html');
        ctx.body = graphiqlString;
      });
  };
}

module.exports = app => {
  require('./lib/load_directive')(app);
  require('./lib/load_resolver')(app);
  require('./lib/load_schema')(app);


  const { router } = app;
  const options = app.config.graphqlHttp;
  const graphQLRouter = options.router;

  router.post(graphQLRouter, async function (ctx) {

    let params = {
      query: ctx.params.query ? ctx.params.query : null,
      variables: ctx.params.variables ? ctx.params.variables : null,
      operationName: ctx.params.operationName ? ctx.params.operationName : null
    }

    if (!params.query && ctx.request.body.query) params.query = ctx.request.body.query ? ctx.request.body.query : null

    if (!params.variables && ctx.request.body.variables) params.variables = ctx.request.body.variables ? ctx.request.body.variables : null

    if (!params.operationName && ctx.request.body.operationName) params.operationName = ctx.request.body.operationName ? ctx.request.body.operationName : null

    ctx.body = await ctx.graphql.query(params);
  });

  if (options.graphiql === true) {
    router.all('/graphiql', function (ctx) {
      return graphiqlKoa({
        endpointURL: graphQLRouter,
      })(ctx);
    });
  }

};
