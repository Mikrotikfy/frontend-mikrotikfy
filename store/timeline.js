export const state = () => ({
  timeline: []
})
export const mutations = {
  getTimeline (state, _) {
    try {
      state.timeline = [
        {
          id: 1,
          e6: 1,
          technician: {
            id: 1,
            username: 'carlos'
          },
          ticketdiagnostic: {
            id: 1,
            diagnostictype: {
              id: 1,
              name: 'ROUTER BLOQUEADO'
            },
            diagnosticdetails: 'Se realiza visita a cliente donde s evidencia router blqueado. Se reinicia para mejorar la conectivida.d Se cambia la contraseña del weifi y sijdfsafoisejfsoijfeoif',
            date: '2020-01-01T00:00:00.000Z'
          },
          ticketsolution: {
            id: 1,
            solutiontype: {
              id: 1,
              name: 'REINICIO DE ROUTER'
            },
            solutiondetails: 'XDDDDDDDDDDDDDDDDDD',
            date: null
          },
          start: '2022-06-17T15:09:40.000Z',
          end: '2022-06-18T15:08:00.000Z'
        }
      ]
    } catch (error) {
      throw new Error(`PLAN MUTATE ${error}`)
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
      throw new Error(`PLAN MUTATE ${error}`)
    }
  }
}
export const actions = {
  newTimeline ({ commit }, { clientid, ticketid, city, technician, start }) {
    try {
      commit('newTimeline', { clientid, ticketid, city, technician, start })
    } catch (error) {
      throw new Error(`PLAN ACTION ${error}`)
    }
  },
  getTimeline ({ commit }, { city, token }) {
    try {
      commit('getTimeline')
    } catch (error) {
      throw new Error(`PLAN ACTION ${error}`)
    }
  }
}
