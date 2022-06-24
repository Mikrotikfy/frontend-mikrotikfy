export const state = () => ({
  timeline: []
})
export const mutations = {
  getTimeline (state, timeline) {
    try {
      state.timeline = timeline.data
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
  async getTimeline ({ commit }, { cityName, token }) {
    try {
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          city: {
            name: cityName
          }
        },
        populate: ['technician', 'client', 'client.neighborhood', 'client.technology', 'ticket', 'ticket.tickettype', 'ticket.assignated', 'ticket.ticketdetails', 'ticketdiagnostic', 'ticketdiagnostic.diagnostictype', 'ticketsolution', 'ticketsolution.solutiontype', 'city']
      },
      {
        encodeValuesOnly: true
      })
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}timelines?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then((timeline) => {
          commit('getTimeline', timeline)
        })
    } catch (error) {
      throw new Error(`TIMELINE ACTION ${error}`)
    }
  }
}
