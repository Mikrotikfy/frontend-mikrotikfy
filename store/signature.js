
export const state = () => ({

})
export const mutations = {
}
export const actions = {
  updateSignatureOnClient ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}clients/${payload.ticket.client.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          },
          body: JSON.stringify({
            data: {
              signed: true
            }
          })
        })
          .then(res => res.json())
          .then((client) => {
            resolve(client.data)
          })
      })
    } catch (error) {
      throw new Error(`SIGNATURE ON CLIENT ${error}`)
    }
  },
  updateSignatureOnTicket ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}tickets/${payload.ticket.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          },
          body: JSON.stringify({
            data: {
              signed: true,
              signature: payload.signature
            }
          })
        })
          .then(res => res.json())
          .then((ticket) => {
            this.$toast.info('Ticket firmado correctamente', { duration: 4000 })
            resolve(ticket.data)
          })
      })
    } catch (error) {
      throw new Error(`SIGNATURE ON TICKET ${error}`)
    }
  }
}
