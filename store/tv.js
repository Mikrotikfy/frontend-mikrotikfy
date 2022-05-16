export const state = () => ({
  spectypes: []
})
export const mutations = {
  getTvSpecTypes (state, spectypes) {
    try {
      state.spectypes = spectypes
    } catch (error) {
      throw new Error(`TV SPEC TYPES MUTATE ${error}`)
    }
  }
}
export const actions = {
  async getTvSpecTypes ({ commit }, payload) {
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}tvspectypes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then((spectypes) => {
          commit('getTvSpecTypes', spectypes.data)
        })
    } catch (error) {
      throw new Error(`TV SPEC TYPES ACTION ${error}`)
    }
  },
  async saveSpecs ({ commit }, payload) {
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}tvspecs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        },
        body: JSON.stringify({
          data: {
            client: payload.clientid,
            ...payload.specs
          }
        })
      })
        .then((res) => {
          if (res.status === 200) {
            this.$toast.success('Guardado con exito', { duration: 4000 })
          }
        })
    } catch (error) {
      throw new Error(`TV SPECS SAVE ${error}`)
    }
  }
}
