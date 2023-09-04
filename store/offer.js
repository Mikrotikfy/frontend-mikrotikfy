export const state = () => ({
  offerHistory: [],
  debtHistory: [],
  newDebtHistory: [],
  newOfferHistory: [],
  currentOffer: null,
  lastDebtMovement: null,
  lastOfferMovement: null,
  offers: []
})
export const mutations = {
  getOfferHistory (state, offermovements) {
    try {
      state.offerHistory = offermovements
    } catch (error) {
      throw new Error(`OFFER HISTORY MUTATE ${error}`)
    }
  },
  getDebtHistory (state, debtmovements) {
    try {
      state.debtHistory = debtmovements
    } catch (error) {
      throw new Error(`DEBT HISTORY MUTATE ${error}`)
    }
  },
  getLastDebtMovement (state, debtmovement) {
    try {
      state.lastDebtMovement = debtmovement
    } catch (error) {
      throw new Error(`LAST DEBT MOVEMENT MUTATE ${error}`)
    }
  },
  setNewOffer (state, offer) {
    try {
      state.newDebtHistory.push(offer)
    } catch (error) {
      throw new Error(`NEW OFFER MUTATE ${error}`)
    }
  },
  setNewDebt (state, offer) {
    try {
      state.debtHistory.push(offer)
      state.newDebtHistory.push(offer)
    } catch (error) {
      throw new Error(`NEW OFFER MUTATE ${error}`)
    }
  },
  getOfferByPlanId (state, offer) {
    try {
      state.currentOffer = offer
    } catch (error) {
      throw new Error(`GET OFFER BY PLAN ID MUTATE ${error}`)
    }
  },
  getOffers (state, offers) {
    try {
      state.offers = offers
    } catch (error) {
      throw new Error(`GET OFFERS MUTATE ${error}`)
    }
  }
}
export const actions = {
  setNewOffer ({ commit }, payload) {
    try {
      fetch(`${this.$config.API_STRAPI_ENDPOINT}clients/${payload.client.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        },
        body: JSON.stringify({
          data: {
            offer: payload.offer.id
          }
        })
      })
      fetch(`${this.$config.API_STRAPI_ENDPOINT}offermovements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        },
        body: JSON.stringify({
          data: {
            client: payload.client.id,
            offer: payload.offer.id,
            technician: payload.technician.id,
            details: payload.details
          }
        })
      })
        .then(res => res.json())
        .then((debtmovements) => {
          this.$toast.info('Operacion de cambio de tarifa realizada con éxito.', { duration: 4000, position: 'bottom-center' })
          commit('setNewOffer', debtmovements.data)
        })
    } catch (error) {
      throw new Error(`SET OFFER ACTION ${error}`)
    }
  },
  setNewDebt ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}debtmovements`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          },
          body: JSON.stringify({
            data: {
              client: payload.client.id,
              city: payload.city.id,
              comment: payload.comment,
              isindebt: payload.isindebt,
              isretired: payload.isretired,
              technician: payload.technician.id
            }
          })
        })
          .then(res => res.json())
          .then((debtmovements) => {
            commit('setNewDebt', debtmovements.data)
            if (!payload.isBulkDx) {
              this.$toast.info('Operacion de control de usuario realizada con éxito.', { duration: 4000, position: 'bottom-center' })
            }
            resolve(true)
          })
      })
    } catch (error) {
      throw new Error(`OFFER HISTORY ACTION ${error}`)
    }
  },
  getOffers ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        const qs = require('qs')
        const query = qs.stringify({
          filters: {
            city: payload.city,
            clienttype: payload.clienttype
          },
          populate: ['client', 'plan'],
          sort: 'name:desc',
          pagination: {
            pageSize: 1000
          }
        },
        {
          encodeValuesOnly: true
        })
        fetch(`${this.$config.API_STRAPI_ENDPOINT}offers?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then((offers) => {
            commit('getOffers', offers.data)
            resolve(offers.data)
          })
      })
    } catch (error) {
      throw new Error(`OFFER HISTORY ACTION ${error}`)
    }
  },
  getOfferHistory ({ commit }, payload) {
    try {
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          client: payload.client.id
        },
        populate: ['client', 'offer', 'offer.plan', 'technician'],
        sort: 'createdAt:desc'
      },
      {
        encodeValuesOnly: true
      })
      fetch(`${this.$config.API_STRAPI_ENDPOINT}offermovements?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then((offermovements) => {
          commit('getOfferHistory', offermovements.data)
        })
    } catch (error) {
      throw new Error(`OFFER HISTORY ACTION ${error}`)
    }
  },
  getDebtHistory ({ commit }, payload) {
    try {
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          client: payload.client.id
        },
        populate: ['client', 'offer', 'technician'],
        sort: 'createdAt:desc'
      },
      {
        encodeValuesOnly: true
      })
      fetch(`${this.$config.API_STRAPI_ENDPOINT}debtmovements?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then((debtmovements) => {
          commit('getDebtHistory', debtmovements.data)
        })
    } catch (error) {
      throw new Error(`DEBT HISTORY ACTION ${error}`)
    }
  },
  getLastDebtMovement ({ commit }, payload) {
    try {
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          client: payload.client.id
        },
        populate: ['offer', 'plan'],
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
            if (debtmovements.data.length > 0) {
              resolve(debtmovements.data[0])
            } else {
              resolve(null)
            }
          })
      })
    } catch (error) {
      throw new Error(`LAST DEBT HISTORY ACTION ${error}`)
    }
  },
  getLastOfferMovement ({ commit }, payload) {
    try {
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          client: payload.client.id
        },
        populate: ['client', 'offer', 'offer.plan', 'technician'],
        sort: 'createdAt:desc'
      },
      {
        encodeValuesOnly: true
      })
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}offermovements?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then((offermovements) => {
            if (offermovements.data.length > 0) {
              resolve(offermovements.data[0].offer)
            } else {
              resolve(null)
            }
          })
      })
    } catch (error) {
      throw new Error(`LAST OFFER HISTORY ACTION ${error}`)
    }
  },
  getOfferByPlanId ({ commit }, payload) {
    try {
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          plan: payload.client.plan.id
        },
        populate: ['plan'],
        sort: 'createdAt:desc'
      },
      {
        encodeValuesOnly: true
      })
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}offers?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then((offers) => {
            commit('getOfferByPlanId', offers.data[0])
            resolve(offers.data[0])
          })
      })
    } catch (error) {
      throw new Error(`LAST OFFER HISTORY ACTION ${error}`)
    }
  }
}
