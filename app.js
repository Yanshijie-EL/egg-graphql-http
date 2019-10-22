'use strict';
const GraphqlPG = require('graphql-playground-middleware-koa');

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
    router.all('/graphiql', GraphqlPG({
        endpointURL: graphQLRouter
    }));
  }

};
