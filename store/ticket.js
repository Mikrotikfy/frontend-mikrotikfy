export const state = () => ({
  tickets: [],
  tickettypes: [],
  headers: []
})
export const mutations = {
  addNap (state, payload) {
    state.tickets[payload.ticketindex].client.naps.push(payload.nap)
  },
  removeNap (state, payload) {
    state.tickets[payload.ticketindex].client.naps = []
  },
  updateTickettype (state, payload) {
    state.tickets[payload.index].tickettype = payload.tickettype
  },
  getTicketsFromDatabase (state, ticketList) {
    try {
      state.tickets = ticketList
    } catch (error) {
      throw new Error(`TICKET MUTATE ${error}`)
    }
  },
  getTickettypes (state, tickettypesList) {
    try {
      state.tickettypes = tickettypesList
    } catch (error) {
      throw new Error(`TICKETTYPE MUTATE ${error}`)
    }
  },
  updateTicketStatus (state, ticket) {
    try {
      state.tickets[ticket.editindex].active = !ticket.closeTicket
    } catch (error) {
      throw new Error(`TICKET MUTATE ${error}`)
    }
  }
}
export const actions = {
  async getTicketsFromDatabase ({ commit }, { city, clienttype, token, active, retired }) {
    try {
      let filters = null
      if (retired) {
        filters = {
          city: {
            name: {
              $eq: city
            }
          },
          active: {
            $eq: !active
          },
          tickettype: {
            name: {
              $eq: 'RETIRO'
            }
          },
          clienttype: {
            name: {
              $eq: clienttype
            }
          }
        }
      } else {
        filters = {
          city: {
            name: {
              $eq: city
            }
          },
          active: {
            $eq: !active
          },
          tickettype: {
            name: {
              $ne: 'RETIRO'
            }
          },
          clienttype: {
            name: {
              $eq: clienttype
            }
          }
        }
      }
      const qs = require('qs')
      const query = qs.stringify({
        filters,
        populate: [
          'client',
          'client.addresses',
          'client.addresses.neighborhood',
          'client.neighborhood',
          'client.technology',
          'client.plan',
          'client.naps',
          'client.debtmovements',
          'client.tvspec',
          'client.tvspec.tvspectype',
          'city',
          'tickettype',
          'clienttype',
          'assignated',
          'ticketdetails',
          'ticketdetails.operator'
        ],
        sort: ['createdAt:desc']
      },
      {
        encodeValuesOnly: true
      })
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}tickets?${query}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then((tickets) => {
          const ticketList = tickets.data.map((ticket) => {
            if (ticket.ticketdetails.length > 0) {
              ticket.details = ticket.ticketdetails.slice(-1)[0].operator.username + ': ' + ticket.ticketdetails.slice(-1)[0].details
            }
            return ticket
          })
          localStorage.setItem('tickets', JSON.stringify(ticketList))
          commit('getTicketsFromDatabase', ticketList)
          return ticketList
        })
    } catch (error) {
      throw new Error(`TICKET ACTION ${error}`)
    }
  },
  async getTickettypes ({ commit }, payload) {
    const qs = require('qs')
    const query = qs.stringify({
      filters: {
        clienttypes: {
          name: payload.clienttype
        }
      },
      pagination: {
        page: 1,
        pageSize: 1000
      }
    },
    {
      encodeValuesOnly: true
    })
    await fetch(`${this.$config.API_STRAPI_ENDPOINT}tickettypes?${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${payload.token}`
      }
    })
      .then(res => res.json())
      .then((tickettypes) => {
        commit('getTickettypes', tickettypes.data)
      })
  },
  async saveTickettype ({ _ }, payload) {
    await fetch(`${this.$config.API_STRAPI_ENDPOINT}tickets/${payload.ticketid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${payload.token}`
      },
      body: JSON.stringify({
        data: {
          tickettype: payload.tickettypeid
        }
      })
    })
      .then(res => res.json())
      .then((_) => {
        this.$toast.info('Tipo de Ticket actualizado con exito', { duration: 4000, position: 'bottom-center' })
      })
  }
}
