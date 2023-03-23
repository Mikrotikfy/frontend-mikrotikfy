export const state = () => ({
  neighborhoods: [],
  Allneighborhoods: []
})
export const mutations = {
  getNeighborhoodsFromDatabase (state, neighborhoodList) {
    try {
      state.neighborhoods = neighborhoodList
    } catch (error) {
      throw new Error(`NEIGHBORHOOD MUTATE ${error}`)
    }
  },
  getAll (state, neighborhoodList) {
    try {
      state.Allneighborhoods = neighborhoodList
    } catch (error) {
      throw new Error(`GETALL NEIGHBORHOOD MUTATE ${error}`)
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
  },
  getAll ({ commit }, payload) {
    const qs = require('qs')
    const query = qs.stringify({
      pagination: {
        pageSize: 1000
      }
    },
    {
      encodeValuesOnly: true
    })
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}neighborhoods?${query}`, {
          type: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then((neighborhoods) => {
            commit('getAll', neighborhoods.data)
            resolve(neighborhoods.data)
          })
      })
    } catch (error) {
      throw new Error(`GETALL NEIGHBORHOOD ACTION ${error}`)
    }
  }
}
