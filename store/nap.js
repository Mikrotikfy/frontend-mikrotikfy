export const state = () => ({
  naps: []
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
  }
}
export const actions = {
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
  async getNaps ({ commit }, payload) {
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
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}naps?${query}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then((naps) => {
          commit('napList', naps.data)
        })
    } catch (error) {
      throw new Error(`NAPS GET ACTION ${error}`)
    }
  },
  async getNapTypes ({ commit }, token) {
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}naptypes`, {
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
  }
}
