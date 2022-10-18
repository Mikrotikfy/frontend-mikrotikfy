export const state = () => ({
  whatsappContacts: [],
  whatsappMessages: []
})
export const mutations = {
  getWhatsappContacts (state, whatsappContacts) {
    try {
      state.whatsappContacts = whatsappContacts
    } catch (error) {
      throw new Error(`WHATSAPP CONTACTS MUTATE ${error}`)
    }
  },
  getWhatsappMessages (state, whatsappMessages) {
    try {
      state.whatsappMessages = whatsappMessages
    } catch (error) {
      throw new Error(`WHATSAPP CONTACTS MUTATE ${error}`)
    }
  }
}
export const actions = {
  getWhatsappMessages ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        const qs = require('qs')
        const query = qs.stringify({
          filters: {
            phone: payload.phone
          },
          pagination: {
            pageSize: 100
          }
        },
        {
          encodeValuesOnly: true
        })
        fetch(`${this.$config.API_STRAPI_ENDPOINT}whatsapps?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then((whatsappMessages) => {
            commit('getWhatsappMessages', whatsappMessages.data)
            resolve(whatsappMessages.data)
          })
      })
    } catch (error) {
      throw new Error(`WHATSAPP CONTACTS ACTION ${error}`)
    }
  },
  getWhatsappContacts ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        const qs = require('qs')
        const query = qs.stringify({
          pagination: {
            pageSize: 100
          }
        },
        {
          encodeValuesOnly: true
        })
        fetch(`${this.$config.API_STRAPI_ENDPOINT}whatsappcontacts?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then((whatsappContacts) => {
            commit('getWhatsappContacts', whatsappContacts.data)
            resolve(whatsappContacts.data)
          })
      })
    } catch (error) {
      throw new Error(`WHATSAPP CONTACTS ACTION ${error}`)
    }
  }
}
