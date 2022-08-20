export const state = () => ({
  ready: [],
  clients: [],
  validClients: [],
  cuts: [],
  cutErrors: [],
  inprocess: false,
  loading: false,
  kick: false,
  errors: 0,
  billingPeriod: null,
  billingPeriodMovements: []
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
  },
  getBillingPeriod (state, billingPeriod) {
    state.billingPeriod = billingPeriod
  },
  getBillingPeriodMovements (state, billingPeriodMovements) {
    state.billingPeriodMovements = billingPeriodMovements
  }
}
export const actions = {
  getBillingPeriod ({ commit }, payload) {
    try {
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          city: {
            name: payload.city
          }
        },
        sort: 'createdAt:desc'
      },
      {
        encodeValuesOnly: true
      })
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}billingperiods?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then((billingperiod) => {
            if (billingperiod.data.length > 0) {
              resolve(billingperiod)
              commit('getBillingPeriod', billingperiod.data[0])
            } else {
              commit('getBillingPeriod', { name: 'default', createdAt: Date.now() })
              resolve({ name: 'default', createdAt: Date.now() })
            }
          })
      })
    } catch (error) {
      throw new Error(`LAST DEBT HISTORY ACTION ${error}`)
    }
  },
  getBillingPeriodMovements ({ commit }, payload) {
    try {
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          isindebt: true,
          client: {
            city: {
              name: payload.city
            }
          },
          createdAt: {
            $gte: payload.billingPeriod.createdAt
          }
        },
        populate: ['client', 'client.neighborhood', 'client.debtmovements'],
        pagination: {
          pageSize: 1000
        },
        sort: 'createdAt:desc'
      },
      {
        encodeValuesOnly: true
      })
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}debtmovements?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then((debtmovements) => {
            const movements = []
            debtmovements.data.map((movement) => {
              if (movement.client.debtmovements.at(-1).isindebt) {
                movements.push(movement)
                return movement
              }
            })
            commit('getBillingPeriodMovements', movements)
            resolve(movements)
          })
      })
    } catch (error) {
      throw new Error(`LAST DEBT HISTORY ACTION ${error}`)
    }
  },
  addBillingPeriod ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}billingperiods`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          },
          body: JSON.stringify({
            data: {
              name: payload.name,
              city: payload.city
            }
          })
        })
          .then(res => res.json())
          .then((billingperiod) => {
            this.$toast.info('Periodo de corte actualizado.', { duration: 4000, position: 'top-center' })
            resolve(billingperiod)
          })
      })
    } catch (error) {
      throw new Error(`ADD BILLING PERIOD ACTION ${error}`)
    }
  },
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
