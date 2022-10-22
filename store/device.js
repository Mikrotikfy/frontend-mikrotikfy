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
  assignDeviceToClient ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      fetch(`${this.$config.API_STRAPI_ENDPOINT}devices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        },
        body: JSON.stringify({
          data: {
            mac_address: payload.mac,
            details: 'ASIGNADO AUTOMATICAMENTE POR LA API',
            clients: [payload.clientid]
          }
        })
      })
        .then(response => response.json())
        .then((created) => {
          resolve(created.data)
        })
    })
  },
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
