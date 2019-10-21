const GRAPHQL_ERRORS = Symbol('graphqlErrors');

module.exports = {
  /**
   * graphql errors map
   * @member Context#graphqlErroes
   */
  get graphqlErrors() {
    if (!this[GRAPHQL_ERRORS]) {
      this[GRAPHQL_ERRORS] = [];
    }
    return this[GRAPHQL_ERRORS];
  },
  
  /**
   * graphql instance access
   * @member Context#graphql
   */
  get graphql() {
    return this.service.graphql;
  },
};
