export const state = () => ({
  cities: [],
  currentCityMikrotiks: []
})
export const mutations = {
  getCitiesFromDatabase (state, cityList) {
    try {
      state.cities = cityList
    } catch (error) {
      throw new Error(`CITY MUTATE ${error}`)
    }
  },
  getCurrentCityMikrotiks (state, mikrotiks) {
    try {
      state.currentCityMikrotiks = mikrotiks
    } catch (error) {
      throw new Error(`CURRENT MIKROTIKS MUTATE ${error}`)
    }
  }
}
export const actions = {
  async getCitiesFromDatabase ({ commit }) {
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}cities`)
        .then(res => res.json())
        .then((cities) => {
          localStorage.setItem('cities', JSON.stringify(cities.data))
          commit('getCitiesFromDatabase', cities.data)
        })
    } catch (error) {
      throw new Error(`CITY ACTION ${error}`)
    }
  },
  getCurrentCityMikrotiks ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        const qs = require('qs')
        const query = qs.stringify({
          filters: {
            city: {
              name: payload.city
            }
          }
        },
        {
          encodeValuesOnly: true
        })
        fetch(`${this.$config.API_STRAPI_ENDPOINT}mikrotiks?${query}`)
          .then(res => res.json())
          .then((mikrotik) => {
            commit('getCurrentCityMikrotiks', mikrotik.data)
            resolve(mikrotik.data)
          })
      })
    } catch (error) {
      throw new Error(`CURRENT MIKROTIKS ACTION ${error}`)
    }
  }
}
