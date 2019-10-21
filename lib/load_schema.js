'use strict';

const fs = require('fs');
const path = require('path');
const {
  makeExecutableSchema,
} = require('graphql-tools');
const _ = require('lodash');

const SYMBOL_SCHEMA = Symbol('Applicaton#schema');
const util = require('./util');

module.exports = app => {
  const basePath = path.join(app.baseDir, 'app/schema');
  const schemaFiles = util.walk(basePath, basePath);

  let schemas = [];
  const { defaultEmptySchema = false } = app.config.graphqlHttp;
  const defaultSchema = `
  type Query 
  type Mutation 
  `;

  if (defaultEmptySchema) {
    schemas.push(defaultSchema);
  }

  schemaFiles.forEach(file => {

    if (file.endsWith('graphql')) {
      const schemaObj = fs.readFileSync(file, {
        encoding: 'utf8',
      });
      schemas.push(schemaObj);
    }

  });
  
  Object.defineProperty(app, 'schema', {
    get() {
      if (!this[SYMBOL_SCHEMA]) {

        this[SYMBOL_SCHEMA] = makeExecutableSchema({
          typeDefs: schemas,
          resolvers: this.resolver,
          directiveResolvers: this.directive,
          schemaDirectives: this.schemaDirective,
        });
      }
      return this[SYMBOL_SCHEMA];
    },
  });
};
