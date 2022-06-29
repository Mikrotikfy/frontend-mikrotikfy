export const state = () => ({
  timeline: []
})
export const mutations = {
  getTickets (state, tickets) {
    try {
      state.timeline = tickets.data
    } catch (error) {
      throw new Error(`TIMELINE MUTATE ${error}`)
    }
  },
  newTimeline (state, data) {
    try {
      state.timeline.push({
        id: state.timeline[state.timeline.length - 1].id + 1,
        e6: 1,
        city: data.city,
        ticketid: data.ticketid,
        clientid: data.clientid,
        technician: data.technician,
        ticketdiagnostic: {
          diagnostictype: {
            id: 0,
            name: 'INICIO SERVICIO'
          }
        },
        ticketsolution: {
          solutiontype: {
            id: 0,
            name: 'INICIO SERVICIO'
          }
        },
        start: data.start,
        end: null
      })
    } catch (error) {
      throw new Error(`TIMELINE MUTATE ${error}`)
    }
  }
}
export const actions = {
  newTimeline ({ commit }, { clientid, ticketid, city, technician, start }) {
    try {
      commit('newTimeline', { clientid, ticketid, city, technician, start })
    } catch (error) {
      throw new Error(`TIMELINE ACTION ${error}`)
    }
  },
  async getTickets ({ commit }, { city, token, active, clienttype, retired, sort }) {
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
    try {
      const qs = require('qs')
      const query = qs.stringify({
        filters,
        populate: [
          'client',
          'client.neighborhood',
          'client.technology',
          'tickettype',
          'assignated',
          'ticketdetails',
          'ticketdetails.operator',
          'timeline',
          'timeline.technician',
          'timeline.ticketdiagnostic',
          'timeline.ticketdiagnostic.diagnostictype',
          'timeline.ticketsolution',
          'timeline.ticketsolution.solutiontype'
        ],
        sort: sort !== '' ? sort : 'id:desc'
      },
      {
        encodeValuesOnly: true
      })
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}tickets?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then((tickets) => {
          commit('getTickets', tickets)
        })
    } catch (error) {
      throw new Error(`TIMELINE ACTION ${error}`)
    }
  }
}
