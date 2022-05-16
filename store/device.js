export const state = () => ({
  devicebrands: []
})
export const mutations = {
  getDeviceBrandsFromDatabase (state, deviceBrandsList) {
    try {
      state.devicebrands = deviceBrandsList
    } catch (error) {
      throw new Error(`DEVICE BRANDS MUTATE ${error}`)
    }
  }
}
export const actions = {
  async getDeviceBrandsFromDatabase ({ commit }) {
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}devicebrands`)
        .then(res => res.json())
        .then((devicebrands) => {
          localStorage.setItem('devicebrands', JSON.stringify(devicebrands.data))
          commit('getDeviceBrandsFromDatabase', devicebrands.data)
        })
    } catch (error) {
      throw new Error(`DEVICE BRANDS ACTION ${error}`)
    }
  }
}
