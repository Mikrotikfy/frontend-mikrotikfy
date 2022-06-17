export const state = () => ({
  timeline: []
})
export const mutations = {
  getTimeline (state, _) {
    try {
      state.timeline = [
        {
          id: 1,
          technician: {
            id: 1,
            name: 'carlos'
          },
          ticketdiagnostic: {
            id: 1,
            diagnostictype: {
              id: 1,
              name: 'ROUTER BLOQUEADO'
            },
            diagnosticdetails: 'Se realiza visita a cliente donde s evidencia router blqueado. Se reinicia para mejorar la conectivida.d Se cambia la contraseña del weifi y sijdfsafoisejfsoijfeoif',
            active: false,
            date: '2020-01-01T00:00:00.000Z'
          },
          ticketsolution: {
            id: 1,
            solutiontype: {
              id: 1,
              name: 'REINICIO DE ROUTER'
            },
            solutiondetails: 'XDDDDDDDDDDDDDDDDDD',
            active: true,
            date: null
          },
          start: '2022-06-17T15:09:40.000Z',
          end: '2022-06-17T15:13:00.000Z'
        }
      ]
    } catch (error) {
      throw new Error(`PLAN MUTATE ${error}`)
    }
  }
}
export const actions = {
  getTimeline ({ commit }, { city, token }) {
    try {
      commit('getTimeline')
    } catch (error) {
      throw new Error(`PLAN ACTION ${error}`)
    }
  }
}
