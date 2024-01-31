export const state = () => ({
  applyOffer: false,
  billingPeriod: null,
  billingPeriodMovements: [],
  services: [],
  servicesByPlan: [],
  cutErrors: [],
  cuts: [],
  e1: '1',
  errors: 0,
  isindebt: 0,
  inprocess: false,
  kick: false,
  loading: false,
  month: null,
  year: null,
  offer: null,
  offerForBulkProcess: null,
  plans: [],
  prepare: false,
  ready: [],
  type: null,
  validServices: [],
  currentBillingPeriod: null
})
export const mutations = {
  currentBillingPeriod (state, currentBillingPeriod) {
    state.currentBillingPeriod = currentBillingPeriod
  },
  clear (state) {
    state.applyOffer = false
    state.usePlan = false
    state.billingPeriod = null
    state.billingPeriodMovements = []
    state.services = []
    state.servicesByPlan = []
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
    state.validServices = []
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
  setYear (state, year) {
    state.year = year
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
  addService (state, services) {
    state.services.push(services)
  },
  addValidService (state, services) {
    state.validServices.push(services)
  },
  addCut (state, cuts) {
    state.cuts.push({ success: true, ...cuts.service })
  },
  addCutError (state, erroredService) {
    state.cutErrors = erroredService
  },
  addCutInDebt (state, cuts) {
    state.isindebt.push(cuts.service)
  },
  reset (state) {
    state.services = []
  },
  resetcuts (state) {
    state.cuts = []
  },
  resetvalid (state) {
    state.validServices = []
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
  getServicesByPlan (state, services) {
    state.servicesByPlan = services
  }
}
export const actions = {
  beginServerSideProcess ({ commit }, payload) {
    try {
      fetch(`${this.$config.API_STRAPI_ENDPOINT}serversidecuts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        },
        body: JSON.stringify({
          data: {
            city: payload.city,
            kick: payload.kick,
            services: payload.services,
            currentBillingPeriod: payload.currentBillingPeriod,
            billingmonth: payload.billingmonth,
            billingyear: payload.billingyear,
            operator: payload.operator
          }
        })
      })
        .then(res => res.json())
        .then((response) => {
          if (response.status === 'ok') {
            this.$toast.info('Proceso iniciado.', { duration: 4000, position: 'bottom-center' })
          }
        })
    } catch (error) {
      throw new Error(`SERVER SIDE CUTS INITIATOR ${error}`)
    }
  },
  getServicesByPlan ({ commit }, payload) {
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
      fetch(`${this.$config.API_STRAPI_ENDPOINT}services?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then(({ data: services }) => {
          commit('getServicesByPlan', services)
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
  retireService ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}services/${payload.service.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          },
          body: JSON.stringify({
            data: {
              active: payload.active,
              indebt: payload.indebt
            }
          })
        })
          .then(res => res.json())
          .then(({ data: service }) => {
            resolve(service)
          })
      })
    } catch (error) {
      throw new Error(`RETIRE SERVICE ACTION ${error}`)
    }
  },
  updateBillingPeriodAndDebt ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}services/${payload.service.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          },
          body: JSON.stringify({
            data: {
              billingmonth: payload.billingmonth,
              billingyear: payload.billingyear,
              indebt: payload.indebt
            }
          })
        })
          .then(res => res.json())
          .then((billingperiod) => {
            resolve(billingperiod)
          })
      })
    } catch (error) {
      throw new Error(`UPDATE BILLING PERIOD ON SERVICE ACTION ${error}`)
    }
  },
  getServicesByBillingPeriod ({ commit }, payload) {
    try {
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          $and: [
            { clienttype: { name: payload.clienttype } },
            { city: { name: payload.city } },
            { billingmonth: payload.month },
            { billingyear: payload.year },
            { indebt: payload.indebt },
            { active: payload.active }
          ]
        },
        pagination: {
          pageSize: 500
        },
        populate: [
          'normalized_client',
          'service_addresses',
          'service_addresses.neighborhood'
        ],
        sort: 'createdAt:desc'
      },
      {
        encodeValuesOnly: true
      })
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}services?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then(({ data: services }) => {
            resolve(services)
          })
      })
    } catch (error) {
      throw new Error(`LAST DEBT HISTORY ACTION ${error}`)
    }
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
          service: {
            city: {
              name: payload.city
            }
          },
          createdAt: {
            $gte: payload.billingPeriod.createdAt
          }
        },
        populate: ['service', 'service.service_addresses', 'service.service_addresses.neighborhood', 'service.debtmovements'],
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
              if (movement.service.debtmovements.at(-1).isindebt) {
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
              city: payload.city,
              month: payload.month,
              year: payload.year
            }
          })
        })
          .then(res => res.json())
          .then(({ data: billingperiod }) => {
            this.$toast.info('Periodo de corte actualizado.', { duration: 4000, position: 'bottom-center' })
            resolve(billingperiod)
          })
      })
    } catch (error) {
      throw new Error(`ADD BILLING PERIOD ACTION ${error}`)
    }
  },
  getBillingPeriods ({ commit }, payload) {
    try {
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          city: {
            name: payload.city
          }
        },
        pagination: {
          pageSize: 12
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
          .then((billingperiods) => {
            resolve(billingperiods.data)
          })
      })
    } catch (error) {
      throw new Error(`LAST DEBT HISTORY ACTION ${error}`)
    }
  },
  prepareServices ({ commit }, payload) {
    try {
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          code: payload.ready,
          city: {
            name: payload.city
          }
        },
        populate: ['service_addresses', 'service_addresses.neighborhood', 'normalized_client', 'plan', 'offer', 'debtmovements'],
        sort: 'createdAt:desc'
      },
      {
        encodeValuesOnly: true
      })
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}services?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then(({ data: services }) => {
            services.valid = true
            if (services.length === 1) {
              for (let i = 0; i < services.length; i++) {
                if (services[i].normalized_client) {
                  commit('addService', { valid: true, ...services[i] })
                  commit('addValidService', services[i])
                  resolve({ valid: true, ...services[i] })
                } else {
                  const notfound = {
                    valid: false,
                    code: payload.ready,
                    name: 'Servicio no encontrado'
                  }
                  commit('addService', notfound)
                  commit('adderror')
                  resolve(notfound)
                }
              }
            } else if (services.length > 1) {
              commit('addService', { valid: true, ...services[0] })
              commit('addValidService', services[0])
              resolve({ valid: true, ...services[0] })
            } else {
              const notfound = {
                valid: false,
                code: payload.ready,
                name: 'Servicio no encontrado'
              }
              commit('addService', notfound)
              commit('adderror')
              resolve(notfound)
            }
          })
      })
    } catch (error) {
      throw new Error(`LAST DEBT HISTORY ACTION ${error}`)
    }
  },
  getLastBillingPeriod ({ commit }, payload) {
    try {
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          city: {
            name: payload.city.name
          }
        },
        pagination: {
          pageSize: 1
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
          .then(({ data: lastBillingPeriod }) => {
            resolve(lastBillingPeriod)
          })
      })
    } catch (error) {
      throw new Error(`LAST DEBT HISTORY ACTION ${error}`)
    }
  }
}
