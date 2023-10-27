export const state = () => ({
  tickets: [],
  ticketList: [],
  tickettypes: [],
  headers: []
})
export const mutations = {
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
  async getTicketsFromDatabase ({ dispatch, commit }, { city, clienttype, token, active, retired }) {
    const isConnected = await this.$checkInternetConnection()
    if (isConnected) {
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
            'service',
            'service.normalized_client',
            'service.service_addresses',
            'service.service_addresses.neighborhood',
            'service.technology',
            'service.plan',
            'service.offer',
            'service.naps',
            'service.debtmovements',
            'service.tvspec',
            'service.tvspec.tvspectype',
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
            pageSize: 100
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
          .then((tickets) => {
            const ticketList = tickets.data.map((ticket) => {
              if (ticket.ticketdetails.length > 0) {
                ticket.details = ticket.ticketdetails.slice(-1)[0].operator.username + ': ' + ticket.ticketdetails.slice(-1)[0].details
              }
              return ticket
            })
            commit('ticket/getTicketsFromDatabase', ticketList, { root: true }) // get tickets from database
            dispatch('offline/ticketloc/saveTicketsToIndexedDB', ticketList, { root: true }) // save tickets to indexedDB
          })
          .catch((error) => {
            throw new Error(`TICKET ACTION ${error}`)
          })
      } catch (error) {
        throw new Error(`TICKET ACTION ${error}`)
      }
    } else { // if not connected to internet
      dispatch('offline/ticketloc/getTicketsFromIndexedDB', isConnected, { root: true })
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
