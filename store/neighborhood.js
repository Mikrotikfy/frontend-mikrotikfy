export const state = () => ({
  neighborhoods: []
})
export const mutations = {
  getNeighborhoodsFromDatabase (state, neighborhoodList) {
    try {
      state.neighborhoods = neighborhoodList
    } catch (error) {
      throw new Error(`NEIGHBORHOOD MUTATE ${error}`)
    }
  }
}
export const actions = {
  async getNeighborhoodsFromDatabase ({ commit }) {
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
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}neighborhoods?${query}`)
        .then(res => res.json())
        .then((neighborhoods) => {
          localStorage.setItem('neighborhoods', JSON.stringify(neighborhoods.data))
          commit('getNeighborhoodsFromDatabase', neighborhoods.data)
        })
    } catch (error) {
      throw new Error(`NEIGHBORHOOD ACTION ${error}`)
    }
  }
}
