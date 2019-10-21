'use strict';

const path = require('path');
const util = require('./util');
const _ = require('lodash');
const SYMBOL_RESOLVER= Symbol('Applicaton#resolver');

module.exports = app => {

  const basePath = path.join(app.baseDir, 'app/resolver');
  const resolverFiles = util.walk(basePath, basePath);

  let resolverMap = {};
  let resolverFactories = [];

  resolverFiles.forEach(resolverFile => {
    // Load resolver
    const resolverObj = require(resolverFile);
    if (_.isFunction(resolverObj)) {
      resolverFactories.push(resolverObj);
    } else if (_.isObject(resolverObj)) {
      _.merge(resolverMap, resolverObj);
    }
  });

  Object.defineProperty(app, 'resolver', {
    get() {
      if (!this[SYMBOL_RESOLVER]) {
        resolverFactories.forEach(resolverFactory => _.merge(resolverMap, resolverFactory));
        this[SYMBOL_RESOLVER] = resolverMap;
      }
      return this[SYMBOL_RESOLVER];
    },
  });

};
