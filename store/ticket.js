export const state = () => ({
  tickets: [],
  tickettypes: [],
  headers: []
})
export const mutations = {
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
  getHeadersByClienttype (state, clienttype) {
    if (clienttype === 'INTERNET') {
      state.headers = [
        { text: 'Estado', sortable: false, value: 'active', width: '5%' },
        { text: 'Codigo', sortable: false, value: 'client.code', width: 60, align: ' d-none d-lg-table-cell' },
        { text: 'Cédula', sortable: false, value: 'client.dni', width: 60, align: ' d-none d-lg-table-cell' },
        { text: 'Cliente', sortable: false, value: 'client.name' },
        { text: 'Dirección', sortable: false, value: 'client.address', align: ' d-none d-lg-table-cell' },
        { text: 'Barrio', sortable: true, value: 'client.neighborhood.name' },
        { text: 'Telefono', sortable: false, value: 'client.phone', align: ' d-none d-lg-table-cell' },
        { text: 'Tec.', sortable: false, value: 'client.technology.name', align: ' d-none d-lg-table-cell' },
        { text: 'Tipo', sortable: false, value: 'tickettype.name' },
        { text: 'Creado por', sortable: false, value: 'assignated.username', align: ' d-none d-lg-table-cell' },
        { text: 'Observaciones', sortable: false, value: 'details', width: 400, align: ' d-none d-lg-table-cell' },
        { text: 'Creado el', sortable: false, value: 'createdAt', align: ' d-none d-lg-table-cell' },
        { text: 'Acciones', sortable: false, value: 'actions', align: ' d-none d-lg-table-cell' }
      ]
    } else {
      state.headers = [
        { text: 'Estado', sortable: false, value: 'active', width: '5%' },
        { text: 'Codigo', sortable: false, value: 'client.code', width: 60, align: ' d-none d-lg-table-cell' },
        { text: 'Cédula', sortable: false, value: 'client.dni', width: 60, align: ' d-none d-lg-table-cell' },
        { text: 'Cliente', sortable: false, value: 'client.name' },
        { text: 'Dirección', sortable: false, value: 'client.address', align: ' d-none d-lg-table-cell' },
        { text: 'Barrio', sortable: true, value: 'client.neighborhood.name' },
        { text: 'Telefono', sortable: false, value: 'client.phone', align: ' d-none d-lg-table-cell' },
        { text: 'Creado por', sortable: false, value: 'tickettype.name' },
        { text: 'Operador', sortable: false, value: 'assignated.username', align: ' d-none d-lg-table-cell' },
        { text: 'Observaciones', sortable: false, value: 'details', width: 400, align: ' d-none d-lg-table-cell' },
        { text: 'Creado el', sortable: false, value: 'createdAt', align: ' d-none d-lg-table-cell' },
        { text: 'Acciones', sortable: false, value: 'actions', align: ' d-none d-lg-table-cell' }
      ]
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
          'client.neighborhood',
          'client.technology',
          'client.plan',
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
          commit('getHeadersByClienttype', clienttype)
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
        this.$toast.info('Tipo de Ticket actualizado con exito', { duration: 4000, position: 'top-center' })
      })
  }
}
