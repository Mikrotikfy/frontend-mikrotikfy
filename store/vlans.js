export const state = () => ({
  vlans: []
})
export const mutations = {
  getVlans (state, vlanList) {
    try {
      state.vlans = vlanList
    } catch (error) {
      throw new Error(`VLAN MUTATE ${error}`)
    }
  }
}
export const actions = {
  async getVlans ({ commit }, payload) {
    try {
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
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}vlans?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then((vlans) => {
          commit('getVlans', vlans.data)
        })
    } catch (error) {
      throw new Error(`VLAN ACTION ${error}`)
    }
  }
}
