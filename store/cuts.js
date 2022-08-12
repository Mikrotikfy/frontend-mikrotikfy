export const state = () => ({
  ready: [
    '13500'
  ],
  clients: [],
  validClients: [],
  cuts: [],
  cutErrors: [],
  inprocess: false,
  loading: false,
  kick: false,
  errors: 0
})
export const mutations = {
  setCodes (state, codes) {
    state.ready = codes
  },
  addClient (state, clients) {
    state.clients.push(clients)
  },
  addValidClient (state, clients) {
    state.validClients.push(clients)
  },
  addCut (state, cuts) {
    state.cuts.push({ success: true, ...cuts.client })
  },
  addCutError (state, erroredClient) {
    state.cutErrors = erroredClient
  },
  reset (state) {
    state.clients = []
  },
  resetcuts (state) {
    state.cuts = []
  },
  resetvalid (state) {
    state.validClients = []
  },
  loading (state, loading) {
    state.loading = loading
  },
  adderror (state) {
    state.errors = state.errors + 1
  },
  reseterror (state) {
    state.errors = 0
  },
  kick (state, kick) {
    state.kick = kick
  }
}
export const actions = {
  prepareClients ({ commit }, payload) {
    try {
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          code: payload.ready,
          city: {
            name: payload.city
          }
        },
        populate: ['neighborhood', 'plan'],
        sort: 'createdAt:desc'
      },
      {
        encodeValuesOnly: true
      })
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}clients?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then((clients) => {
            clients.valid = true
            if (clients.data.length === 1) {
              for (let i = 0; i < clients.data.length; i++) {
                commit('addClient', { valid: true, ...clients.data[i] })
                commit('addValidClient', clients.data[i])
                resolve({ valid: true, ...clients.data[i] })
              }
            } else if (clients.data.length > 1) {
              commit('addClient', { valid: true, ...clients.data[0] })
              commit('addValidClient', clients.data[0])
              resolve({ valid: true, ...clients.data[0] })
            } else {
              const notfound = {
                valid: false,
                code: payload.ready,
                name: 'Cliente no encontrado'
              }
              commit('addClient', notfound)
              commit('adderror')
              resolve(notfound)
            }
          })
      })
    } catch (error) {
      throw new Error(`LAST DEBT HISTORY ACTION ${error}`)
    }
  }
}
