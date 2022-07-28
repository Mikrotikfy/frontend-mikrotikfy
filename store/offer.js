export const state = () => ({
  offerHistory: [],
  debtHistory: [],
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
  }
}
export const actions = {
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
        populate: ['client', 'offer'],
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
        populate: ['client', 'offer'],
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
  }
}
