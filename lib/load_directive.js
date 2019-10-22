'use strict';

const fs = require('fs');
const path = require('path');
const util = require('./util');
const SYMBOL_DIRECTIVE = Symbol('Application#directive');
const SYMBOL_SCHEMA_DIRECTIVE = Symbol('Application#schemaDirective');

module.exports = app => {
  let directiveObj = {};
  let schemaDirectiveObj = {};
  const basePath = path.join(app.baseDir, 'app/directive');
  if (fs.existsSync(basePath)) {
    const directiveFiles = util.walk(basePath, basePath);

    directiveFiles.forEach(file => {
      const fileName = path.basename(file).split('.')[0];
      if (fileName === 'directive') {
        const directive = require(file);
        _.merge(directiveObj, directive);
      }
      if (fileName === 'schemaDirective') {
        const schemaDirectives = require(file);
        _.merge(schemaDirectiveObj, schemaDirectives);
      }
    });
  }

  Object.defineProperty(app, 'schemaDirective', {
    get() {
      if (!this[SYMBOL_SCHEMA_DIRECTIVE]) {
        this[SYMBOL_SCHEMA_DIRECTIVE] = schemaDirectiveObj;
      }
      return this[SYMBOL_SCHEMA_DIRECTIVE];
    },
  });
  
  Object.defineProperty(app, 'directive', {
    get() {
      if (!this[SYMBOL_DIRECTIVE]) {
        this[SYMBOL_DIRECTIVE] = directiveObj;
      }
      return this[SYMBOL_DIRECTIVE];
    },
  });
};
