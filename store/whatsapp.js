export const state = () => ({
  whatsappContacts: [],
  whatsappContactsPagination: [],
  whatsappMessages: [],
  currentChat: null
})
export const mutations = {
  getWhatsappContacts (state, whatsappContacts) {
    try {
      state.whatsappContacts = whatsappContacts.data
      state.whatsappContactsPagination = whatsappContacts.meta.pagination
    } catch (error) {
      throw new Error(`WHATSAPP CONTACTS MUTATE ${error}`)
    }
  },
  getMoreWhatsappContacts (state, whatsappContacts) {
    try {
      state.whatsappContacts = state.whatsappContacts.concat(whatsappContacts.data)
      state.whatsappContactsPagination = whatsappContacts.meta.pagination
    } catch (error) {
      throw new Error(`WHATSAPP CONTACTS MUTATE ${error}`)
    }
  },
  getWhatsappMessages (state, whatsappMessages) {
    try {
      const lastDummyItem = { to: 'dummy', payload: { type: 'text' } }
      state.whatsappMessages = whatsappMessages
      state.whatsappMessages.push(lastDummyItem)
    } catch (error) {
      throw new Error(`WHATSAPP CONTACTS MUTATE ${error}`)
    }
  },
  setCurrentChat (state, currentChat) {
    try {
      state.currentChat = currentChat
    } catch (error) {
      throw new Error(`WHATSAPP CONTACTS MUTATE ${error}`)
    }
  }
}
export const actions = {
  getWhatsappMessagesCount ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      fetch(`${this.$config.API_STRAPI_ENDPOINT}whatsapps`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(response => response.json())
        .then((whatsappMessages) => {
          resolve(whatsappMessages.meta.pagination.total)
        })
    })
  },
  getWhatsappContactsCount ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      fetch(`${this.$config.API_STRAPI_ENDPOINT}whatsappcontacts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(response => response.json())
        .then((whatsappContacts) => {
          resolve(whatsappContacts.meta.pagination.total)
        })
    })
  },
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
  createAudioEntry ({ commit }, payload) {
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
            url: payload.audio.url
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
  getAudioByMediaId ({ commit }, payload) {
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
  createMessage ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      fetch(`${this.$config.API_STRAPI_ENDPOINT}whatsapps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        },
        body: JSON.stringify({
          data: {
            phone: payload.phone,
            to: payload.to,
            payload: payload.payload
          }
        })
      })
        .then(response => response.json())
        .then((whatsappMessage) => {
          resolve(whatsappMessage)
        })
    })
  },
  sendMessage ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      fetch(`https://graph.facebook.com/v14.0/${payload.phone}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$config.META_TOKEN}`
        },
        body: JSON.stringify(
          payload.template
        )
      })
        .then(res => res.json())
        .then((res) => {
          resolve(res)
        })
    })
  },
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
          },
          sort: 'createdAt:desc'
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
            commit('setCurrentChat', payload.phone)
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
          pagination: payload.pagination,
          populate: ['lastwhatsapp'],
          sort: 'lastmessage:desc'
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
            commit('getWhatsappContacts', whatsappContacts)
            resolve(whatsappContacts.data)
          })
      })
    } catch (error) {
      throw new Error(`WHATSAPP CONTACTS ACTION ${error}`)
    }
  },
  getMoreWhatsappContacts ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        const qs = require('qs')
        const query = qs.stringify({
          pagination: payload.pagination,
          populate: ['lastwhatsapp'],
          sort: 'updatedAt:desc'
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
            commit('getMoreWhatsappContacts', whatsappContacts)
            resolve(whatsappContacts.data)
          })
      })
    } catch (error) {
      throw new Error(`WHATSAPP CONTACTS ACTION ${error}`)
    }
  },
  setReadToTrueAndResetPendingMessages ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      fetch(`${this.$config.API_STRAPI_ENDPOINT}whatsappcontacts/${payload.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        },
        body: JSON.stringify({
          data: {
            read: true,
            pendingmessages: 0
          }
        })
      })
        .then(response => response.json())
        .then((whatsappContacts) => {
          resolve(whatsappContacts)
        })
    })
  },
  updateLastmessage ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      fetch(`${this.$config.API_STRAPI_ENDPOINT}whatsappcontacts/${payload.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        },
        body: JSON.stringify({
          data: {
            lastmessage: new Date(),
            lastwhatsapp: payload.lastWhatsapp.id
          }
        })
      })
        .then(response => response.json())
        .then((res) => {
          resolve(res)
        })
    })
  }
}
