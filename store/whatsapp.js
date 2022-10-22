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
      state.whatsappMessages.push(whatsappMessages)
    } catch (error) {
      throw new Error(`WHATSAPP CONTACTS MUTATE ${error}`)
    }
  },
  getOwnWhatsappMessages (state, ownWhatsappMessages) {
    try {
      state.whatsappMessages.push(ownWhatsappMessages)
    } catch (error) {
      throw new Error(`WHATSAPP CONTACTS MUTATE ${error}`)
    }
  }
}
export const actions = {
  createMediaEntry ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      fetch(`${this.$config.API_STRAPI_ENDPOINT}whatsappmedias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        },
        body: JSON.stringify({
          data: {
            mediaid: payload.mediaid,
            url: payload.img.url
          }
        })
      })
        .then(response => response.json())
        .then((whatsappMedia) => {
          resolve(whatsappMedia)
        })
    })
  },
  getImgByMediaId ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      fetch(`${this.$config.API_STRAPI_ENDPOINT}getwhatsappmedia?mediaid=${payload.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then((whatsappMedia) => {
          resolve(whatsappMedia)
        })
    })
  },
  getMediaById (_, payload) {
    const qs = require('qs')
    const query = qs.stringify({
      filters: {
        mediaid: payload.id
      }
    },
    {
      encodeValuesOnly: true
    })
    return new Promise((resolve, reject) => {
      fetch(`${this.$config.API_STRAPI_ENDPOINT}whatsappmedias?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then((whatsappMedia) => {
          resolve(whatsappMedia.data)
        })
    })
  },
  getWhatsappMessages ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        const qs = require('qs')
        const query = qs.stringify({
          filters: {
            phone: payload.phone,
            to: {
              $null: true
            }
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
  getOwnWhatsappMessages ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        const qs = require('qs')
        const query = qs.stringify({
          filters: {
            phone: payload.phone,
            to: {
              $notNull: true
            }
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
          .then((ownWhatsappMessages) => {
            commit('getOwnWhatsappMessages', ownWhatsappMessages.data)
            resolve(ownWhatsappMessages.data)
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
