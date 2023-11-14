export const state = () => ({
  tickets: [],
  ticketList: [],
  tickettypes: [],
  pagination: {
    page: 1,
    pageSize: 10,
    pageCount: 0,
    total: 0
  },
  headers: [],
  refresh: 0
})
export const mutations = {
  refresh (state) {
    state.refresh++
  },
  addNap (state, payload) {
    state.tickets.find(ticket => ticket.id === payload.id).service.naps.push(payload.nap)
  },
  removeNap (state, payload) {
    state.tickets[payload.ticketindex].client.naps = []
  },
  updateTickettype (state, payload) {
    state.tickets.find(ticket => ticket.id === payload.id).tickettype = { ...payload.tickettype }
  },
  updateAssignated (state, payload) {
    state.tickets.find(ticket => ticket.id === payload.id).technician = { ...payload.technician }
  },
  getTicketsFromDatabase (state, data) {
    try {
      state.tickets = data.ticketList
      state.pagination = data.meta.pagination
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
  },
  changeView (state, payload) {
    if (payload === 'RV') {
      state.ticketList = state.tickets.filter((ticket) => {
        return ticket.tickettype.name !== 'CONEXION NUEVA' && ticket.tickettype.name !== 'DERIVADO' && ticket.tickettype.name !== 'RECONEXION' && ticket.tickettype.name !== 'REINSTALACION' && ticket.tickettype.name !== 'TRASLADO' && ticket.tickettype.name !== 'CAMBIO DE ACOMETIDA' && ticket.tickettype.name !== 'DX VOLUNTARIA' && ticket.tickettype.name !== 'DX POR MORA'
      })
    } else if (payload === 'CX') {
      state.ticketList = state.tickets.filter((ticket) => {
        return ticket.tickettype.name === 'CONEXION NUEVA' || ticket.tickettype.name === 'RECONEXION' || ticket.tickettype.name === 'REINSTALACION' || ticket.tickettype.name === 'DERIVADO' || ticket.tickettype.name === 'CONEXION NUEVA' || ticket.tickettype.name === 'CAMBIO DE ACOMETIDA'
      })
    } else if (payload === 'TR') {
      state.ticketList = state.tickets.filter((ticket) => {
        return ticket.tickettype.name === 'TRASLADO' || ticket.tickettype.name === 'CAMBIO DE LUGAR DE ACOMETIDA' || ticket.tickettype.name === 'CAMBIO DE LUGAR PUNTO DE TV' || ticket.tickettype.name === 'CAMBIO DE LUGAR ROUTER' || ticket.tickettype.name === 'CAMBIO DE LUGAR EQUIPO'
      })
    } else if (payload === 'DX') {
      state.ticketList = state.tickets.filter((ticket) => {
        return ticket.tickettype.name === 'DX POR MORA' || ticket.tickettype.name === 'DX VOLUNTARIA'
      })
    } else if (payload === 'TODOS') {
      state.ticketList = state.tickets.filter((ticket) => {
        return ticket.tickettype.name !== 'DX POR MORA' && ticket.tickettype.name !== 'DX VOLUNTARIA'
      })
    }
  }
}
export const actions = {
  getClientLastTicket ({ commit }, payload) {
    const qs = require('qs')
    const query = qs.stringify({
      populate: ['tickets', 'tickets.tickettype']
    },
    {
      encodeValuesOnly: true
    })
    return new Promise((resolve, reject) => {
      fetch(`${this.$config.API_STRAPI_ENDPOINT}services/${payload.serviceId}?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then((service) => {
          resolve(service.data.tickets.at(-1))
        })
    })
  },
  async getTicketsFromDatabase ({ commit }, { city, clienttype, tickettype, token, active, page }) {
    try {
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          active: {
            $eq: !active
          },
          city: {
            name: {
              $eq: city
            }
          },
          clienttype: {
            name: {
              $eq: clienttype
            }
          },
          tickettype: {
            name: tickettype
          }
        },
        populate: [
          'service',
          'service.normalized_client',
          'service.naps',
          'city',
          'media',
          'tickettype',
          'clienttype',
          'assignated',
          'technician',
          'ticketdetails',
          'ticketdetails.operator'
        ],
        sort: ['createdAt:desc'],
        pagination: {
          pageSize: 10,
          page
        }
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
        .then(({ data: tickets, meta }) => {
          const ticketList = tickets.map((ticket) => {
            if (ticket.ticketdetails.length > 0) {
              ticket.details = ticket.ticketdetails.slice(-1)[0].operator.username + ': ' + ticket.ticketdetails.slice(-1)[0].details
            }
            return ticket
          })
          commit('getTicketsFromDatabase', { ticketList, meta }) // get tickets from database
        })
        .catch((error) => {
          throw new Error(`TICKET ACTION ${error}`)
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
      },
      sort: 'createdAt:asc'
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
  },
  async saveAssignated ({ _ }, payload) {
    await fetch(`${this.$config.API_STRAPI_ENDPOINT}tickets/${payload.ticketid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${payload.token}`
      },
      body: JSON.stringify({
        data: {
          technician: payload.technicianid
        }
      })
    })
      .then(res => res.json())
      .then((_) => {
        this.$toast.info('Asignado de Ticket actualizado con exito', { duration: 4000, position: 'bottom-center' })
      })
  },
  addPhotoToTicket ({ commit }, payload) {
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
