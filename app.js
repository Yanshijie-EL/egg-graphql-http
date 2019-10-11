'use strict';
const { graphqlKoa } = require('apollo-server-koa/dist/koaApollo');
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
  require('./lib/load_schema')(app);
  require('./lib/load_connector')(app);

  const { router } = app;  
  const options = app.config.graphqlHttp;
  const graphQLRouter = options.router;

  const {} = app.config.graphqlHttp
  router.all(graphQLRouter, function (ctx) {
    return graphqlKoa({
      schema: this.app.schema,
      context: ctx,
    })(ctx);
  });

  if (options.graphiql === true) {
    router.all('/graphiql', function (ctx) {
      return graphiqlKoa({
        endpointURL: graphQLRouter,
      })(ctx);
    });
  }

};
