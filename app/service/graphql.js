'use strict';

const { execute, formatError, validate, parse, specifiedRules } = require('graphql');
const gql = require('graphql-tag');
const UUID = require('uuid');

module.exports = app => {
  class GraphqlService extends app.Service {

    async query(params) {
      let result = {};
      let ctx = this.ctx;

      ctx.requestId = UUID.v4();

      try {
        const { query, variables, operationName } = params;

        const documentAST = gql`${query}`;
        const schema = this.app.schema;


        const document = parse(query, {})
        const validateErrors = validate(schema, document, specifiedRules);
        if (validateErrors.length > 0) {
          for (const error of validateErrors) {
            ctx.graphqlErrors.push(error)
          }
          ctx.status = 400
        } else {
          result = await execute(
            schema,
            documentAST,
            null,
            ctx,
            variables,
            operationName
          );

          if (result && result.errors) {
            for (const error of result.errors) {
              ctx.graphqlErrors.push(error)
            }
          }
        }
      } catch (e) {
        ctx.status = e.status || 500
        ctx.graphqlErrors.push(e)
      }

      if (ctx.graphqlErrors.length > 0) {
        result.errors = ctx.graphqlErrors.map(formatError);
      }

      return result;
    }
  }

  return GraphqlService;
}
