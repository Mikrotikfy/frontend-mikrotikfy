export const state = () => ({
  applyOffer: false,
  usePlan: false,
  billingPeriod: null,
  billingPeriodMovements: [],
  clients: [],
  clientsByPlan: [],
  cutErrors: [],
  cuts: [],
  e1: '1',
  errors: 0,
  isindebt: 0,
  inprocess: false,
  kick: false,
  loading: false,
  month: null,
  offer: null,
  offerForBulkProcess: null,
  plans: [],
  prepare: false,
  ready: [],
  type: null,
  validClients: []
})
export const mutations = {
  clear (state) {
    state.applyOffer = false
    state.usePlan = false
    state.billingPeriod = null
    state.billingPeriodMovements = []
    state.clients = []
    state.clientsByPlan = []
    state.cutErrors = []
    state.cuts = []
    state.e1 = '1'
    state.errors = 0
    state.inprocess = false
    state.kick = false
    state.loading = false
    state.month = null
    state.offer = null
    state.offerForBulkProcess = null
    state.plans = []
    state.prepare = false
    state.ready = []
    state.type = null
    state.validClients = []
  },
  e1 (state, e1) {
    state.e1 = e1
  },
  usePlan (state, usePlan) {
    state.usePlan = usePlan
  },
  setMonth (state, month) {
    state.month = month
  },
  setOfferForBulkProcess (state, offer) {
    state.offerForBulkProcess = offer
  },
  setType (state, type) {
    state.type = type
  },
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
  addCutInDebt (state, cuts) {
    state.isindebt.push(cuts.client)
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
  prepare (state, prepare) {
    state.prepare = prepare
  },
  applyOffer (state, applyOffer) {
    state.applyOffer = applyOffer
  },
  offer (state, offer) {
    state.offer = offer
  },
  getBillingPeriod (state, billingPeriod) {
    state.billingPeriod = billingPeriod
  },
  getBillingPeriodMovements (state, billingPeriodMovements) {
    state.billingPeriodMovements = billingPeriodMovements
  },
  getPlans (state, plans) {
    state.plans = plans
  },
  getClientsByPlan (state, clients) {
    state.clientsByPlan = clients
  }
}
export const actions = {
  getClientsByPlan ({ commit }, payload) {
    try {
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          $and: [
            { plan: payload.plan },
            { city: { name: payload.city } }
          ]
        },
        pagination: {
          pageSize: 10000
        },
        sort: 'createdAt:desc'
      },
      {
        encodeValuesOnly: true
      })
      fetch(`${this.$config.API_STRAPI_ENDPOINT}clients?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then((clients) => {
          commit('getClientsByPlan', clients.data)
        })
    } catch (error) {
      throw new Error(`LAST DEBT HISTORY ACTION ${error}`)
    }
  },
  getPlans ({ commit }, payload) {
    fetch(`${this.$config.API_STRAPI_ENDPOINT}plans`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${payload.token}`
      }
    })
      .then(res => res.json())
      .then((plans) => {
        commit('getPlans', plans.data)
      })
  },
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
            this.$toast.info('Periodo de corte actualizado.', { duration: 4000, position: 'bottom-center' })
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
        populate: ['neighborhood', 'plan', 'offer', 'debtmovements'],
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
