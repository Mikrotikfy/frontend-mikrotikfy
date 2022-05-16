export const state = () => ({
  cities: []
})
export const mutations = {
  getCitiesFromDatabase (state, cityList) {
    try {
      state.cities = cityList
    } catch (error) {
      throw new Error(`CITY MUTATE ${error}`)
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
  }
}
