export const state = () => ({
  foundClient: []
})
export const mutations = {
  searchClientByDni (state, clients) {
    try {
      state.foundClient = clients
    } catch (error) {
      throw new Error(`PLAN MUTATE ${error}`)
    }
  }
}
export const actions = {
  createTicketForPasswordChange ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      fetch(`${this.$config.API_STRAPI_ENDPOINT}tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            active: true,
            client: payload.selected.id,
            city: payload.selected.city.id,
            tickettype: 6,
            clienttype: 1,
            assignated: 22,
            details: 'Contraseña solicitada: ' + payload.new_password
          }
        })
      }).then((input) => {
        if (input.status === 200) {
          this.$toast.success('Peticion creada con éxito.', { position: 'bottom-center' })
          resolve(input)
        } else {
          this.$toast.error('Error al crear la solicitud. Intenta de nuevo o llamanos al 310 343 25 99 en Mariquita o al 350 810 59 49 en Fresno', { position: 'bottom-center' })
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      })
    })
  },
  searchClientByDni ({ commit }, payload) {
    const qs = require('qs')
    const query = qs.stringify({
      filters: {
        dni: payload.dni,
        clienttype: {
          name: 'INTERNET'
        }
      },
      populate: ['city', 'addresses', 'tickets', 'tickets.tickettype']
    },
    {
      encodeValuesOnly: true
    })
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}clients?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(res => res.json())
          .then((clients) => {
            commit('searchClientByDni', clients.data)
            resolve(clients.data)
          })
      })
    } catch (error) {
      throw new Error(`PLAN ACTION ${error}`)
    }
  }
}
