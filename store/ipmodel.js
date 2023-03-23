export const state = () => ({
  lastIpModel: null,
  currentClientHasStaticIp: false,
  ipModel: null
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
  },
  getIpModel (state, ipModel) {
    state.ipModel = ipModel
  }
}
export const actions = {
  getIpModel ({ commit }, payload) {
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
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}staticips?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then((client) => {
            commit('getIpModel', client.data[0])
            resolve(client.data[0])
          })
      })
    } catch (error) {
      throw new Error(`IP MODEL ACTION ${error}`)
    }
  },
  saveIpModel ({ commit }, payload) {
    fetch(`${this.$config.API_STRAPI_ENDPOINT}clients/${payload.data.client}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${payload.token}`
      },
      body: JSON.stringify({
        data: {
          vlan: payload.data.vlan.id
        }
      })
    })
    return new Promise((resolve, reject) => {
      fetch(`${this.$config.API_STRAPI_ENDPOINT}staticips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        },
        body: JSON.stringify({
          data: payload.data
        })
      })
        .then((ipmodel) => {
          resolve(ipmodel)
        })
    })
  },
  sendIpModelToMikrotik ({ commit }, payload) {
    fetch(`${this.$config.API_STRAPI_ENDPOINT}ipmodelcreate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${payload.token}`
      },
      body: JSON.stringify({
        data: payload.data
      })
    })
  },
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
