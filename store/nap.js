export const state = () => ({
  naps: [],
  serviceNapsList: []
})
export const mutations = {
  napList (state, napPayload) {
    try {
      state.naps = napPayload
    } catch (error) {
      throw new Error(`NAPS LIST MUTATE ${error}`)
    }
  },
  napTypes (state, napTypes) {
    try {
      state.napTypes = napTypes
    } catch (error) {
      throw new Error(`NAPSTYPES MUTATE ${error}`)
    }
  },
  filterCurrentNaps (state, { naps }) {
    try {
      state.naps = state.naps.filter((nap) => {
        return !naps.find(current => current.id === nap.id)
      })
    } catch (error) {
      throw new Error(`CURRENTNAPS MUTATE ${error}`)
    }
  },
  getServiceNapsList (state, serviceNapsList) {
    try {
      state.serviceNapsList = []
      state.serviceNapsList = serviceNapsList
    } catch (error) {
      throw new Error(`CLIENTNAPDATA MUTATE ${error}`)
    }
  }
}
export const actions = {
  removeNap ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}clients/${payload.client.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          },
          body: JSON.stringify({
            data: {
              naps: []
            }
          })
        })
          .then(res => res.json())
          .then((client) => {
            resolve(client.data)
          })
      })
    } catch (error) {
      throw new Error(`NAPS GET ACTION ${error}`)
    }
  },
  async createNap (_, napPayload) {
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}naps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${napPayload.token}`
        },
        body: JSON.stringify({
          data: napPayload.nap
        })
      })
    } catch (error) {
      throw new Error(`NAPS CREATE ACTION ${error}`)
    }
  },
  getNaps ({ commit }, payload) {
    const qs = require('qs')
    const query = qs.stringify({
      filters: {
        city: {
          name: {
            $eq: payload.city
          }
        }
      },
      populate: ['city', 'naptype', 'neighborhood', 'technology'],
      pagination: {
        page: 1,
        pageSize: 10000
      },
      sort: ['createdAt:desc']
    },
    {
      encodeValuesOnly: true
    })
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}naps?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then(({ data: naps }) => {
            commit('napList', naps)
            resolve(naps)
          })
      })
    } catch (error) {
      throw new Error(`NAPS GET ACTION ${error}`)
    }
  },
  async getNapTypes ({ commit }, token) {
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}naptypes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then((naptypes) => {
          commit('napTypes', naptypes.data)
        })
    } catch (error) {
      throw new Error(`NAPSTYPES GET ACTION ${error}`)
    }
  },
  saveServiceNap ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}services/${payload.service.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          },
          body: JSON.stringify({
            data: {
              naps: [payload.nap.id, ...payload.current?.map(nap => nap.id)]
            }
          })
        })
          .then(res => res.json())
          .then((naps) => {
            this.$toast.info(`${payload.service.id} agregado a NAP ${payload.nap.code}`, { duration: 2000 })
            resolve(naps)
          })
      })
    } catch (error) {
      throw new Error(`NAPS SAVE SERVICE ACTION ${error}`)
    }
  },
  getServiceNapsList ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}services/${payload.service.id}?populate=naps`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then(({ data: clientNapData }) => {
            console.log(clientNapData)
            commit('getServiceNapsList', clientNapData ? clientNapData.naps ? clientNapData.naps : [] : [])
            resolve(clientNapData)
          })
      })
    } catch (error) {
      throw new Error(`NAPS GET CLIENT ACTION ${error}`)
    }
  },
  updateNap ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}naps/${payload.nap.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          },
          body: JSON.stringify({
            data: payload.nap
          })
        })
          .then(res => res.json())
          .then((nap) => {
            resolve(nap.data)
          })
      })
    } catch (error) {
      throw new Error(`NAPS UPDATE ACTION ${error}`)
    }
  }
}
