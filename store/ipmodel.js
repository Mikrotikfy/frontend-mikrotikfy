export const state = () => ({
  lastIpModel: {},
  currentClientHasStaticIp: false
})
export const mutations = {
  getLast (state, lastIpModel) {
    try {
      state.lastIpModel = lastIpModel[0]
    } catch (error) {
      throw new Error(`IP MODEL MUTATE ${error}`)
    }
  },
  clientHasModel (state, client) {
    if (client.data.length > 0) {
      state.currentClientHasStaticIp = true
    } else {
      state.currentClientHasStaticIp = false
    }
  }
}
export const actions = {
  async clientHasModel ({ commit }, payload) {
    try {
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          city: {
            name: payload.city
          },
          client: payload.clientId
        }
      },
      {
        encodeValuesOnly: true
      })
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}staticips?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then((client) => {
          commit('clientHasModel', client)
        })
    } catch (error) {
      throw new Error(`IP MODEL ACTION ${error}`)
    }
  },
  async getLast ({ commit }, payload) {
    try {
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          city: {
            name: payload.city
          }
        },
        sort: 'createdAt:desc',
        pagination: {
          pageSize: 1
        },
        populate: ['client']
      },
      {
        encodeValuesOnly: true
      })
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}staticips?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then((lastIpModel) => {
          commit('getLast', lastIpModel.data)
        })
    } catch (error) {
      throw new Error(`IP MODEL ACTION ${error}`)
    }
  }
}
