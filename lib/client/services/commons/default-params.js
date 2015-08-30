/**
 * Commons `default-params` module.
 * @module commons/defaultParams
 */

/**
 * Return the default parameters for building a query string.
 *
 * @return {Object}
 */
export function getDefaultQueryParams () {
  return {
    id: null,
    query: {
      expand: [],
      operator: 'and',
      page: null,
      perPage: null,
      sort: [],
      where: []
    }
  }
}

/**
 * Reset given object to default parameters.
 *
 * @param {Object} params
 */
export function setDefaultQueryParams (params) {
  params.id = getDefaultQueryParams().id
  params.query = getDefaultQueryParams().query
}