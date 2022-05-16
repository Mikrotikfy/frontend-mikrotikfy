export const state = () => ({
  activationrequests: []
})
export const mutations = {
  getActivationRequestsFromDatabase (state, activationrequests) {
    try {
      state.activationrequests = activationrequests
    } catch (error) {
      throw new Error(`ACTIVATION REQUESTS MUTATE ${error}`)
    }
  },
  updateActivationRequest (state, { index, activationrequest }) {
    try {
      state.activationrequests[index].active = !activationrequest.active
    } catch (error) {
      throw new Error(`ACTIVATION REQUESTS MUTATE ${error}`)
    }
  }
}
export const actions = {
  async getActivationRequestsFromDatabase ({ commit }, payload) {
    try {
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          hasPendingRx: true,
          active: false
        },
        populate: [
          'city',
          'plan',
          'technology',
          'neighborhood'
        ]
      },
      {
        encodeValuesOnly: true
      })
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}clients?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then((activationrequests) => {
          localStorage.setItem('activationrequests', JSON.stringify(activationrequests.data))
          commit('getActivationRequestsFromDatabase', activationrequests.data)
        })
    } catch (error) {
      throw new Error(`ACTIVATION REQUESTS ACTION ${error}`)
    }
  },
  async updateActivationRequest ({ commit }, payload) {
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}clients/${payload.activationrequest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        },
        body: JSON.stringify({ data: { active: !payload.activationrequest.active, hasPendingRx: !payload.activationrequest.hasPendingRx } })
      })
      commit('updateActivationRequest', { index: payload.index, activationrequest: payload.activationrequest })
    } catch (error) {
      throw new Error(`ACTIVATION REQUESTS ACTION ${error}`)
    }
  },
  async createClientOnMikrotikById (_, payload) {
    await fetch(`${this.$config.API_STRAPI_ENDPOINT}admincreate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${payload.token}`
      },
      body: JSON.stringify({
        data: { ...payload.client, operator: payload.operator }
      })
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error)
      throw new Error(`ADMINCREATE ACTION ${error}`)
    })
  }
}
