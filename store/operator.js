export const state = () => ({
  operators: []
})
export const mutations = {
  getOperatorList (state, payload) {
    state.operators = payload
  }
}
export const actions = {
  getOperatorList ({ commit }, payload) {
    const qs = require('qs')
    const query = qs.stringify({
      pagination: {
        page: 1,
        pageSize: 1000
      }
    },
    {
      encodeValuesOnly: true
    })
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}users?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then((operators) => {
            commit('getOperatorList', operators)
            resolve(operators)
          })
      })
    } catch (error) {
      throw new Error(`OPERATOR ACTION ${error}`)
    }
  }
}
