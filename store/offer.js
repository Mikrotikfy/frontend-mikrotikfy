export const state = () => ({
  offerHistory: [],
  debtHistory: [],
  newDebtHistory: [],
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
  setNewDebt (state, offer) {
    try {
      state.debtHistory.push(offer)
      state.newDebtHistory.push(offer)
    } catch (error) {
      throw new Error(`NEW OFFER MUTATE ${error}`)
    }
  }
}
export const actions = {
  setNewOffer ({ commit }, payload) {
    try {
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
            technician: payload.technician.id
          }
        })
      })
        .then(res => res.json())
        .then((debtmovements) => {
          commit('setNewDebt', debtmovements.data)
        })
    } catch (error) {
      throw new Error(`SET OFFER ACTION ${error}`)
    }
  },
  setNewDebt ({ commit }, payload) {
    try {
      fetch(`${this.$config.API_STRAPI_ENDPOINT}debtmovements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        },
        body: JSON.stringify({
          data: {
            client: payload.client.id,
            isindebt: payload.isindebt,
            technician: payload.technician.id
          }
        })
      })
        .then(res => res.json())
        .then((debtmovements) => {
          commit('setNewDebt', debtmovements.data)
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
          populate: ['client', 'plan'],
          sort: 'name:desc'
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
        populate: ['client', 'offer', 'technician'],
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
      fetch(`${this.$config.API_STRAPI_ENDPOINT}debtmovements?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then((debtmovements) => {
          commit('getLastDebtMovement', debtmovements.data[0])
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
        populate: ['client', 'offer', 'technician'],
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
            resolve(offermovements.data[0].offer)
          })
      })
    } catch (error) {
      throw new Error(`LAST OFFER HISTORY ACTION ${error}`)
    }
  }
}
