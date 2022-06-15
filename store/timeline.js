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
          diagnostic: {
            id: 1,
            type: 'ROUTER BLOQUEADO',
            active: true,
            date: '2020-01-01T00:00:00.000Z'
          },
          solution: {
            id: 1,
            type: 'REINICIO DE ROUTER',
            active: false,
            date: null
          },
          start: '2022-06-15T15:09:40.000Z',
          end: '2020-01-01T00:00:00.000Z'
        },
        {
          id: 2,
          technician: {
            id: 2,
            name: 'norberto'
          },
          diagnostic: {
            id: 1,
            type: 'ROUTER QUEMADO',
            active: false,
            date: '2020-01-01T00:00:00.000Z'
          },
          solution: {
            id: 1,
            type: 'REINICIO DE ROUTER',
            active: true,
            date: null
          },
          start: '2022-06-15T08:50:00.000Z',
          end: '2020-01-01T00:00:00.000Z'
        },
        {
          id: 3,
          technician: {
            id: 3,
            name: 'wilmar'
          },
          diagnostic: {
            id: 1,
            type: 'DAÑO EN ACOMETIDA',
            active: false,
            date: '2020-01-01T00:00:00.000Z'
          },
          solution: {
            id: 1,
            type: 'CAMBIO DE ACOMETIDA',
            active: false,
            date: null
          },
          start: '2022-06-15T07:00:00.000Z',
          end: '2020-01-01T00:00:00.000Z'
        },
        {
          id: 4,
          technician: {
            id: 4,
            name: 'mincho'
          },
          diagnostic: {
            id: 1,
            type: 'CONECTOR UTP DEFECTUOSO',
            active: false,
            date: '2020-01-01T00:00:00.000Z'
          },
          solution: {
            id: 1,
            type: 'REINICIO DE ROUTER',
            active: false,
            date: null
          },
          start: '2022-06-15T08:30:00.000Z',
          end: '2020-01-01T00:00:00.000Z'
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
